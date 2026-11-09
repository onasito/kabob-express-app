import { useState, useEffect } from "react";
import { type MenuCategory } from "../types";
import menuService from "../services/menu";
import Header from "../components/Header";
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

  return <div>Coming Soon</div>;
}

export default MenuPage;
