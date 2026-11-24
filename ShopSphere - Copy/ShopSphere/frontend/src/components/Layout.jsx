import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Heart, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate("/"); };
  return <>
    <header className="topbar">
      <Link to="/" className="brand"><span className="brand-mark"><ShoppingBag size={20}/></span>ShopSphere</Link>
      <nav>
        <NavLink to="/">Shop</NavLink>
        {user && <NavLink to="/orders">My orders</NavLink>}
        {user && <NavLink to="/wishlist"><Heart size={16}/> Wishlist</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="nav-actions">
        {user ? <>
          <span className="welcome"><User size={15}/> {user.name}</span>
          <button className="icon-button" onClick={signOut} title="Log out"><LogOut size={18}/></button>
        </> : <Link className="button button-small" to="/login">Sign in</Link>}
        {user && <Link className="icon-button" to="/cart" title="Cart"><ShoppingCart size={19}/></Link>}
      </div>
    </header>
    <main className="page-shell"><Outlet/></main>
    <footer>© {new Date().getFullYear()} ShopSphere · A smarter way to shop.</footer>
  </>;
}
