import './Sticker.css'

export default function Sticker({ name, count, onIncrease, onDecrease }) {
  return (
    <div className="card">
      <span className="name">{name}</span>
      <div className="controls">
        <button className="btn" onClick={onDecrease} disabled={count === 0}>−</button>
        <span className="count">{count}</span>
        <button className="btn" onClick={onIncrease}>+</button>
      </div>
    </div>
  )
}