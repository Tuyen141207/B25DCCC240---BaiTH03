import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  clearCart,
  selectCartItems,
  selectCartTotal,
} from '../features/cart/cartSlice'
import { useAuth } from '../contexts/AuthContext'

export default function CheckoutPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const { user } = useAuth()
  const [ordered, setOrdered] = useState(false)

  const handleOrder = () => {
    dispatch(clearCart())
    setOrdered(true)
  }

  if (ordered) {
    return (
      <div className="empty empty-success">
        <h2>Đặt hàng thành công!</h2>
        <p>Cảm ơn {user?.username} đã mua hàng tại ShopMini.</p>
        <Link to="/" className="btn">Tiếp tục mua sắm</Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Không có gì để thanh toán</h2>
        <p>Giỏ hàng của bạn đang trống.</p>
        <Link to="/" className="btn">Về trang chủ</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Thanh toán</h1>
      <div className="cart-layout">
        <div className="panel">
          <h2>Thông tin đơn hàng</h2>
          <p>
            Người đặt: <strong>{user?.username}</strong>
          </p>
          <ul className="order-list">
            {items.map((i) => (
              <li key={i.id}>
                <span>
                  {i.title} (x{i.quantity})
                </span>
                <strong>${(i.price * i.quantity).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        </div>

        <aside className="summary">
          <h2>Tổng cộng</h2>
          <div className="summary-row summary-total">
            <span>Tổng tiền</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-block" onClick={handleOrder}>
            Đặt hàng
          </button>
          <Link to="/cart" className="btn btn-outline btn-block">
            Quay lại giỏ hàng
          </Link>
        </aside>
      </div>
    </div>
  )
}
