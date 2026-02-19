import { useState, useEffect } from 'react'
import menuService, { type MenuCategory } from '../services/menuService'
import { useCart } from '../context/CartContext'
import './Menu.css'

function Menu() {
  const { addItem } = useCart()
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

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

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <p>Loading menu...</p>
        </div>
      </div>
    )
  }

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

  return (
    <div className="container">
      <h1>Our Menu</h1>

      {categories.map((category) => (
        <div key={category.id} className="category-section">
          <h2 className="category-header">{category.name}</h2>
          <div className="menu-grid">
            {category.items?.map((item) => (
              <div key={item.id} className="menu-item">
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <p className="price">${parseFloat(item.price).toFixed(2)}</p>
                {item.isAvailable ? (
                  <button className="add-to-cart" onClick={() => addItem(item)}>
                    Add to Cart
                  </button>
                ) : (
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

export default Menu
