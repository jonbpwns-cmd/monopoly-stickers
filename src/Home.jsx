import './Home.css'

export default function Home({ user, setPage }) {
  return (
    <div className="homePage">
      <div className="homeHero">
        <h1 className="homeTitle">Welcome back, {user.username}! 👋</h1>
        <p className="homeSub">Track your Monopoly Ever After sticker collection</p>
      </div>

      <div className="homeGrid">
        <div className="homeCard">
          <div className="homeCardIcon">📚</div>
          <h2 className="homeCardTitle">My Collection</h2>
          <p className="homeCardDesc">Update your sticker counts across all 24 packs</p>
          <button className="homeCardBtn" onClick={() => setPage('collection')}>
            Open Collection →
          </button>
        </div>

        <div className="homeCard">
          <div className="homeCardIcon">🔄</div>
          <h2 className="homeCardTitle">Trade</h2>
          <p className="homeCardDesc">See which stickers other players need that you have spares of</p>
          <button className="homeCardBtn" onClick={() => setPage('trade')}>
            View Trades →
          </button>
        </div>
      </div>
    </div>
  )
}