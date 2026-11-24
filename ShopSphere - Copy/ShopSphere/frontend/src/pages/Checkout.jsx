import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [shippingAddress, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => { api.get("/cart").then(r => setCart(r.data.cart)).catch(e => setError(getErrorMessage(e))); }, []);
  const total = cart?.items.reduce((s, i) => s + i.product.price * i.quantity, 0) || 0;
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError("");
    try { const r = await api.post("/orders", { shippingAddress, phone }); navigate("/orders", { state: { message: `Order ${r.data.order._id} placed successfully.` } }); }
    catch(e) { setError(getErrorMessage(e)); }
    finally { setBusy(false); }
  };
  if (!cart) return <p>{error || "Loading..."}</p>;
  if (!cart.items.length) return <div className="empty-state"><h3>Your cart is empty</h3></div>;
  return <section className="checkout-layout"><form className="panel" onSubmit={submit}><span className="eyebrow">ALMOST YOURS</span><h1>Checkout</h1><label>Shipping address<textarea required value={shippingAddress} onChange={e => setAddress(e.target.value)} minLength="10" placeholder="House, street, city, state, PIN code"/></label><label>Phone number<input required value={phone} onChange={e => setPhone(e.target.value)} pattern="[0-9+ -]{10,16}" placeholder="10-digit phone number"/></label><p className="muted">Payment method: Cash on delivery</p>{error && <p className="error-text">{error}</p>}<button className="button button-wide" disabled={busy}>{busy ? "Placing order..." : "Place order · ₹" + total.toLocaleString("en-IN")}</button></form><aside className="panel"><h3>Order summary</h3>{cart.items.map(i => <p className="summary-line" key={i.product._id}>{i.product.name} × {i.quantity}<b>₹{(i.product.price*i.quantity).toLocaleString("en-IN")}</b></p>)}<hr/><h2>₹{total.toLocaleString("en-IN")}</h2></aside></section>;
}
