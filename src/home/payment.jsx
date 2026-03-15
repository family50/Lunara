import React, { useEffect, useRef, useState } from "react";
import "./payment.css";
import { gsap } from "gsap";

export default function Payment() {
    const [totalAmount, setTotalAmount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [errors, setErrors] = useState({});
    
    const videoRefOriginal = useRef(null);
    const videoRefReversed = useRef(null);
    const receiptRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart"));
        if (savedCart && savedCart.totalAmount > 0) {
            setTotalAmount(savedCart.totalAmount);
            setCartItems(savedCart.items || []); // نفترض أن السلة تحتوي على مصفوفة items
        }
    }, []);

    const handleAuthorize = () => {
        const inputs = formRef.current.querySelectorAll('.gold-input:not([placeholder*="Optional"])');
        let newErrors = {};
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                newErrors[input.placeholder] = true;
                isValid = false;
            }
        });

        setErrors(newErrors);

        if (isValid) {
            setIsReceiptOpen(true);
            // أنميشن ظهور الإيصال
            gsap.fromTo(receiptRef.current, 
                { y: -100, opacity: 0, scale: 0.9 }, 
                { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power4.out", display: "flex" }
            );
            // مسح السلة من اللوكل استورج
            localStorage.removeItem("cart");
        }
    };

    

    const closeReceipt = () => {
        gsap.to(receiptRef.current, {
            y: -100, opacity: 0, scale: 0.9, duration: 0.5, ease: "power4.in",
            onComplete: () => {
                setIsReceiptOpen(false);
               window.location.reload();
            }
        });
    };











useEffect(() => {
        const videoOriginal = videoRefOriginal.current;
        const videoReversed = videoRefReversed.current;
        if (!videoOriginal || !videoReversed) return;

        videoOriginal.style.opacity = 1;
        videoReversed.style.opacity = 0;

        const safePlayOriginal = () => { videoOriginal.play().catch(() => {}); };
        const safePlayReversed = () => { videoReversed.play().catch(() => {}); };

        safePlayOriginal();

        const handleEndedOriginal = () => {
            videoReversed.currentTime = 0;
            videoOriginal.style.opacity = 0;
            videoReversed.style.opacity = 1;
            safePlayReversed();
        };
        const handleEndedReversed = () => {
            videoOriginal.currentTime = 0;
            videoReversed.style.opacity = 0;
            videoOriginal.style.opacity = 1;
            safePlayOriginal();
        };

        videoOriginal.addEventListener("ended", handleEndedOriginal);
        videoReversed.addEventListener("ended", handleEndedReversed);

        return () => {
            videoOriginal.removeEventListener("ended", handleEndedOriginal);
            videoReversed.removeEventListener("ended", handleEndedReversed);
        };
    }, []);












    return (
        <div className="payment-wrapper">
            <video ref={videoRefOriginal} className="background-video" src="/assets/background/istockphoto-1304201131-640_adpp_is.mp4" autoPlay muted playsInline loop></video>
            <video ref={videoRefReversed} className="background-video" src="/assets/background/istockphoto-1304201131-640_adpp_is.mp4" autoPlay muted playsInline loop></video>

            <div className="payment-main-container" ref={formRef}>
                {totalAmount > 0 ? (
                    <div className="luxury-glass-vault">
                        {/* رأس الصفحة وفورم الدفع */}
                        <div className="vault-header">
                            <h1 className="gold-gradient-text">Treasury Checkout</h1>
                        </div>

                        <div className="flex-engine">
                            <div className="info-wing">
                                <div className="input-cluster">
                                    <input type="text" className={`gold-input ${errors["Recipient Full Name"] ? "input-error" : ""}`} placeholder="Recipient Full Name" />
                                    <div className="flex-row">
                                        <input type="text" className={`gold-input ${errors["Country"] ? "input-error" : ""}`} placeholder="Country" />
                                        <input type="text" className={`gold-input ${errors["City"] ? "input-error" : ""}`} placeholder="City" />
                                    </div>
                                    <input type="text" className={`gold-input ${errors["Detailed Street Address"] ? "input-error" : ""}`} placeholder="Detailed Street Address" />
                                    <div className="flex-row">
                                        <input type="tel" className={`gold-input ${errors["Primary Line"] ? "input-error" : ""}`} placeholder="Primary Line" />
                                        <input type="tel" className="gold-input" placeholder="Secondary (Optional)" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="geometric-divider"></div>

                            <div className="payment-wing">
                                <div className="card-display-area">
                                     <img src="/assets/background/created.png" alt="Card" className="master-card-img" />
                                </div>
                                <div className="input-cluster">
                                    <input type="text" className={`gold-input ${errors["0000 0000 0000 0000"] ? "input-error" : ""}`} placeholder="0000 0000 0000 0000" />
                                    <div className="flex-row">
                                        <input type="text" className={`gold-input ${errors["MM / YY"] ? "input-error" : ""}`} placeholder="MM / YY" />
                                        <input type="password" className={`gold-input ${errors["CVV"] ? "input-error" : ""}`} placeholder="CVV" />
                                    </div>
                                </div>
                                <div className="grand-summary">
                                    <div className="summary-line">
                                        <span>Total Investment</span>
                                        <span className="gold-price-tag">${totalAmount}</span>
                                    </div>
                                    <button className="luxury-submit-btn" onClick={handleAuthorize}>
                                        Authorize Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : !isReceiptOpen && (
                 <div className="empty-vault-state"> {/* حاوية عرض رسالة "الخزنة فارغة" */}
                        <div className="empty-content"> {/* المحتوى الداخلي للحالة الفارغة */}
                            <h2 className="ethereal-text">The Treasury is Empty</h2> {/* عنوان الرسالة بتنسيق نصي خيالي */}
                            <p className="gold-sub-text">Your collection awaits its first masterpiece.</p> {/* نص تشجيعي للمستخدم للبدء في التسوق */}
                            
                            <div className="empty-card-visual"> {/* حاوية الرؤية الجمالية للحالة الفارغة */}
                                <img src="/assets/background/created.png" alt="Empty Vault" className="floating-empty-card" /> {/* عرض صورة البطاقة بتأثير عائم للدلالة على الفراغ */}
                                <div className="card-shadow-pulse"></div> {/* تأثير الظل النابض تحت البطاقة العائمة */}
                            </div> {/* نهاية منطقة الرؤية */}
                        </div> {/* نهاية منطقة المحتوى */}
                    </div>
                )}
            </div>

            {/* صفحة الإيصال الذهبي */}
            <div className="receipt-overlay" ref={receiptRef} style={{display: 'none'}}>
                <div className="luxury-receipt">
                    <button className="close-receipt-btn" onClick={closeReceipt}>✕</button>
                    
                    <div className="receipt-header">
                        <div className="success-icon">✓</div>
                        <h2 className="gold-gradient-text">Payment Authorized</h2>
                        <p>Transaction Successful • Treasury Secured</p>
                    </div>

                    <div className="receipt-body">
                        <div className="receipt-divider"></div>
                        <div className="receipt-items">
                            {cartItems.map((item, index) => (
                                <div key={index} className="receipt-item-row">
                                    <span>{item.name} (x{item.quantity})</span>
                                    <span>${item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="receipt-divider"></div>
                        <div className="receipt-total">
                            <span>Final Acquisition Value</span>
                            <span className="total-gold-text">${totalAmount}</span>
                        </div>
                    </div>

                    <div className="receipt-footer">
                        <p>A confirmation certificate has been sent to your encrypted mail.</p>
                        <small>Family Group Group Privilege ID: #{(Math.random() * 1000000).toFixed(0)}</small>
                    </div>
                </div>
            </div>
        </div>
    );
}