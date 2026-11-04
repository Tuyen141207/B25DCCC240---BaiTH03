import { Link, NavLink } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectCartCount } from '../features/cart/cartSlice'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Header() {
  const cartCount = useAppSelector(selectCartCount)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          Shop<span>Mini</span>
        </Link>
        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Trang chủ
          </NavLink>
          <NavLink to="/cart" className="nav-link">
            Giỏ hàng
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </NavLink>
          {user ? (
            <>
              <span className="user-name">
                Xin chào, <strong>{user.username}</strong>
              </span>
              <button className="btn btn-outline btn-sm" onClick={logout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link">
              Đăng nhập
            </NavLink>
          )}
          <button className="btn btn-outline btn-sm" onClick={toggleTheme}>
            {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
          </button>
        </nav>
      </div>
    </header>
  )
}
