// Base URL cho tất cả API requests
// - Local: "http://localhost:5000/api"
// - Production: "https://api.example.com"
const API_BASE_URL = "http://localhost:5000/api";

// Hàm helper để fetch API - xử lý authentication tự động
// - endpoint: đường dẫn API (ví dụ: "/auth/login")
// - options: tùy chọn fetch (method, body, headers, ...)
// - async: hàm bất đồng bộ (có thể chứa await)
const fetchAPI = async (endpoint, options = {}) => {
  // Lấy user từ localStorage - nếu user login thì có token
  // - localStorage.getItem("user"): lấy chuỗi JSON từ localStorage
  // - JSON.parse(): chuyển chuỗi JSON thành object
  // - Nếu không tìm thấy "user" key → trả về null
  const user = JSON.parse(localStorage.getItem("user"));

  // Headers mặc định - tất cả requests phải có Content-Type
  // - "Content-Type": "application/json": gửi dữ liệu dạng JSON
  // - ...options.headers: merge với headers nếu có (nếu người dùng pass thêm headers)
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Nếu user đã login → thêm token vào header
  // - headers.Authorization: header dùng để xác thực
  // - `Bearer ${user.token}`: format "Bearer + token" (standard JWT format)
  // - Ví dụ: "Authorization: Bearer eyJhbGciOi..."
  if (user && user.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  // Gửi request tới server
  // - fetch(): hàm built-in browser để gửi HTTP request
  // - `${API_BASE_URL}${endpoint}`: ghép URL + endpoint
  // - Ví dụ: "https://api.example.com" + "/auth/login" = "https://api.example.com/auth/login"
  // - ...options: merge các tùy chọn (method, body, ...)
  // - headers: thêm headers đã chuẩn bị ở trên
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Kiểm tra response status code
  // - response.ok: true nếu status 200-299, false nếu lỗi (4xx, 5xx)
  // - Nếu không ok → ném lỗi (throw Error)
  // - response.status: status code (200, 404, 500, ...)
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  // Chuyển response thành JSON object và return
  // - response.json(): đọc response body và parse JSON
  // - Ví dụ: response body "{\"user\": \"John\"}" → object {user: "John"}
  return response.json();
};

// Object chứa tất cả Auth APIs
// - Mục đích: tập trung quản lý authentication endpoints
export const authAPI = {
  // Hàm register - tạo tài khoản mới
  // - Parameters: email, password, fullName
  // - POST /auth/register với body: {email, password, fullName}
  // - Return: response từ server (user object, token, ...)
  register: (email, password, fullName) =>
    fetchAPI("/auth/register", {
      method: "POST", // HTTP method POST (tạo mới)
      body: JSON.stringify({ email, password, fullName }), // Chuyển object thành JSON string
    }),

  // Hàm login - đăng nhập
  // - Parameters: email, password
  // - POST /auth/login với body: {email, password}
  // - Return: user object + token nếu thành công
  login: (email, password) =>
    fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // Hàm logout - đăng xuất
  // - POST /auth/logout (không cần body)
  // - Server sẽ hủy session/token
  logout: () => fetchAPI("/auth/logout", { method: "POST" }),
};

// Object chứa tất cả Products APIs
// - Mục đích: quản lý product endpoints (lấy danh sách, tìm kiếm, ...)
export const productsAPI = {
  // Lấy tất cả sản phẩm
  // - GET /products
  // - Return: array các product objects
  getAll: () => fetchAPI("/products"),

  // Lấy sản phẩm theo ID
  // - GET /products/{id}
  // - Parameter: id (product ID)
  // - Return: 1 product object
  getById: (id) => fetchAPI(`/products/${id}`),

  // Tìm kiếm sản phẩm
  // - GET /products/search?q={query}
  // - Parameter: query (từ khóa tìm kiếm)
  // - Ví dụ: search("laptop") → GET /products/search?q=laptop
  // - Return: array sản phẩm match với query
  search: (query) => fetchAPI(`/products/search?q=${query}`),
};

// Object chứa tất cả Orders APIs
// - Mục đích: quản lý order endpoints (tạo, lấy danh sách, ...)
export const ordersAPI = {
  // Tạo order mới
  // - POST /orders với body: orderData (sản phẩm, địa chỉ, ...)
  // - Parameter: orderData (object chứa chi tiết đơn hàng)
  // - Return: order object + order ID
  create: (orderData) =>
    fetchAPI("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  // Lấy tất cả orders của user
  // - GET /orders (server tự lấy user từ token)
  // - Return: array các order objects
  getAll: () => fetchAPI("/orders"),

  // Lấy order theo ID
  // - GET /orders/{id}
  // - Parameter: id (order ID)
  // - Return: 1 order object (chi tiết đơn hàng)
  getById: (id) => fetchAPI(`/orders/${id}`),
};

// Object chứa tất cả Users APIs
// - Mục đích: quản lý user profile endpoints (xem, cập nhật, đổi password, ...)
export const usersAPI = {
  // Lấy thông tin profile của user
  // - GET /users/profile (lấy user từ token)
  // - Return: user object (fullName, email, avatar, ...)
  getProfile: () => fetchAPI("/users/profile"),

  // Cập nhật thông tin profile
  // - PUT /users/profile với body: userData (fullName, avatar, ...)
  // - Parameter: userData (object chứa thông tin cập nhật)
  // - Return: updated user object
  updateProfile: (userData) =>
    fetchAPI("/users/profile", {
      method: "PUT", // HTTP method PUT (cập nhật toàn bộ)
      body: JSON.stringify(userData),
    }),

  // Đổi mật khẩu
  // - POST /users/change-password với body: {currentPassword, newPassword}
  // - Parameters: currentPassword (mật khẩu cũ), newPassword (mật khẩu mới)
  // - Server sẽ xác minh currentPassword trước khi cập nhật
  // - Return: success message
  changePassword: (currentPassword, newPassword) =>
    fetchAPI("/users/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};
