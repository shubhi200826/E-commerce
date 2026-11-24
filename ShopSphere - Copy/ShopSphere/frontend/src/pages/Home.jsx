import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import api, { getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const load = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      params.set("sort", sort);
      const [p, c] = await Promise.all([api.get(`/products?${params}`), api.get("/categories")]);
      setProducts(p.data.products);
      setCategories(c.data.categories);
      setMessage("");
    } catch (e) { setMessage(getErrorMessage(e)); }
  };
  useEffect(() => { load(); }, [category, sort]);
  const add = async (productId) => {
    if (!user) { setMessage("Please sign in before adding items to your cart."); return; }
    try { await api.post("/cart/items", { productId, quantity: 1 }); setMessage("Added to cart."); }
    catch (e) { setMessage(getErrorMessage(e)); }
  };

  return <>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow light">THE EVERYDAY MARKETPLACE</span>
        <h1>Find your next<br/><em>favourite thing.</em></h1>
        <p>Thoughtful picks, everyday essentials and little upgrades — all in one place.</p>
        <a href="#catalog" className="button button-light">Explore collection <ArrowRight size={17}/></a>
      </div>
      <div className="hero-orbit"><div className="orbit-card"><span>SS</span><b>Good finds.<br/>Better days.</b><small>SHOPSPHERE EDIT</small></div></div>
    </section>
    <section id="catalog" className="catalog-section">
      <div className="section-heading"><div><span className="eyebrow">CURATED FOR YOU</span><h2>Explore the store</h2></div><span className="muted">{products.length} products</span></div>
      <form className="filters" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <div className="search-box"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."/></div>
        <select value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
        <select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="name">Name</option></select>
        <button className="button" type="submit">Search</button>
      </form>
      {message && <p className="notice">{message}</p>}
      {products.length ? <div className="product-grid">{products.map(p => <ProductCard key={p._id} product={p} onAdd={add}/>)}</div> : <div className="empty-state"><h3>No products found yet</h3><p>Add products through the admin account to populate your store.</p></div>}
    </section>
  </>;
}
