const { DEFAULT_LIMIT, MAX_LIMIT, DEFAULT_PAGE } = require('../constants/default-query');
const userModel = require('../models/user.model');




const normalizePaging = ({ page, limit, skip }) => {
    let _limit = Number(limit) || DEFAULT_LIMIT;
    if (_limit > MAX_LIMIT) _limit = MAX_LIMIT;
    if (_limit < 1) _limit = DEFAULT_LIMIT;

    let _skip = Number(skip);
    if (Number.isNaN(_skip) || _skip < 0) {
        const _page = Number(page) || DEFAULT_PAGE;
        _skip = (_page - 1) * _limit;
    }
    return { skip: _skip, limit: _limit, page: _page }

}

/**
 * Xây filter an toàn từ query thô của API.
 * - Cho phép tìm kiếm q (regex) trên name/email
 * - Cho phép lọc theo các field whitelisted
 */



const buildFilter = (query = {}) => {
    const { q, email, name, ...rest } = query

    const filter = {}

    // Tìm kiếm theo từ khóa
    if (q) {
        const rx = new RegExp(String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') // escape regex
        filter.$or = [
            { name: rx },
            { email: rx }
        ]
    }
    if (email) filter.email = email;
    // flag 'i' => không phân biệt hoa/thường
    if (name) filter.name = new RegExp(String(name), 'i');

    // Không “nhả” rest vào filter để tránh query injection
    return filter;
}


// findall
const findAll = async ({ page, limit, skip, query, sort = '-createdAt', select, lean = true, }) => {
    // step 1: normalizePaging
    const { limit: _limit, skip: _skip } = normalizePaging({ page, limit, skip });

    // step 2: get filter
    const filter = buildFilter(query);

    // step 3: get users
    const user = await userModel.find(filter)
        .select(filter, select)
        .sort(sort)
        .skip(_skip)
        .limit(_limit)
        .lean(lean);

    const total = await userModel.countDocuments(filter);
    const currentPage = Math.floor(_skip / _limit) + 1;
    const pages = Math.max(1, Math.ceil(total / _limit));

    return {
        users: user,
        metadata: {
            total,
            currentPage,
            pages
        }
    }
}

//findOne
const findOne = async (q, select) => {
    return await userModel.findOne(q)
        .select(select)
        .lean();
}

// create user
const create = async (data) => {
    const newUser =  await userModel.create(data)
    return newUser;
}


module.exports = {findOne, findAll, create}
