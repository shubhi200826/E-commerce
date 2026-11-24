import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

const blank = { name: "", description: "", price: "", image: "", category: "", stock: "1" };

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(blank);
  const [categoryName, setCategoryName] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const load = async () => {
    try {
      const [p,c,o] = await Promise.all([api.get("/products?limit=50"), api.get("/categories"), api.get("/orders")]);
      setProducts(p.data.products); setCategories(c.data.categories); setOrders(o.data.orders);
    } catch(e) { setError(getErrorMessage(e)); }
  };
  useEffect(() => { load(); }, []);
  const createProduct = async e => {
    e.preventDefault(); setError(""); setMessage("");
    try { await api.post("/products", { ...form, price: Number(form.price), stock: Number(form.stock) }); setForm(blank); setMessage("Product created."); load(); }
    catch(e) { setError(getErrorMessage(e)); }
  };
  const createCategory = async e => {
    e.preventDefault();
    try { await api.post("/categories", { name: categoryName }); setCategoryName(""); setMessage("Category created."); load(); }
    catch(e) { setError(getErrorMessage(e)); }
  };
  const archive = async id => {
    if (!confirm("Archive this product?")) return;
    try { await api.delete(`/products/${id}`); load(); }
    catch(e) { setError(getErrorMessage(e)); }
  };
  const status = async (id, value) => {
    try { await api.patch(`/orders/${id}/status`, { status: value }); load(); }
    catch(e) { setError(getErrorMessage(e)); }
  };
  return <section className="content-section"><span className="eyebrow">STORE CONTROL</span><h1>Admin dashboard</h1>{error && <p className="error-text">{error}</p>}{message && <p className="notice">{message}</p>}
    <div className="admin-stats"><div className="panel"><b>{products.length}</b><span>Products</span></div><div className="panel"><b>{categories.length}</b><span>Categories</span></div><div className="panel"><b>{orders.length}</b><span>Orders</span></div></div>
    <div className="admin-grid"><form className="panel" onSubmit={createProduct}><h2>Add product</h2><label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Description<textarea required value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><label>Price (₹)<input required type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>Image URL<input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://..."/></label><label>Category<select required value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="">Choose category</option>{categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></label><label>Stock<input required type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></label><button className="button">Create product</button></form>
    <div className="panel"><h2>Categories</h2><form onSubmit={createCategory} className="inline-form"><input value={categoryName} onChange={e=>setCategoryName(e.target.value)} placeholder="New category" required/><button className="button">Add</button></form>{categories.map(c=><p key={c._id}>{c.name}</p>)}</div></div>
    <div className="panel table-panel"><h2>Products</h2>{products.map(p=><div className="admin-row" key={p._id}><span>{p.name}</span><b>₹{p.price}</b><button className="text-button" onClick={()=>archive(p._id)}>Archive</button></div>)}</div>
    <div className="panel table-panel"><h2>Manage orders</h2>{orders.map(o=><div className="admin-row" key={o._id}><span>{o.user?.name} · ₹{o.total}</span><select value={o.status} onChange={e=>status(o._id,e.target.value)}><option value="placed">Placed</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></div>)}</div>
  </section>;
}
