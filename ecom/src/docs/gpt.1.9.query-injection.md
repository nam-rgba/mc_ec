Dòng comment:

```js
// Không “nhả” rest vào filter để tránh query injection
```

có nghĩa là:

> **Không đưa phần còn lại (`rest`) của `query` vào `filter`, để tránh nguy cơ bị tấn công dạng query injection.**

---

### 🎯 Bối cảnh:

Trong đoạn code bạn có:

```js
const { q, email, name, role, status, ...rest } = query;
```

Ở đây `...rest` sẽ chứa **tất cả các trường còn lại** ngoài `q`, `email`, `name`, `role`, và `status`.

Ví dụ nếu client gửi query như sau:

```http
GET /api/users?q=nam&isAdmin[$ne]=true
```

thì `rest` sẽ có giá trị:

```js
{ 'isAdmin[$ne]': 'true' }
```

Nếu bạn **"nhả" nguyên `rest` vào `filter`** (như `filter = { ...rest }`), thì hacker có thể **chèn các toán tử MongoDB độc hại** như:

* `$ne` (not equal)
* `$gt`, `$lt`, `$in`, `$regex`, `$where`, v.v.
* hoặc thậm chí là biểu thức truy vấn tùy chỉnh để **bypass kiểm tra phân quyền**, **truy vấn dữ liệu ngoài ý muốn**, hoặc **tấn công NoSQL injection**

---

### 🔥 Ví dụ tấn công NoSQL Injection:

Client gửi:

```
?status[$ne]=inactive
```

Nếu bạn `filter = { ...query }`, thì sẽ thành:

```js
filter = {
  status: { $ne: "inactive" }
}
```

→ Điều này sẽ **trả về tất cả user không có `status` là `inactive`**, bất chấp quyền hạn.

---

### ✅ Cách làm hiện tại là đúng:

```js
const filter = {};

// Chỉ lọc các trường rõ ràng (được kiểm soát)
if (email) filter.email = email;
if (name)  filter.name  = new RegExp(String(name), 'i');
...
// Không nhả ...rest vào filter
return filter;
```

→ Điều này giúp **bảo vệ an toàn** cho backend, chỉ cho phép lọc theo các trường cụ thể đã được xác định.

---

### 🛡️ Tổng kết:

* `rest` chứa các key không được kiểm soát → có thể bị lợi dụng để thực hiện tấn công MongoDB injection.
* Không thêm `rest` vào `filter` → đảm bảo **chỉ các field hợp lệ** mới được dùng để lọc dữ liệu.
* Đây là một cách **phòng ngừa bảo mật** rất quan trọng trong các hệ thống Node.js dùng MongoDB (đặc biệt là Mongoose).
