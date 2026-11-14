import type { MenuItem } from "../types";
import "./MenuItemCard.css";

type MenuItemCardProps = {
  item: MenuItem;
};

/* function MenuItemCard({ item }: MenuItemCardProps) */
function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <article className="card">
      <img className="item-image" src="/menuImages/beef-tika.avif" />
      <div className="card-content">
        <h3 className="item-name">{item.name}</h3>
        <p>{item.description}</p>
        <div className="card-footer">
          <data className="price" value={item.price}>
            ${item.price}
          </data>
          <button type="button" className="add-to-cart">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default MenuItemCard;
