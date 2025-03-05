import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BookList() {
    const [books, setBooks] = useState([]);
    const [stockMap, setStockMap] = useState({});

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_CATALOG_SERVICE_URL}/api/books`)
            .then(response => {
                setBooks(response.data);

                const stockData = {};
                response.data.forEach(book => {
                    stockData[book.id] = book.stock;
                });
                setStockMap(stockData);
            })
            .catch(error => {
                console.error("get book data error:", error);
            });
    }, []);

    const [addedToCart, setAddedToCart] = useState({}); // 记录已添加的书籍 ID

    const addToCart = (bookId) => {
        if (stockMap[bookId] === 0) {
            toast.error("❌ Add failed: Stock doesn't enough", { position: "top-right", autoClose: 3000 });
            return;
        }

        axios.post(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/add`, { bookId, quantity: 1 })
            .then(() => {
                setAddedToCart(prev => ({ ...prev, [bookId]: true })); // 记录已添加状态
                toast.success("✅ Book added to cart!", { position: "top-right", autoClose: 2000 });
            })
            .catch(error => toast.error("❌ Add failed: " + error.response?.data || "Unknown error", { position: "top-right", autoClose: 3000 }));
    };

    return (
        <div className="container mt-4">
            <div className="row">
                {books.map((book) => (
                    <div key={book.id} className="col-md-4 mb-4">
                        <div className="card shadow-sm h-100">
                            <img src={book.imageUrl} className="card-img-top" alt={book.title} style={{ height: "250px", width: "100%", objectFit: "contain" }} />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{book.title}</h5>
                                <p className="card-text text-muted">👨‍💻 {book.author}</p>
                                <p className="card-text fw-bold text-primary">💰 ${book.price.toFixed(2)}</p>
                                <p className={`card-text ${book.stock > 0 ? "text-success" : "text-danger"}`}>
                                    {book.stock > 0 ? `📦 In Stock: ${book.stock}` : "❌ Out of Stock"}
                                </p>
                                <button
                                    className="btn btn-primary mt-auto"
                                    onClick={() => addToCart(book.id, book.stock)}
                                >
                                    {addedToCart[book.id] ? "✔️ Added More" : "🛒 Add to Cart"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
}

export default BookList;
