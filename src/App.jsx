import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Home from './Home'
import Pack from './Pack'
import Trade from './Trade'
import './App.css'

export default function App() {
  const [page, setPage] = useState('home')
  const [packIndex, setPackIndex] = useState(0)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [inputName, setInputName] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('mego_username')
    if (saved) loginUser(saved)
  }, [])

  const loginUser = async (name) => {
    setError('')
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('username', name)
      .single()

    if (existing) {
      setUser(existing)
      localStorage.setItem('mego_username', name)
    } else {
      const { data: created, error: err } = await supabase
        .from('users')
        .insert({ username: name })
        .select()
        .single()
      if (err) { setError('Could not create user. Try a different name.'); return }
      setUser(created)
      localStorage.setItem('mego_username', name)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (inputPassword !== import.meta.env.VITE_APP_PASSWORD) {
      setError('Incorrect password.')
      return
    }
    const allowedUsers = ['jon', 'josh', 'ben', 'david']
    if (!allowedUsers.includes(inputName.trim().toLowerCase())) {
      setError('Username not recognised.')
      return
    }
    loginUser(inputName.trim().toLowerCase())
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('mego_username')
    setPage('home')
  }

  if (!user) {
    return (
      <div className="loginPage">
        <h1 className="loginTitle">🧸 Monopoly Ever After</h1>
        <p className="loginSub">Enter your username and password to continue</p>
        <form onSubmit={handleLogin} className="loginForm">
          <input
            className="loginInput"
            type="text"
            placeholder="Username..."
            value={inputName}
            onChange={e => setInputName(e.target.value)}
          />
          <input
            className="loginInput"
            type="password"
            placeholder="Password..."
            value={inputPassword}
            onChange={e => setInputPassword(e.target.value)}
          />
          <button className="loginBtn" type="submit">Let's Go!</button>
        </form>
        {error && <p className="loginError">{error}</p>}
      </div>
    )
  }

  return (
    <div>
      <nav className="nav">
        <button className={`navBtn ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>🏠 Home</button>
        <button className={`navBtn ${page === 'collection' ? 'active' : ''}`} onClick={() => setPage('collection')}>📚 Collection</button>
        <button className={`navBtn ${page === 'trade' ? 'active' : ''}`} onClick={() => setPage('trade')}>🔄 Trade</button>
        <span className="navUser">👤 {user.username}</span>
        <button className="navBtn" onClick={logout}>Logout</button>
      </nav>

      {page === 'home' && <Home user={user} setPage={setPage} />}
      {page === 'collection' && (
        <Pack packIndex={packIndex} setPackIndex={setPackIndex} user={user} />
      )}
      {page === 'trade' && <Trade user={user} />}
    </div>
  )
}