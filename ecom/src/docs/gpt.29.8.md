Bạn nên “chuẩn hoá” input (page/limit/skip/query), đặt mặc định + giới hạn an toàn, rồi trả về **data + meta** (total, pages, hasNext…). Dưới đây là 2 cách phổ biến với Mongoose:

---

# 1) Offset-based (find + countDocuments)

```js
// repositories/user.repo.js
const userModel = require('../schemas/user.schema');

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function normalizePaging({ page, limit, skip }) {
  let _limit = Number(limit) || DEFAULT_LIMIT;
  if (_limit > MAX_LIMIT) _limit = MAX_LIMIT;
  if (_limit < 1) _limit = DEFAULT_LIMIT;

  // Nếu có skip thì ưu tiên skip, còn không thì tính từ page
  let _skip = Number(skip);
  if (Number.isNaN(_skip) || _skip < 0) {
    const _page = Number(page) || 1;
    _skip = (_page - 1) * _limit;
  }

  return { limit: _limit, skip: _skip };
}

/**
 * Xây filter an toàn từ query thô của API.
 * - Cho phép tìm kiếm q (regex) trên name/email
 * - Cho phép lọc theo các field whitelisted
 */
function buildFilter(query = {}) {
  const { q, email, name, role, status, ...rest } = query;

  const filter = {};
  if (q) {
    const rx = new RegExp(String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }
  if (email) filter.email = email;
  if (name)  filter.name  = new RegExp(String(name), 'i');
  if (role)  filter.role  = role;
  if (status !== undefined) filter.status = status;

  // Không “nhả” rest vào filter để tránh query injection
  return filter;
}

/**
 * sort: chuỗi '-createdAt' hoặc object { createdAt: -1 }
 * select: 'name email role' hoặc object { name: 1, email: 1 }
 */
async function findAll({
  page,
  limit,
  skip,
  query,
  sort = '-createdAt',
  select,
  lean = true,
}) {
  const { limit: _limit, skip: _skip } = normalizePaging({ page, limit, skip });
  const filter = buildFilter(query);

  // Đếm tổng trước (có thể tách transaction nếu cần)
  const total = await userModel.countDocuments(filter);

  const users = await userModel
    .find(filter, select)
    .sort(sort)
    .skip(_skip)
    .limit(_limit)
    .lean(lean); // .lean() để nhẹ RAM/nhanh hơn nếu chỉ cần đọc

  const currentPage = Math.floor(_skip / _limit) + 1;
  const pages = Math.max(1, Math.ceil(total / _limit));

  return {
    data: users,
    meta: {
      total,
      limit: _limit,
      page: currentPage,
      pages,
      hasPrev: currentPage > 1,
      hasNext: currentPage < pages,
    },
  };
}

module.exports = { findAll };
```

**Điểm chính:**

* Ưu tiên `skip` nếu được truyền; nếu không thì tính từ `page`.
* Giới hạn `limit` để tránh query quá nặng.
* Sanitize `query` và **whitelist** field được phép lọc.
* `lean()` để tối ưu nếu chỉ đọc.
* Trả về `meta` đầy đủ để front-end phân trang.

---

# 2) Một chuyến với Aggregation (\$facet)

Giảm 2 round-trip (find + count) thành 1:

```js
async function findAllAgg({ page, limit, skip, query, sort = { createdAt: -1 }, select }) {
  const { limit: _limit, skip: _skip } = normalizePaging({ page, limit, skip });
  const filter = buildFilter(query);

  // Chuẩn hoá select dạng projection
  let projection;
  if (typeof select === 'string') {
    projection = select.split(/\s+/).reduce((acc, k) => (k ? { ...acc, [k]: 1 } : acc), {});
  } else if (select && typeof select === 'object') {
    projection = select;
  }

  const pipeline = [
    { $match: filter },
    { $sort: typeof sort === 'string'
        ? (sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 })
        : sort },
    {
      $facet: {
        data: [{ $skip: _skip }, { $limit: _limit }, ...(projection ? [{ $project: projection }] : [])],
        totalCount: [{ $count: 'count' }],
      },
    },
    {
      $project: {
        data: 1,
        total: { $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] },
      },
    },
  ];

  const [res] = await userModel.aggregate(pipeline);
  const total = res?.total || 0;
  const data = res?.data || [];

  const currentPage = Math.floor(_skip / _limit) + 1;
  const pages = Math.max(1, Math.ceil(total / _limit));

  return {
    data,
    meta: {
      total,
      limit: _limit,
      page: currentPage,
      pages,
      hasPrev: currentPage > 1,
      hasNext: currentPage < pages,
    },
  };
}
```

---

## Khi nào chọn cách nào?

* **find + countDocuments**: đơn giản, dễ đọc, phù hợp hầu hết use-case.
* **Aggregation \$facet**: khi cần thêm bước `$lookup`, `$project`… và muốn **một** round-trip.

## Gợi ý thêm

* Cho phép `cursor-based` pagination (dựa vào `_id` hoặc `createdAt`) cho bảng lớn để tránh chi phí `.skip()` lớn.
* Đặt **index** trên các trường hay lọc/sort (`email`, `role`, `status`, `createdAt`, và `text index` nếu có `q`).
* Không pass thẳng `query` từ client vào Mongo; luôn **allowlist** và/hoặc map về filter hợp lệ như ví dụ.

Bạn chỉ cần thay `findAll` hiện tại bằng một trong hai phiên bản trên là ổn. Nếu muốn mình viết luôn bản **cursor-based** (nextCursor/prevCursor) cho bạn dùng với `_id`, mình đưa kèm ngay.
