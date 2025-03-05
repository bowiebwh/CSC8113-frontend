import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import BookList from "./components/BookList";
import Cart from "./components/Cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <Router>
            <div className="container mt-4">
                <ToastContainer position="top-right" autoClose={3000} />
                <nav className="navbar navbar-light bg-light px-3">
                    <Link className="navbar-brand fs-4 text-primary" to="/">📚 BookStore</Link>
                    <Link className="btn btn-outline-primary" to="/cart">🛒 Cart</Link>
                </nav>
                <Routes> {/* ✅ 用 Routes 替换 Switch */}
                    <Route path="/" element={<BookList />} /> {/* ✅ 用 element 替换 component */}
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
