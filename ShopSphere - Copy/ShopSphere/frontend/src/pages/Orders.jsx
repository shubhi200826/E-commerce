import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();
  useEffect(() => { api.get("/orders/my").then(r => setOrders(r.data.orders)).catch(e => setError(getErrorMessage(e))); }, []);
  return <section className="content-section"><span className="eyebrow">YOUR PURCHASES</span><h1>Order history</h1>{location.state?.message && <p className="notice">{location.state.message}</p>}{error && <p className="error-text">{error}</p>}
    {!orders.length ? <div className="empty-state"><h3>No orders yet</h3></div> : <div className="order-list">{orders.map(o => <article className="panel" key={o._id}><div className="order-head"><b>Order #{o._id.slice(-8).toUpperCase()}</b><span className={`status status-${o.status}`}>{o.status}</span></div><p className="muted">{new Date(o.createdAt).toLocaleString()}</p>{o.items.map((i, n) => <p key={n}>{i.name} × {i.quantity} — ₹{(i.price*i.quantity).toLocaleString("en-IN")}</p>)}<h3>Total: ₹{o.total.toLocaleString("en-IN")}</h3><small>Payment: Cash on delivery</small></article>)}</div>}
  </section>;
}
