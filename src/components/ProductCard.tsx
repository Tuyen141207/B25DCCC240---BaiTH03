import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { addToCart } from '../features/cart/cartSlice'
import type { Product } from '../types'

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const [added, setAdded] = useState(false)

  // Hiện chữ "Đã thêm" trong 1.5 giây để người dùng biết thao tác đã thành công
  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 1500)
    return () => clearTimeout(timer)
  }, [added])

  const handleAdd = () => {
    dispatch(addToCart(product))
    setAdded(true)
  }

  return (
    <div className="card">
      <Link to={`/products/${product.id}`} className="card-img">
        <img src={product.image} alt={product.title} loading="lazy" />
      </Link>
      <span className="tag">{product.category}</span>
      <Link to={`/products/${product.id}`} className="card-title">
        {product.title}
      </Link>
      <div className="card-footer">
        <p className="price">${product.price.toFixed(2)}</p>
        <button
          className={added ? 'btn btn-success btn-sm' : 'btn btn-sm'}
          onClick={handleAdd}
        >
          {added ? 'Đã thêm' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  )
}
