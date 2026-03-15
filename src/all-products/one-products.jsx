import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { discoverMoreProducts } from "../date/Discover-More";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./one-products.css";

// تسجيل ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function OneProduct() {
  const location = useLocation();
  const scrollRef = useRef(null);

  const productId = location.state?.productId;
  const sectionKey = location.state?.sectionKey;
  const section = discoverMoreProducts[sectionKey];
  const product = section?.products.find((p) => p.id === productId);
const [quantity, setQuantity] = React.useState(1);
const totalPrice = (parseFloat(product.price) * quantity).toFixed(2);
const increaseQty = () => setQuantity(prev => prev + 1);
const decreaseQty = () => {
  if (quantity > 1) setQuantity(prev => prev - 1);
};


// 1. Reset scroll to top on product change
useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant" 
  });
}, [productId]); // هيشتغل كل ما الـ ID بتاع المنتج يتغير

const addToCart = () => {
  // 1. تصفير العداد فوراً (Instant Reset)
  setQuantity(1);

  // 2. منطق الحفظ في localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || { items: [], totalAmount: 0, totalQuantity: 0 };
  const existingProductIndex = cart.items.findIndex(
    (item) => item.id === productId && item.section === sectionKey
  );
  const productPrice = parseFloat(product.price);
  const addedQuantity = quantity;

  if (existingProductIndex > -1) {
    cart.items[existingProductIndex].quantity += addedQuantity;
    cart.items[existingProductIndex].totalPrice = (
      (cart.items[existingProductIndex].quantity * productPrice)
    ).toFixed(2);
  } else {
    cart.items.push({
      id: productId,
      section: sectionKey,
      name: product.name,
      image: product.image,
      price: productPrice.toFixed(2),
      quantity: addedQuantity,
      totalPrice: (productPrice * addedQuantity).toFixed(2)
    });
  }

  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalAmount = cart.items.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);
  localStorage.setItem("cart", JSON.stringify(cart));

  // 3. أنيميشن الدفع المطور (Power Animation)
  const btn = document.querySelector(".add-to-cart-btn");
  
  // منع التفاعل أثناء الأنيميشن لكسر الـ Hover
  gsap.set(btn, { pointerEvents: "none" });

  const tl = gsap.timeline({
    onComplete: () => {
        // إعادة تفعيل الماوس فقط دون مسح الألوان
        gsap.set(btn, { pointerEvents: "auto" });
    }
  });

  tl.to(btn, { 
      scale: 0.8, 
      duration: 0.1, 
      ease: "power2.in" 
    })
    .to(btn, { 
      scale: 1.2, 
      backgroundColor: "#00ff73", 
      color: "#000",
      boxShadow: "0 0 50px #00ff73", 
      duration: 0.3, 
      ease: "back.out(3)" 
    })
    .to(btn, { 
      rotate: 3, 
      x: 10, 
      repeat: 5, 
      yoyo: true, 
      duration: 0.04 
    }) 
    .to(btn, { 
      scale: 1, 
      // نحدد الألوان هنا بوضوح لضمان ثباتها بعد الأنيميشن
      backgroundColor: textColor, 
      color: bgColor, 
      boxShadow: "0 0 0px rgba(0,0,0,0)",
      rotate: 0,
      x: 0,
      duration: 0.5, 
      ease: "expo.out" 
    });
};

useEffect(() => {
  gsap.fromTo(".qty-number", 
    { scale: 1.5, opacity: 0 }, 
    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }
  );
}, [quantity]);

  useEffect(() => {
    if (!product) return;

    // --- 1. أنيميشن الظهور الفخم (Luxury Reveal Animation) ---
    const immediateReveal = [
      ".product-image-section",
      ".product-title",
      ".product-description",
      ".product-meta",
      
      ".product-price",
      ".quantity-selector", // أضف هذا الكلاس هنا
  ".product-price1",    // تأكد أن الاسم يطابق الـ className
      ".add-to-cart-btn"
    ];
gsap.fromTo(
      immediateReveal,
      {
        opacity: 0,
        y: 40,
        rotateX: -10,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1.9,
        stagger: 0.15, // ظهور متتابع أنيق للعناصر
        ease: "expo.out",
        delay: 0.2 // تأخير بسيط جداً لضمان تحميل الصفحة
      }
    );


    // --- 2. أنيميشن الظهور عند السكرول (للأقسام السفلية فقط) ---
    const scrollReveal = [
      ".usage-title",
      ".usage-steps-wrapper",
      ".reviews-main-title",
      ".review-item"
    ];

    scrollReveal.forEach((selector) => {
      gsap.fromTo(
        selector,
        {
          opacity: 0,
          y: 50,
          rotateX: -15,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: selector,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });



    // --- 2. أنيميشن السكرول اللانهائي للكروت (Infinite Loop) ---
    if (scrollRef.current) {
      const target = scrollRef.current;
      const usageStepsCount = Object.entries(product.usage).length;
      
      // القيم الحسابية للحركة
      const cardWidth = 420;
      const gap = 40;
      const totalDistance = (cardWidth + gap) * usageStepsCount;

      const loop = gsap.to(target, {
        x: -totalDistance,
        duration: 20,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalDistance)
        },
      });

      // التحكم عند مرور الماوس
      const handleMouseEnter = () => gsap.to(loop, { timeScale: 0, duration: 0.5 });
      const handleMouseLeave = () => gsap.to(loop, { timeScale: 1, duration: 0.5 });

      target.addEventListener("mouseenter", handleMouseEnter);
      target.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        loop.kill();
        ScrollTrigger.getAll().forEach(st => st.kill());
        target.removeEventListener("mouseenter", handleMouseEnter);
        target.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [product]);

  if (!product) return <div className="error-msg">Product not found</div>;

  const bgColor = product.backgroundProduct || "#ffffff";
  const textColor = product.textColorProduct || "#000000";
  const usageSteps = Object.entries(product.usage);
  const doubleSteps = [...usageSteps, ...usageSteps, ...usageSteps];

  return (
    <div className="one-product-page" style={{ backgroundColor: bgColor }}>
      <style>
        {`
          body { background-color: ${bgColor}; margin: 0; overflow-x: hidden; }
          
          .usage-section { 
            position: relative; 
            width: 100vw; 
            padding: 120px 0; 
            overflow: hidden;
          }
          
          .usage-section::before, .usage-section::after {
            content: ""; 
            position: absolute; 
            top: 0; 
            width: 22%; 
            height: 100%; 
            z-index: 50; 
            pointer-events: none; 
            backdrop-filter: blur(3px);
          }

          .usage-section::before {
            left: 0;
            background: linear-gradient(to right, ${bgColor} 0%, ${bgColor} 30%, ${bgColor} 60%, rgba(0,0,0,0) 100%);
          }

          .usage-section::after {
            right: 0;
            background: linear-gradient(to left, ${bgColor} 0%, ${bgColor} 30%, ${bgColor} 60%, rgba(0,0,0,0) 100%);
          }

          .usage-steps-inner {
            display: flex;
            gap: 40px;
            width: max-content;
            will-change: transform;
          }

          .step-card:hover .step-line { width: 100% !important; }

          .step-card:hover .step-number {
            opacity: 1 !important;
            transform: translateX(10px);
          }

          .add-to-cart-btn:hover {
            background-color: ${bgColor} !important;
            color: ${textColor} !important;
            border: 3px solid ${textColor} !important; 
          }

          /* تخصيص السكرول بار */
          ::-webkit-scrollbar { width: 10px; }
          ::-webkit-scrollbar-track { background-color: ${bgColor} !important; }
          ::-webkit-scrollbar-thumb {
            background-color: ${textColor} !important;
            border-radius: 20px;
            border: 2px solid ${bgColor} !important; 
          }
          ::-webkit-scrollbar-thumb:hover { filter: brightness(1.2); }

          html { scrollbar-width: thin; scrollbar-color: ${textColor} ${bgColor}; }

          /* Responsive 790px */
          @media (max-width: 790px) {
            .usage-section::before, .usage-section::after {
              width: 15%; 
              backdrop-filter: blur(1px); 
              -webkit-backdrop-filter: blur(1.5px);
            }
            .usage-section::before {
              background: linear-gradient(to right, ${bgColor} 0%, ${bgColor} 20%, rgba(0,0,0,0) 100%);
            }
            .usage-section::after {
              background: linear-gradient(to left, ${bgColor} 0%, ${bgColor} 20%, rgba(0,0,0,0) 100%);
            }
          }

          /* تنعيم منظور الـ 3D لصفحة كاملة */
          .one-product-page { perspective: 1200px; }
        `}
      </style>

      <div className="product-main-wrapper">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} className="main-product-img" />
        </div>
        
        <div className="product-info-section" style={{ color: textColor }}>
          <h1 className="product-title1">{product.name}</h1>
          <p className="product-description12">{product.description}</p>
           <div className="meta">
          <div className="product-meta">
             <span><i className="fa-solid fa-star"></i> {product.Evaluation}</span>
             <span className="separator">|</span>
             <span><i className="fa-solid fa-bag-shopping"></i> {product.Purchasing} Purchases</span>
          </div>
          
          <h2 className="product-price1">${totalPrice}</h2>
         </div>
          {/* عداد الكمية */}
<div className="quantity-selector">
  <button 
    className="qty-btn"
    onClick={decreaseQty}
    style={{ backgroundColor: textColor, color: bgColor }}
  >
    <i className="fa-solid fa-minus"></i>
  </button>
  
  <span className="qty-number" style={{ color: textColor }}>
    {quantity}
  </span>

  <button 
    className="qty-btn"
    onClick={increaseQty}
    style={{ backgroundColor: textColor, color: bgColor }}
  >
    <i className="fa-solid fa-plus"></i>
  </button>
</div>
          
          <button className="add-to-cart-btn" style={{ backgroundColor: textColor, color: bgColor }} 
          onClick={addToCart}
          >
            <i className="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>

      <div className="extra-content-space">
        <div className="usage-section">
          <h2 className="usage-title" style={{ color: textColor, textAlign: 'center',}}>
            How To Use
          </h2>
          <div className="usage-steps-wrapper">
            <div className="usage-steps-inner" ref={scrollRef}>
              {doubleSteps.map(([key, step], index) => (
                <div
                  className="step-card"
                  key={`${key}-${index}`}
                  style={{ 
                    backgroundColor: textColor, 
                    color: bgColor, 
                    flex: '0 0 420px', 
                    position: 'relative',
                    overflow: 'hidden' 
                  }}
                >
                  <div className="step-number" style={{ color: bgColor, opacity: 0.6, fontSize: '4rem', fontWeight: '900' }}>
                    0{(index % usageSteps.length) + 1}
                  </div>
                  <p className="step-text" style={{ fontSize: '1.4rem', lineHeight: '1.6' }}>{step}</p>
                  <div className="step-line" style={{ backgroundColor: bgColor, position: 'absolute', bottom: 0, left: 0, height: '5px', width: '0', transition: 'width 0.3s' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="reviews-section" style={{ color: textColor }}>
          <h2 className="reviews-main-title1" style={{ color: textColor  }} >Customer Impressions</h2>
          <div className="reviews-container">
            {product.reviews.map((review, index) => (
              <div className="review-item" key={index}>
                <div className="review-header">
                  <span className="review-user">{review.user}</span>
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={i < Math.floor(review.rating) ? "fa-solid fa-star" : "fa-regular fa-star"}
                        style={{ color: textColor }}
                      ></i>
                    ))}
                  </div>
                </div>
                <p className="review-comment">"{review.comment}"</p>
                <div className="review-divider" style={{ backgroundColor: textColor, opacity: 0.2 }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}