import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [books, setBooks] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart`)
            .then(response => {
                setCartItems(response.data);

                const bookIds = response.data.map(item => item.bookId);
                return axios.get(`${process.env.REACT_APP_CATALOG_SERVICE_URL}/api/books`);
            })
            .then(response => {
                const bookMap = {};
                response.data.forEach(book => {
                    bookMap[book.id] = {
                        title : book.title,
                        imageUrl : book.imageUrl
                    };
                });
                setBooks(bookMap);
            })
            .catch(error => {
                console.error("get cart data failed:", error);
                toast.error("Failed to load cart data");
            });
    }, []);

    const removeFromCart = (id) => {
        axios.delete(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/${id}`)
            .then(() => setCartItems(cartItems.filter(item => item.id !== id)))
            .catch(error => alert("delete failed: " + error.response.data));
    };

    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = () => {
        if (isProcessing) return;
        setIsProcessing(true);

        axios.post(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/checkout`)
            .then(response => {
                if (response.status === 200) {
                    toast.success("✅" + response.data);
                    setCartItems([]); // ✅ 清空购物车
                    setTimeout(() => navigate("/"),1000);
                } else {
                    toast.error("❌ Checkout failed: Unexpected response");
                }
            })
            .catch(error => {
                toast.error("❌ Checkout failed: " + (error.response?.data || "Unknown error"));
            })
            .finally(() => setIsProcessing(false));
    };

    return (
        <div className="container mt-4">
            <h2>🛒 Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>🛍️ Cart is empty</p>
            ) : (
                <div>
                    <ul className="list-group">
                        {cartItems.map((item) => (
                            <li key={item.id} className="list-group-item d-flex align-items-center">
                                <img
                                    src={books[item.bookId]?.imageUrl || "https://via.placeholder.com/50"}
                                    alt={books[item.bookId]?.title || "Loading..."}
                                    className="me-3"
                                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                                />
                                <div className="flex-grow-1 text-start">
                                    <span>{books[item.bookId]?.title || "Loading..."}</span>
                                    <p className="mb-0">📦 Quantity: {item.quantity}</p>
                                </div>
                                <button className="btn btn-danger btn-sm ms-auto" onClick={() => removeFromCart(item.id)}>❌ Remove</button>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 text-end">
                        <button className="btn btn-success btn-lg" onClick={handleCheckout}>💳 Checkout</button>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default Cart;
