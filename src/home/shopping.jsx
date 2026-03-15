import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import "./shopping.css";

export default function Shopping() {
    const [cart, setCart] = useState({ items: [], totalAmount: 0, totalQuantity: 0 });
    const navigate = useNavigate();

    // تحميل البيانات من localStorage عند الفتح
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || { items: [], totalAmount: 0, totalQuantity: 0 };
        setCart(savedCart);
    }, []);

    // دالة لتحديث الـ LocalStorage والـ State معاً لضمان المزامنة
    const updateCart = (newItems) => {
        const totalQuantity = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = newItems.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);
        
        const updatedCart = { items: newItems, totalAmount, totalQuantity };
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // زيادة الكمية
    const increaseQty = (index) => {
        const newItems = [...cart.items];
        const item = newItems[index];
        const singlePrice = parseFloat(item.price);
        
        item.quantity += 1;
        item.totalPrice = (item.quantity * singlePrice).toFixed(2);
        
        updateCart(newItems);
    };

    // نقصان الكمية
    const decreaseQty = (index) => {
        const newItems = [...cart.items];
        const item = newItems[index];
        if (item.quantity > 1) {
            const singlePrice = parseFloat(item.price);
            item.quantity -= 1;
            item.totalPrice = (item.quantity * singlePrice).toFixed(2);
            updateCart(newItems);
        }
    };

    // حذف المنتج مع أنيميشن GSAP
    const removeItem = (index, itemId) => {
        const cardElement = document.getElementById(`card-${itemId}-${index}`);
        
        gsap.to(cardElement, {
            x: -50,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                const newItems = cart.items.filter((_, i) => i !== index);
                updateCart(newItems);
            }
        });
    };

// ... (نفس الـ imports والـ functions السابقة)

if (cart.items.length === 0) {
    return (
        <div className="shopping-page">
            <div className="cart-header">
                <h1 className="gold-gradient-text">Shopping Sanctuary</h1>
                {/* الجملة التسويقية */}
                <p className="marketing-luxury-text">
                    Your sanctuary vault is currently awaiting its treasures. <br />
                    Begin your journey through our exclusive collection to curate your masterpiece.
                </p>
            </div>

            <div className="empty-cart-visual">
                {/* استدعاء الصورة التي صممناها */}
                <img 
                    src="/assets/background/card.png"
                    alt="Luxury Gold Cart" 
                    className="empty-cart-img"
                />
            </div>
        </div>
    );
}

// ... (باقي كود الـ return الأساسي)

    return (
        <div className="shopping-page">
            <div className="cart-header">
                <h1 className="gold-gradient-text">Shopping Sanctuary</h1>
                <p className="items-count">{cart.totalQuantity} Exquisite Pieces</p>
            </div>

            <div className="luxury-grid">
                <div className="items-column">
                    {cart.items.map((item, index) => (
                        <div className="luxury-card" key={`${item.id}-${index}`} id={`card-${item.id}-${index}`}>
                            {/* زر الحذف الصغير في الأعلى */}
                            <button className="remove-item-btn" onClick={() => removeItem(index, item.id)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                            <div className="card-img-wrapper">
                                <img src={item.image} alt={item.name} />
                            </div>
                            
                            <div className="card-info">
                                <h3>{item.name}</h3>
                                <p className="item-section">{item.section}</p>
                                
                                <div className="qty-price-row">
                                    {/* عداد الكمية الجديد */}
                                    <div className="cart-qty-selector">
                                        <button onClick={() => decreaseQty(index)}><i className="fa-solid fa-minus"></i></button>
                                        <span className="qty-val">{item.quantity}</span>
                                        <button onClick={() => increaseQty(index)}><i className="fa-solid fa-plus"></i></button>
                                    </div>
                                    <span className="gold-price">${item.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="summary-column">
                    <div className="summary-sticky-card">
                        <h2 className="summary-title">Order Treasury</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${cart.totalAmount}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="complimentary">Complimentary</span>
                        </div>
                        <div className="divider-gold"></div>
                        <div className="summary-row grand-total">
                            <span>Grand Total</span>
                            <span className="total-amount">${cart.totalAmount}</span>
                        </div>
                        <button className="checkout-btn"onClick={() => navigate("/payment")}>
                            Go payment page
                            <i className="fa-solid fa-arrow-right-long"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}