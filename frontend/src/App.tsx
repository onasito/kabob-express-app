import { useState, useEffect } from 'react'
import './App.css'
import menuService, { type MenuItem } from './services/menuService'

function App() {
  // State to hold our menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useEffect runs when the component first loads
  useEffect(() => {
    loadMenuItems()
  }, []) // Empty array means "run once when component mounts"

  // Function to fetch menu items from the backend
  const loadMenuItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await menuService.getItems()
      setMenuItems(items)
    } catch (err: any) {
      setError(err.message || 'Failed to load menu items')
      console.error('Error loading menu:', err)
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <p>Loading menu...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={loadMenuItems}>Retry</button>
        </div>
      </div>
    )
  }

  // Show the menu
  return (
    <div className="container">
      <h1>Kabob Express Menu</h1>
      <p className="welcome-text">Fresh, authentic kabobs made with love!</p>
      <div className="menu-grid">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <h3>{item.name}</h3>
            <p className="description">{item.description}</p>
            <p className="price">${item.price}</p>
            {!item.isAvailable && (
              <p className="unavailable">Currently Unavailable</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
