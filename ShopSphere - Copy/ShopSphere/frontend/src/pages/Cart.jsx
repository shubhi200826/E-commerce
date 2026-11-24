import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const load = () => api.get("/cart").then(r => setCart(r.data.cart)).catch(e => setError(getErrorMessage(e)));
  useEffect(() => { load(); }, []);
  const update = async (id, quantity) => { try { const r = await api.patch(`/cart/items/${id}`, { quantity: Number(quantity) }); setCart(r.data.cart); } catch(e) { setError(getErrorMessage(e)); } };
  const remove = async id => { try { const r = await api.delete(`/cart/items/${id}`); setCart(r.data.cart); } catch(e) { setError(getErrorMessage(e)); } };
  if (!cart) return <p>{error || "Loading cart..."}</p>;
  const total = cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  return <section className="content-section"><span className="eyebrow">YOUR BAG</span><h1>Shopping cart</h1>{error && <p className="error-text">{error}</p>}
    {!cart.items.length ? <div className="empty-state"><h3>Your cart is empty</h3><Link className="button" to="/">Browse products</Link></div> : <>
      <div className="cart-list">{cart.items.map(item => <div className="cart-row" key={item.product._id}><img src={item.product.image} alt=""/><div className="cart-item-info"><b>{item.product.name}</b><span>₹{item.product.price.toLocaleString("en-IN")}</span></div><input aria-label="Quantity" type="number" min="1" max={item.product.stock} value={item.quantity} onChange={e => update(item.product._id, e.target.value)}/><button className="text-button" onClick={() => remove(item.product._id)}>Remove</button></div>)}</div>
      <div className="cart-summary"><span>Subtotal</span><strong>₹{total.toLocaleString("en-IN")}</strong><Link className="button" to="/checkout">Continue to checkout</Link></div>
    </>}
  </section>;
}
