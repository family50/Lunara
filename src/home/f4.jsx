import "./f4.css";
import { discoverMoreProducts } from "../date/Discover-More.js";
import { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function F4() {
  const navigate = useNavigate();
  
  // --- المراجع (Refs) لكل العناصر المتحركة ---
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const scrollRef = useRef(null);
  const leftBtnRef = useRef(null);
  const rightBtnRef = useRef(null);
  const cardsRef = useRef([]); // مصفوفة لمراجع الكروت

  const [isAlreadyStarted] = useState(() => {
    return sessionStorage.getItem("f4_anim_started") === "true";
  });

  // حالة التحكم في أزرار السكرول
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const startScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 350, behavior: "smooth" });
    setTimeout(updateButtons, 400);
  };

  const products = Object.entries(discoverMoreProducts).flatMap(([key, section]) =>
    section.products.slice(0, 3).map((product) => ({
      ...product,
      sectionKey: key,
    }))
  );

  useLayoutEffect(() => {
    // تجميع العناصر الموجودة فعلياً فقط
    const cards = cardsRef.current.filter(el => el !== null);
    const buttons = [leftBtnRef.current, rightBtnRef.current].filter(el => el !== null);
    
    let ctx = gsap.context(() => {
      // 1. حالة العودة للصفحة (القفز للنهاية)
      if (isAlreadyStarted) {
        gsap.set([titleRef.current, ...buttons, ...cards], {
          opacity: 1,
          y: 0,
          scale: 1,
          visibility: "visible",
          clearProps: "all" 
        });
        return;
      }

      // 2. حالة التشغيل لأول مرة
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%", 
          toggleActions: "play none none none",
          onStart: () => sessionStorage.setItem("f4_anim_started", "true")
        },
      });

      // أنميشن العنوان
      if (titleRef.current) {
        tl.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
      }
      
      // أنميشن الأزرار (Scale)
      if (buttons.length > 0) {
        tl.fromTo(buttons, 
          { scale: 0, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1 }, 
          "-=0.3"
        );
      }

      // أنميشن الكروت (Stagger)
      if (cards.length > 0) {
        tl.fromTo(cards, 
          { y: 40, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 
          "-=0.2"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isAlreadyStarted, products.length]);

  return (
    <section 
      className={`more-products-section ${isAlreadyStarted ? "anim-done-fix" : ""}`} 
      ref={sectionRef}
    >
      <h2 className="more-products-title" ref={titleRef}>
        Discover More
      </h2>

      <button 
        ref={leftBtnRef} 
        className="scroll-btn left" 
        disabled={!canScrollLeft} 
        onClick={() => startScroll(-1)}
      >
        ‹
      </button>
      
      <button 
        ref={rightBtnRef} 
        className="scroll-btn right" 
        disabled={!canScrollRight} 
        onClick={() => startScroll(1)}
      >
        ›
      </button>

      <div 
        className="more-products-container" 
        ref={scrollRef} 
        onScroll={updateButtons}
      >
        {products.map((product, index) => (
          <div 
            className="more-card" 
            key={product.name + index} 
            ref={(el) => (cardsRef.current[index] = el)}
          >
            <div className="image-box">
              <img src={product.image} alt={product.name} />
              <button 
                className="go-btn" 
                onClick={() => navigate("/products", { 
                  state: { 
                    pagge: "one", 
                    productId: product.id, 
                    sectionKey: product.sectionKey 
                  } 
                })}
              >
                Explore
              </button>
            </div>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <span>⭐ {product.Evaluation}</span>
          </div>
        ))}
      </div>
    </section>
  );
}