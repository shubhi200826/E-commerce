import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  useEffect(() => { api.get(`/products/${id}`).then(r => setData(r.data)).catch(e => setMessage(getErrorMessage(e))); }, [id]);
  const add = async () => {
    if (!user) return setMessage("Please sign in first.");
    try { await api.post("/cart/items", { productId: id, quantity: 1 }); setMessage("Added to cart."); }
    catch (e) { setMessage(getErrorMessage(e)); }
  };
  const review = async e => {
    e.preventDefault();
    try {
      await api.post(`/reviews/${id}`, { rating: Number(rating), comment });
      const refreshed = await api.get(`/products/${id}`);
      setData(refreshed.data); setMessage("Review saved.");
    } catch (e) { setMessage(getErrorMessage(e)); }
  };
  if (!data) return <div className="loading-state">{message || "Loading product..."}</div>;
  const { product, reviews } = data;
  return <section className="detail-layout">
    <div className="detail-image"><img src={product.image} alt={product.name}/></div>
    <div className="detail-copy"><span className="eyebrow">{product.category?.name}</span><h1>{product.name}</h1><h2>₹{product.price.toLocaleString("en-IN")}</h2><p>{product.description}</p><p className="muted">{product.stock} available</p>
      <button className="button" disabled={!product.stock} onClick={add}>Add to cart</button> {message && <p className="notice">{message}</p>}
      <div className="reviews"><h3>Customer reviews</h3>{reviews.map(r => <div className="review" key={r._id}><b>{r.user?.name || "Customer"} · {"★".repeat(r.rating)}</b><p>{r.comment}</p></div>)}
      {user ? <form onSubmit={review} className="review-form"><label>Rating<select value={rating} onChange={e => setRating(e.target.value)}>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}</select></label><label>Your review<textarea value={comment} onChange={e => setComment(e.target.value)} maxLength="1000"/></label><button className="button">Submit review</button></form> : <p><Link to="/login">Sign in</Link> to leave a review.</p>}</div>
    </div>
  </section>;
}
