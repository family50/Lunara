import { useLocation, useNavigate } from "react-router-dom"; // تم استيراد useNavigate
import { discoverMoreProducts } from "../date/Discover-More";
import "./all-products.css";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AllProducts() {
  const location = useLocation();
  const navigate = useNavigate(); // تعريف الدالة هنا
  const cardsContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef([]);
  const allProductsGridRef = useRef(null);
  const allProductsTitleRef = useRef(null);
  const filterWrapperRef = useRef(null);

  const params = new URLSearchParams(location.search);
  const sectionKey = params.get("section") || location.state?.sectionKey;


// ✨ الحل هنا: إرجاع السكرول للأعلى فوراً
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // "instant" عشان ميبانش فيه حركة "smooth" بطيئة وأنت لسه فاتح الصفحة
    });
  }, [sectionKey]);


  const sectionData = sectionKey ? discoverMoreProducts[sectionKey] : null;

  const backgroundColor = sectionData?.theme?.light || "#ffffff";
  const bgColor = sectionData?.theme?.light || "#ffffff";
  const thumbColor = sectionData?.theme?.dark || "#000000";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Most Popular");
  const [sortedProducts, setSortedProducts] = useState([]);

  const filterOptions = [
    { id: "popular", label: "Most Popular" },
    { id: "highPrice", label: "Highest Price" },
    { id: "lowPrice", label: "Lowest Price" },
    { id: "rating", label: "Top Rated" }
  ];

  const otherOptions = filterOptions.filter(opt => opt.label !== activeFilter);

  useEffect(() => {
    if (sectionData?.products) {
      setSortedProducts([...sectionData.products]);
    }
  }, [sectionData]);

  useEffect(() => {
    if (!sectionData?.products) return;
    let productsCopy = [...sectionData.products];
    switch (activeFilter) {
      case "Lowest Price": productsCopy.sort((a, b) => a.price - b.price); break;
      case "Highest Price": productsCopy.sort((a, b) => b.price - a.price); break;
      case "Top Rated": productsCopy.sort((a, b) => b.Evaluation - a.Evaluation); break;
      case "Most Popular": productsCopy.sort((a, b) => b.Purchasing - a.Purchasing); break;
      default: break;
    }
    setSortedProducts(productsCopy);
  }, [activeFilter, sectionData]);

  // 1. أنميشن الهيرو
  useEffect(() => {
    if (!sectionData) return;
    gsap.fromTo(imgRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" });
    gsap.fromTo(textRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.5, ease: "power3.out", delay: 0.5 });
  }, [sectionData]);

  // 2. أنميشن ScrollTrigger + Infinite Loop
  useEffect(() => {
    if (!sectionData || !cardsContainerRef.current) return;
    const ctx = gsap.context(() => {
      const cards = cardsContainerRef.current;
      const totalWidth = cards.scrollWidth;
      const halfWidth = totalWidth / 2;

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        }
      });

      revealTl.fromTo(".best-seller-text", { y: -30, opacity: 0, letterSpacing: "10px" }, { y: 0, opacity: 1, letterSpacing: "1.5px", duration: 1.2, ease: "power4.out" })
        .fromTo(".product-card-simple", { y: 60, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=0.8");

      const loop = gsap.to(cards, {
        x: `-=${halfWidth}`, duration: 20, ease: "none", repeat: -1, delay: 2,
        modifiers: { x: gsap.utils.unitize(val => parseFloat(val) % halfWidth) }
      });

      cards.addEventListener("mouseenter", () => loop.pause());
      cards.addEventListener("mouseleave", () => loop.play());
    }, sectionRef);
    return () => ctx.revert();
  }, [sectionData]);

  // 3. أنميشن ظهور المنتجات
  useEffect(() => {
    if (!sectionData || !allProductsGridRef.current || !allProductsTitleRef.current || !filterWrapperRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: allProductsGridRef.current,
          start: "top 80%", 
          toggleActions: "play none none none",
        }
      });

      tl.fromTo([allProductsTitleRef.current, filterWrapperRef.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
      .fromTo(allProductsGridRef.current.children,
        { opacity: 0, y: 50, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
        "-=0.4"
      );
    }, allProductsGridRef);
    return () => ctx.revert();
  }, [sectionData, sortedProducts]);

  const lines = sectionData?.theme?.Motivation.split("\n") || [];

  return (
    <div className="all-productssss" style={{ backgroundColor: backgroundColor }}>
      <style>
        {`
          ::-webkit-scrollbar { width: 12px; }
          ::-webkit-scrollbar-track { background: ${bgColor}; }
          ::-webkit-scrollbar-thumb { background-color: ${thumbColor}; border-radius: 20px; border: 3px solid ${bgColor}; }
          html { scrollbar-width: thin; scrollbar-color: ${thumbColor} ${bgColor}; }
          ::selection { background-color: ${thumbColor}; color: ${bgColor}; }
        `}
      </style>

      {sectionData && (
        <div className="img-container">
          <img ref={imgRef} src={sectionData.theme.img22} alt="hero" className="hero-image" />
          <div className="hero-text-wrapper">
            {lines.map((line, index) => (
              <h1 key={index} ref={(el) => (textRef.current[index] = el)} className="hero-text" style={{ color: sectionData.theme.dark3, fontFamily: "'Cinzel', serif" }}>
                {line}
              </h1>
            ))}
          </div>
        </div>
      )}

      <div className="best-seller-section" ref={sectionRef}>
        <h2 className="best-seller-text" style={{ color: sectionData?.theme?.dark }}>Best Seller</h2>
        <div className="best-seller-main-wrapper" style={{ "--side-color": bgColor }}>
          <div className="best-seller-content" ref={cardsContainerRef}>
            {[...(sectionData?.products?.slice(0, 3) || []), ...(sectionData?.products?.slice(0, 3) || [])].map((product, index) => (
              <div key={index} className="product-card-simple">
                <div className="product-img-box"><img src={product.image} alt={product.name} /></div>
                <div className="product-info-simple" style={{ color: sectionData?.theme?.dark }}>
                  <h3 className="p-name">{product.name}</h3>
                  <div className="p-rating">{"★".repeat(Math.floor(product.Evaluation))}<span className="p-purchases">({product.Purchasing})</span></div>
                  <p className="p-price">${product.price}</p>
                </div>
                <button 
                  className="explore-btn2" 
                  style={{ backgroundColor: thumbColor, color: bgColor, boxShadow: `0 10px 30px ${thumbColor}66` }}
                  onClick={() => navigate("/products", { 
                    state: { 
                      pagge: "one", 
                      productId: product.id, 
                      sectionKey: sectionKey 
                    } 
                  })}
                >
                  Explore More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="all-products-header">
        <h2 ref={allProductsTitleRef} className="all-products-title" style={{ color: thumbColor }}>
          Explore Collection
        </h2>
        <div ref={filterWrapperRef} className="filter-wrapper"> 
          <button className="filter-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ backgroundColor: thumbColor, color: bgColor, border: `1px solid ${thumbColor}` }}>
            <span className="filter-label">Sort By: {activeFilter}</span> 
            <i className={`fa-solid fa-chevron-down arrow-icon ${isDropdownOpen ? 'rotate' : ''}`} style={{color: bgColor}}></i>
          </button>
          {isDropdownOpen && (
            <ul className="filter-dropdown" style={{ backgroundColor: bgColor, border: `1px solid ${thumbColor}44` }}>
              {otherOptions.map((option) => (
                <li key={option.id} className="filter-option" style={{ color: thumbColor }} onClick={() => { setActiveFilter(option.label); setIsDropdownOpen(false); }}>
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="all-products-grid" ref={allProductsGridRef}>
        {sortedProducts.map((product, index) => (
          <div key={product.id || index} className="product-card-dark" style={{ backgroundColor: thumbColor }}>
            <div className="p-card-img-wrapper">
              <img src={product.image} alt={product.name} className="p-card-img" />
              <button 
                className="explore-btn3" 
                style={{ backgroundColor: thumbColor, color: bgColor }}
                onClick={() => navigate("/products", { 
                  state: { 
                    pagge: "one", 
                    productId: product.id, 
                    sectionKey: sectionKey 
                  } 
                })}
              >
                Explore
              </button>
            </div>
            <div className="p-card-details" style={{ color: bgColor }}>
              <h3 className="p-card-name">{product.name}</h3>
              <div className="p-card-footer">
                <div className="p-card-rating">{"★".repeat(Math.floor(product.Evaluation))}<span className="p-card-purchases" style={{ opacity: 0.7 }}>({product.Purchasing})</span></div>
                <p className="p-card-price">${product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}