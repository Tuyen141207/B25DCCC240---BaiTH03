import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '../features/products/productsSlice'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectProducts)
  const status = useAppSelector(selectProductsStatus)
  const error = useAppSelector(selectProductsError)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [status, dispatch])

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(keyword.trim().toLowerCase()),
  )

  return (
    <div>
      <section className="hero">
        <h1>Chào mừng đến với ShopMini</h1>
        <p>Chọn sản phẩm yêu thích, thêm vào giỏ và thanh toán chỉ trong vài bước.</p>
        <input
          className="input search"
          type="text"
          placeholder="Nhập tên sản phẩm cần tìm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </section>

      {status === 'loading' && <p className="notice">Đang tải sản phẩm, vui lòng chờ...</p>}

      {status === 'failed' && (
        <div className="notice notice-error">
          <p>Không tải được sản phẩm: {error}</p>
          <button className="btn" onClick={() => dispatch(fetchProducts())}>
            Thử lại
          </button>
        </div>
      )}

      {status === 'succeeded' && (
        <p className="result-count">
          {filtered.length === 0
            ? 'Không tìm thấy sản phẩm phù hợp. Hãy thử từ khoá khác.'
            : `Hiển thị ${filtered.length} sản phẩm`}
        </p>
      )}

      <div className="grid">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
