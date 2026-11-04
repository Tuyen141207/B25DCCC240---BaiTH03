import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="empty">
      <h1 className="big-404">404</h1>
      <h2>Không tìm thấy trang</h2>
      <p>Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi.</p>
      <Link to="/" className="btn">Về trang chủ</Link>
    </div>
  )
}
