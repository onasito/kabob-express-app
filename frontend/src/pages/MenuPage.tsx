import { useState, useEffect } from "react";
import { type MenuCategory } from "../types";
import menuService from "../services/menu";
import MenuItemCard from "../components/MenuItemCard";
import "./MenuPage.css";

function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const cats = await menuService.getCategories();
      setCategories(cats);
    } catch (error: any) {
      setError(error.message || "Failed to load menu");
      console.error("Error loading menu:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <p>Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <main>
      <header className="header-box">
        <div className="title-wrapper">
          <h1>Our Menu</h1>
          <p>REAL FOOD ... REAL FAST</p>
        </div>
        <div className="kabob-pic-wrapper">
          <img className="grilled-kabob-pic" src="/Grilled-Steak-Kebabs.jpg" />
        </div>
      </header>
      {categories.map((category) => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <p>{category.description}</p>
          <div className="category-items">
            {category.items?.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}

export default MenuPage;
