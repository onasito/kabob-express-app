import { useState, useEffect } from 'react'
import './App.css'
import menuService, { type MenuCategory } from './services/menuService'

function App() {
  // State to hold our data
  const [categories, setCategories] = useState<MenuCategory[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useEffect runs when the component first loads
  useEffect(() => {
    loadData()
  }, []) // Empty array means "run once when component mounts"

  // Function to fetch menu items and categories from the backend
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const cats = await menuService.getCategories()
      setCategories(cats)
    } catch (err: any) {
      setError(err.message || 'Failed to load menu')
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
          <button onClick={loadData}>Retry</button>
        </div>
      </div>
    )
  }

  // Show the menu
  return (
    <div className="container">
      <h1>Kabob Express Menu</h1>
      <p className="welcome-text">Fresh, authentic kabobs made with love!</p>

      {categories.map((category) => (
        <div key={category.id} className="category-section">
          <h2 className="category-header">{category.name}</h2>
          <div className="menu-grid">
            {category.items?.map((item) => (
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
      ))}
    </div>
  )
}

export default App
