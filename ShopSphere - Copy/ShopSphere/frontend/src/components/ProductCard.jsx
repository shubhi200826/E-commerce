import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, onAdd }) {
  return <article className="product-card">
    <Link to={`/products/${product._id}`} className="product-image-wrap">
      <img src={product.image} alt={product.name} onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600?text=ShopSphere"; }}/>
    </Link>
    <div className="product-info">
      <span className="eyebrow">{product.category?.name || "Featured"}</span>
      <Link to={`/products/${product._id}`} className="product-name">{product.name}</Link>
      <div className="product-bottom"><strong>₹{product.price.toLocaleString("en-IN")}</strong>
        <button className="round-action" onClick={() => onAdd(product._id)} title="Add to cart"><ShoppingCart size={17}/></button>
      </div>
      <small>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</small>
    </div>
  </article>;
}
