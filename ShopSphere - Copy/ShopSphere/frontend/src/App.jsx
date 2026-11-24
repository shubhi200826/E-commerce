import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Admin from "./pages/Admin";

export default function App() {
  return <BrowserRouter><AuthProvider><Routes><Route element={<Layout/>}>
    <Route index element={<Home/>}/>
    <Route path="login" element={<Auth/>}/>
    <Route path="register" element={<Auth mode="register"/>}/>
    <Route path="products/:id" element={<ProductDetails/>}/>
    <Route path="cart" element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
    <Route path="checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
    <Route path="orders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
    <Route path="wishlist" element={<ProtectedRoute><Wishlist/></ProtectedRoute>}/>
    <Route path="admin" element={<ProtectedRoute admin><Admin/></ProtectedRoute>}/>
    <Route path="*" element={<div className="empty-state"><h1>Page not found</h1><a href="/">Return to store</a></div>}/>
  </Route></Routes></AuthProvider></BrowserRouter>;
}
