import "./review.css";
import { discoverMoreProducts } from "../date/Discover-More";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: "Hair", color: "#8C6D39", img: "/assets/background/hair.jpg" },
  { name: "Face", color: "#333333", img: "/assets/background/face.jpg" },
  { name: "Body", color: "#3D0707", img: "/assets/background/body.jpg" },
  { name: "Natural", color: "#4E5832", img: "/assets/background/natural.jpg" },
  { name: "Gift", color: "#8B3E5A", img: "/assets/background/gift.jpg" },
];




export default function Review({ setPagge ,setPage}) {
  const cardsRef = useRef([]); // نحتفظ بريفرنس لكل كارد
const navigate = useNavigate(); // أضفنا الـ navigate هنا
  useEffect(() => {
    // GSAP animation عند تحميل الصفحة
    gsap.fromTo(
      cardsRef.current,           // المصفوفة اللي فيها كل الكروت
      { y: 40, opacity: 0 },      // البداية: تحت بمقدار 40px وشفافية 0
      {
        y: 0,                     // النهاية: مكانها الطبيعي
        opacity: 1,               // تصبح مرئية
        stagger: 0.2,             // كل كارد يظهر بعد 0.2 ثانية من اللي قبله
        duration: 0.6,
        ease: "power3.out"
      }
    );
  }, []);

  // دالة التعامل مع الضغط على الكاتيجوري
const handleCategoryClick = (catName) => {
  const sectionKey = catName.toLowerCase(); 
  // أضفنا state هنا لتحديد أننا نريد صفحة "all"
  navigate(`/products?section=${sectionKey}`, { 
    state: { pagge: "all" } 
  });
};


  return (
   <>
      {/* الكاتيجوريز */}
      <div className="review-section">
        {categories.map((cat, index) => (
          <div
            className="review-card"
            key={cat.name}
            ref={(el) => (cardsRef.current[index] = el)}
            // أضفنا الـ onClick هنا وتغيير شكل الماوس
            onClick={() => handleCategoryClick(cat.name)}
            style={{ cursor: "pointer" }} 
          
          >
            <img
              src={cat.img}
              alt={cat.name}
              style={{
                boxShadow: `0 20px 40px ${cat.color}80`,
                borderRadius: "10px",
              }}
            />
            <p style={{ color: cat.color }}>{cat.name}</p>
          </div>
        ))}
      </div>

      {/* عنوان صفحة المنتجات (مرة واحدة فقط) */}
      <h1 className="products-page-title">Explore Our Products</h1>

      {/* الأقسام */}
      {Object.entries(discoverMoreProducts).map(([key, section]) => (
        <CategorySection key={key} 
        section={section}
         sectionKey={key}  
         setPagge={setPagge} 
          setPage={setPage}/>
      ))}
    </>
  );
}
function CategorySection({ section, sectionKey}) {
   const navigate = useNavigate();
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);

  const products = section.products.slice(0, 9);
  const theme = section.theme;

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll(".mini-card");

    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const scroll = (dir) => {
    scrollRef.current.scrollBy({
      left: dir * 300,
      behavior: "smooth",
    });
  };
 

 return (
      <>
     
      
  <section
  
    ref={sectionRef}                // ريفيرنس للسكشن عشان GSAP
    className="category-section"    // كلاس السكشن
  style={{ "--line-color": theme.dark }}// نخزن لون الخط في متغير CSS
  >
    
    {/* الهيدر */}
    <div className="category-header"> {/* الحاوية اللي فيها العنوان والأزرار */}

      <h2 style={{ color: theme.dark }}> {/* عنوان القسم بلون dark */}
        Discover {section.title || sectionKey} {/* اسم القسم */}
      </h2>

      <div className="header-buttons"> {/* حاوية الأزرار كلها */}

        {/* زر الذهاب لصفحة المنتجات */}
 <button
  className="go-products-btn"
  onClick={() => navigate(`/products?section=${sectionKey}`, { 
    state: { pagge: "all" } // تأكد من إرسال pagge: "all" هنا أيضاً
  })}
  style={{
    background: theme.primary,
    color: theme.dark2 || theme.dark
  }}
>
  <span className="full-text">View Products</span>
  <span className="short-text">Products</span>
</button>

        {/* أزرار السهم */}
        <div className="arrows"> {/* حاوية الأسهم */}

          <button
            onClick={() => scroll(-1)}               // تحريك لليسار
            style={{
              background: theme.primary,             // الخلفية primary
              color: theme.dark2 || theme.dark                     // السهم dark
            }}
          >
            ‹ {/* سهم يسار */}
          </button>

          <button
            onClick={() => scroll(1)}                // تحريك لليمين
            style={{
              background: theme.primary,             // الخلفية primary
              color: theme.dark2 || theme.dark                      // السهم dark
            }}
          >
            › {/* سهم يمين */}
          </button>

        </div>
      </div>
    </div>

    {/* السلايدر */}
    <div className="category-slider" ref={scrollRef}> {/* حاوية الكروت */}
      {products.map((p) => (                         // لوب على المنتجات
        <div
          className="mini-card"                      // كلاس الكارد
          key={p.name}                               // key للـ React
          style={{ background: theme.primary }}      // خلفية الكارد primary
        >
             <div className="image-wrapper">
          <img
            src={p.image}                            // صورة المنتج
            alt={p.name}                             // وصف الصورة
           
            style={{
              boxShadow: `0 20px 40px ${theme.dark}80`, // شادو بلون dark
              borderRadius: "12px",                  // تدوير الصورة
            }}
         />
          <button className="product-btn"
            onClick={() => navigate("/products", { 
    state: { 
      pagge: "one", 
      productId: p.id, 
      sectionKey: sectionKey 
    } 
  })}
           style={{
                "--primary": theme.light,
                "--dark": theme.dark
               }}
          >View Product</button> {/* الزر داخل الصورة */}
         </div>
          <p style={{ color: theme.dark2 || theme.dark }}>
  {p.name}
</p>

<span style={{ color: theme.dark2 || theme.dark }}>
  ⭐ {p.Evaluation}
</span>
        </div>
      ))}
    </div>
  </section>
  </>
);
}