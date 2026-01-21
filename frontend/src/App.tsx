import { useState, useEffect } from 'react'
import './App.css'
import menuService, { type MenuItem, type MenuCategory } from './services/menuService'

function App() {
  // State to hold our data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
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
      // Fetch both items and categories at the same time
      const [items, cats] = await Promise.all([
        menuService.getItems(),
        menuService.getCategories()
      ])
      setMenuItems(items)
      setCategories(cats)
    } catch (err: any) {
      setError(err.message || 'Failed to load menu')
      console.error('Error loading menu:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter menu items based on selected category
  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.categoryId === selectedCategory)
    : menuItems

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

      {/* Category filter buttons */}
      <div className="category-filters">
        <button
          className={selectedCategory === null ? 'active' : ''}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={selectedCategory === category.id ? 'active' : ''}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu items grid */}
      <div className="menu-grid">
        {filteredItems.map((item) => (
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
