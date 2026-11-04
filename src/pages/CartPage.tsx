import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  clearCart,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from '../features/cart/cartSlice'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const count = useAppSelector(selectCartCount)
  const total = useAppSelector(selectCartTotal)

  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Hãy chọn vài sản phẩm yêu thích để bắt đầu mua sắm.</p>
        <Link to="/" className="btn">Xem sản phẩm</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Giỏ hàng ({count} sản phẩm)</h1>
      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (
            <div className="cart-row" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="cart-info">
                <Link to={`/products/${item.id}`} className="cart-name">
                  {item.title}
                </Link>
                <span className="muted">Đơn giá: ${item.price.toFixed(2)}</span>
              </div>
              <div className="qty">
                <button
                  className="btn btn-outline btn-sm"
                  aria-label="Giảm số lượng"
                  onClick={() =>
                    dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                  }
                >
                  -
                </button>
                <span className="qty-num">{item.quantity}</span>
                <button
                  className="btn btn-outline btn-sm"
                  aria-label="Tăng số lượng"
                  onClick={() =>
                    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                  }
                >
                  +
                </button>
              </div>
              <strong className="line-total">
                ${(item.price * item.quantity).toFixed(2)}
              </strong>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Xoá
              </button>
            </div>
          ))}
        </div>

        <aside className="summary">
          <h2>Tóm tắt đơn hàng</h2>
          <div className="summary-row">
            <span>Số lượng</span>
            <span>{count}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Tổng tiền</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn btn-block">
            Tiến hành thanh toán
          </Link>
          <button
            className="btn btn-outline btn-block"
            onClick={() => dispatch(clearCart())}
          >
            Xoá toàn bộ giỏ hàng
          </button>
        </aside>
      </div>
    </div>
  )
}
