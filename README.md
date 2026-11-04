# ShopMini

Ứng dụng cửa hàng mini xây dựng bằng **React + TypeScript (Vite)**. State toàn cục được quản lý bằng **Context API** (theme, đăng nhập) và **Redux Toolkit** (sản phẩm, giỏ hàng).

- Sinh viên: `<Họ và tên>`
- Mã sinh viên: `<Mã sinh viên>`
- Bài thực hành: BaiTH03

---

## 1. Công nghệ sử dụng

| Công nghệ | Vai trò |
|---|---|
| React 18+ và TypeScript | Xây dựng giao diện, kiểu dữ liệu đầy đủ (không dùng `any`) |
| Vite | Công cụ build và chạy dự án |
| Redux Toolkit, React-Redux | Quản lý state sản phẩm và giỏ hàng |
| Context API | Quản lý theme và trạng thái đăng nhập |
| React Router DOM | Định tuyến, route được bảo vệ |
| Fake Store API | Nguồn dữ liệu sản phẩm |

---

## 2. Chức năng

- Trang chủ hiển thị lưới sản phẩm lấy từ API, có ô tìm kiếm theo tên.
- Lưới sản phẩm responsive: 1 cột (điện thoại), 2 cột (tablet), 4 cột (desktop).
- Trang chi tiết sản phẩm, có thể truy cập trực tiếp bằng URL `/products/:id`.
- Giỏ hàng: thêm, xoá, tăng/giảm số lượng, xoá toàn bộ, hiển thị tổng số lượng và tổng tiền.
- Đăng nhập giả lập (mật khẩu đúng là `123456`).
- Trang thanh toán được bảo vệ: chưa đăng nhập sẽ bị chuyển sang `/login`, đăng nhập xong quay lại trang trước đó.
- Nút "Đặt hàng" xoá giỏ hàng và hiện thông báo thành công.
- Đổi giao diện sáng/tối, ghi nhớ lựa chọn sau khi tải lại trang.
- Trang 404 cho đường dẫn không tồn tại.
- Header dùng chung: số lượng sản phẩm trong giỏ, tên người dùng, nút đăng xuất, nút đổi theme.

---

## 3. Hướng dẫn cài đặt và chạy

Yêu cầu: Node.js 18 trở lên.

```bash
# Cài thư viện
npm install

# Chạy môi trường phát triển
npm run dev

# Kiểm tra TypeScript và build bản production
npm run build

# Xem thử bản build
npm run preview
```

Sau khi chạy `npm run dev`, mở `http://localhost:5173`.

**Tài khoản đăng nhập giả lập:** tên đăng nhập bất kỳ (không để trống), mật khẩu `123456`.

---

## 4. Cấu trúc thư mục

```
src/
├── app/
│   ├── store.ts                 configureStore, kiểu RootState và AppDispatch
│   └── hooks.ts                 useAppDispatch, useAppSelector (đã gắn kiểu)
├── features/
│   ├── products/productsSlice.ts    createAsyncThunk gọi API, trạng thái tải dữ liệu
│   └── cart/cartSlice.ts            các action giỏ hàng và selector
├── contexts/
│   ├── ThemeContext.tsx         ThemeProvider, useTheme()
│   └── AuthContext.tsx          AuthProvider, useAuth()
├── components/
│   ├── Header.tsx               thanh điều hướng dùng chung
│   ├── ProductCard.tsx          thẻ sản phẩm trong lưới
│   └── ProtectedRoute.tsx       chặn truy cập khi chưa đăng nhập
├── layouts/MainLayout.tsx       Header + nội dung trang (Outlet) + chân trang
├── pages/
│   ├── HomePage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── LoginPage.tsx
│   ├── CheckoutPage.tsx
│   └── NotFoundPage.tsx
├── types/index.ts               Product, CartItem, User, Theme
├── App.tsx                      khai báo Routes
├── main.tsx                     bọc Provider, ThemeProvider, AuthProvider, BrowserRouter
└── index.css                    giao diện và biến màu sáng/tối
```

---

## 5. Danh sách route

| Đường dẫn | Trang | Ghi chú |
|---|---|---|
| `/` | HomePage | Lưới sản phẩm, tìm kiếm |
| `/products/:id` | ProductDetailPage | Chi tiết một sản phẩm |
| `/cart` | CartPage | Giỏ hàng |
| `/login` | LoginPage | Đăng nhập giả lập |
| `/checkout` | CheckoutPage | Route được bảo vệ (`ProtectedRoute`) |
| `*` | NotFoundPage | Mọi đường dẫn còn lại |

---

## 6. API

- Danh sách sản phẩm: `https://fakestoreapi.com/products`
- Mỗi sản phẩm gồm: `id`, `title`, `price`, `description`, `category`, `image`.

Trang chi tiết không gọi API riêng mà lấy sản phẩm từ danh sách đã có trong Redux store. Nếu người dùng vào thẳng URL chi tiết khi chưa có dữ liệu, trang sẽ tự dispatch `fetchProducts()` rồi mới hiển thị.

---

## 7. Phân chia state: dữ liệu nào để ở đâu và lý do

### 7.1. Nguyên tắc chọn nơi lưu

| Nơi lưu | Dùng khi |
|---|---|
| `useState` | Dữ liệu chỉ phục vụ một component, không cần chia sẻ, mất đi khi component biến mất cũng không sao. |
| Context API | Dữ liệu toàn cục, nhiều component cần đọc, ít thay đổi, logic đơn giản (một giá trị cùng vài hàm). |
| Redux Toolkit | Dữ liệu dùng chung ở nhiều trang, có nhiều action, có dữ liệu dẫn xuất (selector), hoặc có xử lý bất đồng bộ cần theo dõi trạng thái. |

### 7.2. Bảng phân chia cụ thể

| Dữ liệu | Nơi lưu | Lý do |
|---|---|---|
| Từ khoá tìm kiếm `keyword` (HomePage) | `useState` | Chỉ HomePage dùng. Không ai khác cần biết từ khoá, rời trang thì reset là hợp lý. |
| Form đăng nhập: `username`, `password`, `error` (LoginPage) | `useState` | State cục bộ của form, chỉ tồn tại trong lúc nhập. Không nên đưa mật khẩu vào store toàn cục. |
| Cờ `ordered` (CheckoutPage) | `useState` | Chỉ dùng để chuyển giữa màn hình đặt hàng và màn hình thông báo thành công của riêng trang này. |
| Cờ `added` (ProductCard, ProductDetailPage) | `useState` | Hiệu ứng tạm thời "Đã thêm" trong 1,5 giây, chỉ liên quan đến một nút. |
| Theme sáng/tối: `theme`, `toggleTheme` | Context (`ThemeContext`) | Nhiều component cần đọc (Header, toàn app qua thuộc tính `data-theme`), thay đổi hiếm, chỉ có một giá trị và một hàm nên không cần Redux. |
| Người dùng đăng nhập: `user`, `login`, `logout` | Context (`AuthContext`) | Header, LoginPage, ProtectedRoute, CheckoutPage đều cần. Là state toàn cục nhưng đơn giản, không có dữ liệu dẫn xuất hay bất đồng bộ. |
| Danh sách sản phẩm và trạng thái `idle / loading / succeeded / failed` cùng thông báo lỗi | Redux (`productsSlice`) | Dữ liệu bất đồng bộ từ API, dùng chung HomePage và ProductDetailPage. `createAsyncThunk` cho ba trạng thái pending/fulfilled/rejected rõ ràng, tránh gọi API lặp lại. |
| Giỏ hàng `items`, tổng số lượng, tổng tiền | Redux (`cartSlice`) | Nhiều nơi đọc và ghi (ProductCard, ProductDetailPage, CartPage, CheckoutPage, Header). Có nhiều action (add, remove, update, clear) và dữ liệu dẫn xuất tính bằng selector. |

### 7.3. Vì sao không dùng Redux cho tất cả

Theme và đăng nhập chỉ là vài giá trị đơn giản, ít thay đổi. Dùng Context cho gọn, không phải viết slice, action, reducer. Ngược lại, giỏ hàng và danh sách sản phẩm có nhiều thao tác và cần tính toán nên dùng Redux Toolkit sẽ rõ ràng, dễ kiểm soát và dễ mở rộng hơn.

### 7.4. Vì sao không để tất cả trong Context

Context sẽ làm mọi component dùng nó render lại mỗi khi giá trị đổi, và không có sẵn cơ chế xử lý bất đồng bộ hay selector. Với giỏ hàng (thay đổi thường xuyên), Redux Toolkit với `useAppSelector` tối ưu hơn vì component chỉ render lại khi phần dữ liệu nó chọn thay đổi.

---

## 8. Chi tiết Redux Toolkit

### 8.1. `productsSlice`

State:

```ts
{ items: Product[]; status: 'idle' | 'loading' | 'succeeded' | 'failed'; error: string | null }
```

- Thunk `fetchProducts` gọi `fetch('https://fakestoreapi.com/products')`, dùng `rejectWithValue` để trả thông báo lỗi dễ đọc khi HTTP lỗi hoặc mất kết nối.
- `pending`: đặt `status = 'loading'`, xoá lỗi cũ.
- `fulfilled`: đặt `status = 'succeeded'`, lưu danh sách vào `items`.
- `rejected`: đặt `status = 'failed'`, lưu thông báo lỗi.
- Selector: `selectProducts`, `selectProductsStatus`, `selectProductsError`, `selectProductById`.

### 8.2. `cartSlice`

State: `{ items: CartItem[] }`, trong đó `CartItem = Product + quantity`.

| Action | Mô tả |
|---|---|
| `addToCart(product)` | Thêm sản phẩm; nếu đã có thì tăng số lượng thêm 1 |
| `removeFromCart(id)` | Xoá một sản phẩm khỏi giỏ |
| `updateQuantity({ id, quantity })` | Đặt số lượng mới; nếu `quantity <= 0` thì xoá sản phẩm |
| `clearCart()` | Xoá toàn bộ giỏ hàng |

Selector: `selectCartItems`, `selectCartCount` (tổng số lượng), `selectCartTotal` (tổng tiền = tổng của `price * quantity`).

### 8.3. Hook có kiểu

`app/hooks.ts` định nghĩa `useAppDispatch` và `useAppSelector` đã gắn sẵn kiểu `AppDispatch` và `RootState`, nên toàn bộ dự án không cần khai báo kiểu lặp lại và không dùng `any`.

---

## 9. Chi tiết Context API

### 9.1. `ThemeContext`

- Cung cấp `theme` (`'light' | 'dark'`) và `toggleTheme()`.
- Khi đổi theme, gán `data-theme` lên thẻ `<html>`; CSS đổi bộ biến màu tương ứng.
- Lưu lựa chọn vào `localStorage` để giữ lại sau khi tải lại trang.
- Hook `useTheme()` ném lỗi rõ ràng nếu dùng ngoài `ThemeProvider`.

### 9.2. `AuthContext`

- Cung cấp `user` (`User | null`), `login(username, password)` và `logout()`.
- `login` trả về `true` khi tên đăng nhập không rỗng và mật khẩu là `123456`, ngược lại trả về `false`.
- Lưu người dùng vào `localStorage` để không bị đăng xuất khi tải lại trang.
- Hook `useAuth()` ném lỗi rõ ràng nếu dùng ngoài `AuthProvider`.

---

## 10. Luồng route được bảo vệ

1. Người dùng chưa đăng nhập vào `/checkout` (bấm "Thanh toán" ở giỏ hàng).
2. `ProtectedRoute` thấy `user === null`, chuyển sang `/login` và gửi kèm `state: { from: '/checkout' }`.
3. `LoginPage` đọc `from`, người dùng đăng nhập đúng thì `navigate(from, { replace: true })`.
4. Người dùng quay lại `/checkout`. Nếu đã đăng nhập sẵn mà vào `/login`, trang tự chuyển về `from` hoặc `/`.

---

## 11. Thứ tự bọc Provider trong `main.tsx`

```
Redux Provider
  ThemeProvider
    AuthProvider
      BrowserRouter
        App
```

Tất cả component bên trong đều dùng được store Redux, theme, thông tin đăng nhập và router.

---

## 12. Danh sách kiểm tra chức năng

- [ ] Trang chủ tải được sản phẩm, hiển thị 1/2/4 cột khi đổi kích thước cửa sổ.
- [ ] Gõ vào ô tìm kiếm thì danh sách lọc theo tên.
- [ ] Thêm sản phẩm thì số lượng trên Header tăng.
- [ ] Trang giỏ hàng: tăng, giảm, xoá, xoá toàn bộ, tổng tiền đúng.
- [ ] Chưa đăng nhập bấm "Thanh toán" thì chuyển sang `/login`.
- [ ] Đăng nhập với mật khẩu `123456` thì quay lại `/checkout`.
- [ ] Đăng nhập sai mật khẩu thì hiện thông báo lỗi.
- [ ] "Đặt hàng" xoá giỏ hàng và hiện thông báo thành công.
- [ ] Nút đăng xuất và nút đổi theme hoạt động; tải lại trang vẫn giữ theme và đăng nhập.
- [ ] Vào đường dẫn không tồn tại như `/abc` thì hiện trang 404.
- [ ] `npm run build` không báo lỗi TypeScript.

---

## 13. Ghi chú

- Đăng nhập chỉ là giả lập phục vụ bài thực hành, không có máy chủ xác thực thật.
- Giỏ hàng chỉ lưu trong bộ nhớ Redux, tải lại trang sẽ mất giỏ hàng. Có thể mở rộng bằng cách lưu giỏ hàng vào `localStorage`.
- Giá sản phẩm lấy từ API theo đơn vị USD.
- Thư mục `node_modules` và `dist` đã nằm trong `.gitignore` nên không được đẩy lên repository.
