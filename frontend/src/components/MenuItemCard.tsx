import type { MenuItem } from "../types";
import { PlusIcon } from "@radix-ui/react-icons";
import "./MenuItemCard.css";

type MenuItemCardProps = {
  item: MenuItem;
};

function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <article className="card">
      <div className="image-wrapper">
        <img className="item-image" src={item.image ?? "/kabob-logo.png"} alt={item.name} />
        <data className="price" value={item.price}>
          ${item.price}
        </data>
      </div>
      <div className="card-content">
        <h3 className="item-name">{item.name}</h3>
        <p>{item.description}</p>
        <div className="card-footer">
          <button type="button" className="add-to-cart" aria-label={`Add ${item.name} to cart`}>
            <PlusIcon width={20} height={20} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default MenuItemCard;
