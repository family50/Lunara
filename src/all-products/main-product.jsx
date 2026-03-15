import React, { useEffect, useRef, useState } from "react";
import "./main-product.css";

// BabylonJS Imports
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import gsap from "gsap"; // استيراد gsap مباشرة للانميشن
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export default function MainProduct() {
  const videoRefOriginal = useRef(null);
  const videoRefReversed = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
const marqueeRef = useRef(null);
const howToUseRef = useRef(null);
const reviewsRef = useRef(null);
const [windowWidth, setWindowWidth] = useState(window.innerWidth);

// بيانات كروت طريقة الاستعمال
  const usageSteps = [
    { icon: "fa-droplet", text: "Apply 2-3 drops on clean skin" },
    { icon: "fa-hand-sparkles", text: "Massage gently in circles" },
    { icon: "fa-sun", text: "Best  morning routine" },
    { icon: "fa-moon", text: "Repair while you sleep deeply" },
    { icon: "fa-leaf", text: "100% Organic ingredients used" },
    { icon: "fa-shield-halved", text: "Protects from daily pollution" },
    { icon: "fa-water", text: "Maintains 24h deep hydration" },
  ];



  const reviews = [
  { id: 1, name: "Sophia Loren", rating: 5, comment: "The texture is divine. My skin has never felt this hydrated and glowing. Truly a luxury experience in a bottle." },
  { id: 2, name: "Alexander Wright", rating: 5, comment: "I've tried many high-end serums, but this Essence stands out. The absorption is immediate, and the results are visible within days." },
  { id: 3, name: "Isabella Rossi", rating: 4, comment: "Sophisticated formula. It works perfectly under makeup, providing a smooth, silk-like finish to my morning routine." },
  { id: 4, name: "Marcus Thorne", rating: 5, comment: "A masterpiece of skincare. The organic ingredients make a real difference for sensitive skin like mine." },
  { id: 5, name: "Elena Gilbert", rating: 5, comment: "Pure elegance. From the packaging to the last drop, it's worth every penny. My fine lines are noticeably diminished." },
  { id: 6, name: "Julian Vane", rating: 5, comment: "The deep hydration is real. It feels like a spa treatment every night. Highly recommended for dry skin types." },
  { id: 7, name: "Clara Beaumont", rating: 5, comment: "Incredible scent and even better results. It has become the cornerstone of my daily rejuvenation ritual." }
];

/* --- 1. حل مشكلة السكرول عند الدخول والريفرش --- */
  useEffect(() => {
    // تصفير السكرول فوراً عند تحميل المكون
    window.scrollTo(0, 0);

    // التأكد من أن المتصفح لا يحاول استعادة السكرول تلقائياً (خاصة في Chrome)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // تنظيف عند الخروج من الصفحة (اختياري: إعادة الخاصية للوضع الطبيعي)
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);
  
  /* --- منطق فيديو الخلفية --- */
  useEffect(() => {
    const videoOriginal = videoRefOriginal.current;
    const videoReversed = videoRefReversed.current;
    if (!videoOriginal || !videoReversed) return;
    videoOriginal.style.opacity = 1;
    videoReversed.style.opacity = 0;
    const safePlay = (vid) => {
      const p = vid.play();
      if (p && p.catch) p.catch(() => {});
    };
    safePlay(videoOriginal);
    const handleEndedOriginal = () => {
      videoReversed.currentTime = 0;
      videoOriginal.style.opacity = 0;
      videoReversed.style.opacity = 1;
      safePlay(videoReversed);
    };
    const handleEndedReversed = () => {
      videoOriginal.currentTime = 0;
      videoReversed.style.opacity = 0;
      videoOriginal.style.opacity = 1;
      safePlay(videoOriginal);
    };
    videoOriginal.addEventListener("ended", handleEndedOriginal);
    videoReversed.addEventListener("ended", handleEndedReversed);
    return () => {
      videoOriginal.removeEventListener("ended", handleEndedOriginal);
      videoReversed.removeEventListener("ended", handleEndedReversed);
    };
  }, []);


const runScrollAnimations = () => {
  ScrollTrigger.refresh();
  // 1. إخفاء العناصر برمجياً فوراً لتجنب الوميض (Flash of Unstyled Content)
  const allSections = [howToUseRef.current, reviewsRef.current];
  gsap.set(allSections, { opacity: 0, y: 50 });

  // 2. أنميشن قسم "طريقة الاستعمال"
  if (howToUseRef.current) {
    const usageTitle = howToUseRef.current.querySelector(".usage-title");
    const usageCards = howToUseRef.current.querySelectorAll(".usage-card");

    // إخفاء الكروت والعنوان داخلياً
    gsap.set(usageTitle, { opacity: 0, y: -30 });
    gsap.set(usageCards, { opacity: 0, y: 80, rotateX: 15, filter: "blur(10px)" });

    const tlUsage = gsap.timeline({
      scrollTrigger: {
        trigger: howToUseRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    tlUsage
      .to(howToUseRef.current, { opacity: 1, y: 0, duration: 0.7 })
      .to(usageTitle, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.2")
      .to(usageCards, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out"
      }, "-=0.8");
  }

  // 3. أنميشن قسم "التعليقات"
  if (reviewsRef.current) {
    const reviewCards = reviewsRef.current.querySelectorAll(".review-wide-card");
    const goldLine = reviewsRef.current.querySelector(".gold-elegant-line");

    gsap.set(reviewCards, { opacity: 0, y: 40, scale: 0.95 });
    gsap.set(goldLine, { width: 0 });

    const tlReviews = gsap.timeline({
      scrollTrigger: {
        trigger: reviewsRef.current,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    tlReviews
      .to(reviewsRef.current, { opacity: 1, y: 0, duration: 0.8 })
      .to(goldLine, { width: "100%", duration: 1.2, ease: "power2.inOut" }, "-=0.4")
      .to(reviewCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.3, // ظهور أبطأ ومتدرج
        ease: "power4.out"
      }, "-=0.8");
  }

  // تحديث ScrollTrigger لحساب المسافات بعد الرندر
  ScrollTrigger.refresh();
};
// استدعي الدالة بعد تحميل الموديل أو في نهاية الـ useEffect

useEffect(() => {
    // ننتظر قليلاً لضمان أن الـ DOM استقر وتم تصفير السكرول
    const timer = setTimeout(() => {
      runScrollAnimations();
    }, 1000); // زيادة بسيطة لضمان تصفير السكرول أولاً

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      clearTimeout(timer);
    };
  }, []);

const moveMarquee = (direction) => {
  const marquee = marqueeRef.current;
  const container = marquee.parentElement;
  
  if (marquee) {
    // 1. حساب عرض الكروت الكلي ناقص عرض الحاوية المرئية
    const maxScroll = -(marquee.scrollWidth - container.offsetWidth);
    const scrollAmount = 350; // مقدار القفزة
    
    // 2. الحصول على القيمة الحالية لـ X
    const currentX = gsap.getProperty(marquee, "x") || 0;
    
    // 3. تحديد الهدف الجديد
    let targetX = direction === "left" ? currentX - scrollAmount : currentX + scrollAmount;
    
    // 4. منع الخروج عن الحدود (Limit)
    if (targetX > 0) targetX = 0; // البداية
    if (targetX < maxScroll) targetX = maxScroll; // النهاية
    
    // 5. التنفيذ
    gsap.to(marquee, {
      x: targetX,
      duration: 0.8,
      ease: "power2.out"
    });
  }
};
/* --- BabylonJS 3D Scene --- */
  useEffect(() => {
    let engine = null;
    let scene = null;
    let mainProductModel = null;

    const initBabylon = async () => {
      if (!canvasRef.current) return;

      if (BABYLON.Engine.LastCreatedEngine) {
        BABYLON.Engine.LastCreatedEngine.dispose();
      }

      try {
        engine = new BABYLON.Engine(canvasRef.current, true, {
          preserveDrawingBuffer: true,
          stencil: true,
          disableUniformBuffers: true,
        }, true);

        scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        const camera = new BABYLON.ArcRotateCamera(
          "cameraMain",
          -Math.PI / -1.5182,
          Math.PI / 2.345,
          8.935,
          new BABYLON.Vector3(-0.736, 0.364, -0.247),
          scene
        );
     
        camera.inputs.clear();

        const hdrTexture = new BABYLON.HDRCubeTexture(
          process.env.PUBLIC_URL + "/assets/background/sunny_rose_garden_2k.hdr",
          scene, 256, false, true, false, true
        );
        scene.environmentTexture = hdrTexture;

        const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
        hemi.intensity = 0.7;

        // دالة تحديث الموقع المنفصلة
        const updateModelPosition = (width) => {
          if (!mainProductModel) return;

          let targetX, targetY;

          if (width <= 750) {
            // إحداثيات الموبايل
            targetX = -0.9;
            targetY = -0.7;
          } else {
            // إحداثيات الشاشات الكبيرة (أكبر من 750 بما فيها فوق الـ 1024)
            targetX = 0; // القيمة الافتراضية للموديل في المركز بالنسبة للكاميرا
            targetY = 0;
          }

          gsap.to(mainProductModel.position, {
            x: targetX,
            y: targetY,
            duration: 1.2,
            ease: "power2.out"
          });
        };

        const runIntroAnimation = () => {
          const tl = gsap.timeline();
          tl.from(camera, {
            radius: 20,
            alpha: camera.alpha + 0.5,
            beta: camera.beta + 0.2,
            duration: 2.5,
            ease: "expo.out"
          });

          tl.to([
            canvasRef.current,
            ".golden-info-box", 
            ".product-name", 
            ".divider-section .line", 
            ".product-description", 
            ".future-under-product-content", 
            ".add-to-cart-gold", 
            ".extra-info-row"
          ], { 
            opacity: 1, 
            duration: 1, 
            stagger: 0.1 
          }, "-=2");
        };

        BABYLON.SceneLoader.ImportMesh("", process.env.PUBLIC_URL + "/assets/models/", "yllo.glb", scene, (meshes) => {
          const allowed = ["L1", "L2", "L3_primitive0", "L3_primitive1", "L4", "L5", "__root__"];
          meshes.forEach(m => { 
            if (!allowed.includes(m.name)) m.dispose(); 
            else if (m.name === "__root__") mainProductModel = m; 
          });

          const gold = scene.getMeshByName("L5");
          if (gold && gold.material instanceof BABYLON.PBRMaterial) {
            gold.material.albedoColor = new BABYLON.Color3(0.5, 0.38, 0.05);
            gold.material.metallic = 0.9;
            gold.material.roughness = 0.2;
          }
          
          // حل مشكلة الـ Refresh: استدعاء التموضع فور تحميل الموديل
          updateModelPosition(window.innerWidth);
          runIntroAnimation();
        });

        engine.runRenderLoop(() => {
          if (mainProductModel) mainProductModel.rotate(BABYLON.Axis.Y, 0.005, BABYLON.Space.LOCAL);
          scene.render();
        });

        const handleResize = () => {
          engine.resize();
          setWindowWidth(window.innerWidth);
          updateModelPosition(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        engineRef.current = engine;
        sceneRef.current = scene;
        engineRef.current._resizeHandler = handleResize;

      } catch (e) {
        console.error("WebGL Error:", e);
      }
    };
    

    const timer = setTimeout(initBabylon, 100);
    return () => {
      clearTimeout(timer);
      if (engineRef.current?._resizeHandler) window.removeEventListener("resize", engineRef.current._resizeHandler);
      sceneRef.current?.dispose();
      engineRef.current?.dispose();
    };
  }, []);

  return (
    <div className="main-product-wrapper">
      <video ref={videoRefOriginal} className="bg-video" src="/assets/background/istockphoto-1304201131-640_adpp_is.mp4" muted playsInline></video>
      <video ref={videoRefReversed} className="bg-video" src="/assets/background/istockphoto-1304201131-640_adpp_is.mp4" muted playsInline></video>

      <div className="main-content-container">
        <div className="left-visual-space"
       
        >
          {/* الكانفاس يبدأ بـ Opacity 0 ليظهر بالانميشن */}
       <canvas 
  className="cccc" 
  ref={canvasRef} 
  style={{ 
    opacity: 0,
    // تصحيح: إضافة علامات التنصيص حول الـ url
 backgroundImage: windowWidth <= 750 
      ? 'url("/assets/background/Gemini_Generated_Image_q5uzwpq5uzwpq5uz_no_bg.png")' 
      : 'none',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% auto',
    backgroundPosition: 'top', 
    position: 'relative',
    zIndex: 5,
    display: 'block'
  }} 
/>
          
          <div className="future-under-product-content" style={{ opacity: 0 }}>
            <div className="product-highlights">
              <span>ANTI-AGING</span>          
              <span>DEEP HYDRATION</span>
            </div>
            <div className="product-price-tag">
              <span className="currency">$</span>
              <span className="price-value">185.00</span>
            </div>
          </div>
        </div>

        <div className="right-details-space">
          <div className="details-vertical-stack">
            <div className="golden-info-box" style={{ opacity: 0 }}>
              <h1 className="product-name">LUXURY ESSENCE</h1>
              <div className="divider-section">
                <span className="line"></span>
                <i className="fa-solid fa-crown gold-icon"></i>
                <span className="line"></span>
              </div>
              <p className="product-description">
                Experience the pinnacle of skin rejuvenation with our premium 
                formula. Crafted for those who seek elegance and visible results 
                in every drop.
              </p>
            </div>

            <div className="extra-info-row" style={{ opacity: 0 }}>
              <div className="info-text-group">
                <span>NATURAL</span>
                <i className="fa-solid fa-star small-gold-icon"></i>
                <span>ORGANIC</span>
              </div>
              <div className="elegant-thin-line"></div>
            </div>

            <button className="add-to-cart-gold" style={{ opacity: 0 }}>ADD TO CART</button>
          </div>
        </div>
      </div>
      {/* --- قسم طريقة الاستعمال المضاف --- */}
      <div className="how-to-use-section"ref={howToUseRef}>
        <h2 className="usage-title">HOW TO USE</h2>

        {/* أزرار التحكم (الأسهم) */}
    <div className="usage-controls">
      <button className="control-btn" onClick={() => moveMarquee("right")}>
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button className="control-btn" onClick={() => moveMarquee("left")}>
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>

        <div className="marquee-container">
          <div className="edge-blur-left"></div>
          <div className="edge-blur-right"></div>
          <div className="marquee-wrapper" ref={marqueeRef}>
            {/* نكرر المصفوفة مرتين لضمان استمرارية الحركة بدون فراغ */}
            {usageSteps.map((step, index) => (
              <div className="usage-card" key={index}>
                <i className={`fa-solid ${step.icon} usage-icon`}></i>
                <div className="card-divider"></div>
                <p className="usage-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="reviews-section" ref={reviewsRef}>
  <div className="reviews-header">
    <h2 className="reviews-main-title">TESTIMONIALS</h2>
    <div className="gold-elegant-line"></div>
  </div>

  <div className="reviews-container">
    {reviews.map((rev) => (
      <div className="review-wide-card" key={rev.id}>
     
        <div className="review-card-left">
          <h3 className="reviewer-name">{rev.name}</h3>
          <div className="reviewer-stars">
            {[...Array(rev.rating)].map((_, i) => (
              <i key={i} className="fa-solid fa-star gold-star"></i>
            ))}
          </div>
        </div>
        <div className="review-card-right">
          <p className="reviewer-comment">"{rev.comment}"</p>
        </div>
        <div className="card-inner-border"></div>
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
  );
}