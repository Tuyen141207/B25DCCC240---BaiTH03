import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  fetchProducts,
  selectProductById,
  selectProductsStatus,
} from '../features/products/productsSlice'
import { addToCart } from '../features/cart/cartSlice'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectProductsStatus)
  const product = useAppSelector((state) => selectProductById(state, Number(id)))
  const [added, setAdded] = useState(false)

  // Trường hợp vào thẳng URL chi tiết, chưa có dữ liệu
  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [status, dispatch])

  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 1500)
    return () => clearTimeout(timer)
  }, [added])

  if (status === 'idle' || status === 'loading') {
    return <p className="notice">Đang tải thông tin sản phẩm...</p>
  }
  if (status === 'failed') {
    return <p className="notice notice-error">Không tải được dữ liệu. Vui lòng thử lại sau.</p>
  }

  if (!product) {
    return (
      <div className="notice">
        <p>Không tìm thấy sản phẩm này.</p>
        <Link to="/" className="btn">Về trang chủ</Link>
      </div>
    )
  }

  const handleAdd = () => {
    dispatch(addToCart(product))
    setAdded(true)
  }

  return (
    <div>
      <p className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <span>{product.title}</span>
      </p>
      <div className="detail">
        <div className="detail-img">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="detail-info">
          <span className="tag">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="price price-lg">${product.price.toFixed(2)}</p>
          <p className="description">{product.description}</p>
          <button
            className={added ? 'btn btn-success' : 'btn'}
            onClick={handleAdd}
          >
            {added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
          </button>
        </div>
      </div>
    </div>
  )
}
