import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LocationState {
  from?: string
}

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from ?? '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to={from} replace />

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (login(username, password)) {
      navigate(from, { replace: true })
    } else {
      setError('Sai tên đăng nhập hoặc mật khẩu. Vui lòng kiểm tra lại.')
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>Đăng nhập</h1>
      <p className="muted">
        Nhập tên bất kỳ và mật khẩu <strong>123456</strong> để đăng nhập thử.
      </p>

      <label className="field">
        <span>Tên đăng nhập</span>
        <input
          className="input"
          type="text"
          placeholder="Ví dụ: sinhvien01"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>

      <label className="field">
        <span>Mật khẩu</span>
        <input
          className="input"
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {error && <p className="error-box">{error}</p>}

      <button className="btn btn-block" type="submit">
        Đăng nhập
      </button>
    </form>
  )
}
