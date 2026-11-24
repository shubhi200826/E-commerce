import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const load = () => api.get("/wishlist").then(r => setProducts(r.data.wishlist.products)).catch(e => setError(getErrorMessage(e)));
  useEffect(() => { load(); }, []);
  const remove = async id => { try { const r = await api.post(`/wishlist/${id}/toggle`); setProducts(r.data.wishlist.products); } catch(e) { setError(getErrorMessage(e)); } };
  return <section className="content-section"><span className="eyebrow">SAVED FOR LATER</span><h1>Your wishlist</h1>{error && <p className="error-text">{error}</p>}{products.map(p => <div className="cart-row" key={p._id}><img src={p.image} alt=""/><div className="cart-item-info"><Link to={`/products/${p._id}`}><b>{p.name}</b></Link><span>₹{p.price.toLocaleString("en-IN")}</span></div><button className="text-button" onClick={() => remove(p._id)}>Remove</button></div>)}{!products.length && <div className="empty-state"><h3>No saved products</h3></div>}</section>;
}
