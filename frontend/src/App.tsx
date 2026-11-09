import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import MenuPage from "./pages/MenuPage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  );
}

export default App;
