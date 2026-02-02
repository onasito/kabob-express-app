import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to Kabob Express</h1>
        <p>Fresh, authentic kabobs made with love!</p>
        <Link to="/menu" className="cta-button">
          View Our Menu
        </Link>
      </section>
    </div>
  )
}

export default Home
