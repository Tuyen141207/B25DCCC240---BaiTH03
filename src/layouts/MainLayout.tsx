import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

export default function MainLayout() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">ShopMini - Bài thực hành 03</footer>
    </div>
  )
}
