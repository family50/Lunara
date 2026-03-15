import React, { useEffect, useRef, useState } from "react";
import Header from "./header.jsx";
import Facewash from "./facewash.jsx";
import "./home.css";
import F2 from "./f2.jsx";
import F3 from "./f3.jsx";
import F4 from "./f4.jsx";
import Footer from "./Footer.jsx";
import Products from "../productspage/products.jsx";
import Review from "../productspage/review.jsx";
import Shopping from "./shopping.jsx";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageLoader from '../PageLoader';

export default function Home() {
  const [page, setPage] = useState(() => sessionStorage.getItem("currentPage") || "home" );
  const [pagge, setPagge] = useState(() => sessionStorage.getItem("currentPagge") || "all");
  
  // التحكم في ظهور اللودر الذهبي
  const [isLoading, setIsLoading] = useState(false);
  // حالة لمنع الومضة المزعجة
  const [isSwitching, setIsSwitching] = useState(false);

  const [hasOpened, setHasOpened] = useState({
    home: page === "home",
    products: page === "products",
    cart: page === "cart"
  });

  const videoRefOriginal = useRef(null);
  const videoRefReversed = useRef(null);
  const scrollPositions = useRef({ home: 0, products: 0, cart: 0 });
  const prevPageRef = useRef(page);

  useEffect(() => {
    sessionStorage.setItem("currentPage", page);
    sessionStorage.setItem("currentPagge", pagge);
    if (!hasOpened[page]) {
      setHasOpened(prev => ({ ...prev, [page]: true }));
    }
  }, [page, pagge]);

  // منطق الفيديوهات (كما هو بدون تغيير)
  useEffect(() => {
    const videoOriginal = videoRefOriginal.current;
    const videoReversed = videoRefReversed.current;
    if (!videoOriginal || !videoReversed) return;
    videoOriginal.style.opacity = 1;
    videoReversed.style.opacity = 0;
    const safePlayOriginal = () => { const p = videoOriginal.play(); if (p && p.catch) p.catch(() => {}); };
    const safePlayReversed = () => { const p = videoReversed.play(); if (p && p.catch) p.catch(() => {}); };
    safePlayOriginal();
    const handleEndedOriginal = () => {
      videoReversed.currentTime = 0; videoOriginal.style.opacity = 0;
      videoReversed.style.opacity = 1; safePlayReversed();
    };
    const handleEndedReversed = () => {
      videoOriginal.currentTime = 0; videoReversed.style.opacity = 0;
      videoOriginal.style.opacity = 1; safePlayOriginal();
    };
    videoOriginal.addEventListener("ended", handleEndedOriginal);
    videoReversed.addEventListener("ended", handleEndedReversed);
    return () => {
      videoOriginal.removeEventListener("ended", handleEndedOriginal);
      videoReversed.removeEventListener("ended", handleEndedReversed);
    };
  }, []);

  // --- الحل المطور لمنع الومضة ودمج الـ PageLoader ---
  useEffect(() => {
    const formerPage = prevPageRef.current;
    
    // تشغيل اللودر وإخفاء المحتوى فوراً عند بدء التغيير
    setIsSwitching(true);
    setIsLoading(true);

    if (formerPage) {
      scrollPositions.current[formerPage] = window.scrollY;
    }

    prevPageRef.current = page;

    // تصفير السكرول في الخلفية
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      const targetScroll = scrollPositions.current[page] || 0;
      
      window.scrollTo({
        top: targetScroll,
        behavior: "instant"
      });

      // تحديث GSAP
      ScrollTrigger.refresh();

      // إظهار المحتوى وإخفاء اللودر بعد استقرار الحسابات
      setTimeout(() => {
        setIsSwitching(false);
        setIsLoading(false); // إخفاء اللودر الذهبي
        ScrollTrigger.refresh();
      }, 600); // وقت كافٍ ليظهر اللودر بشكل فخم ثم يختفي

    }, 150); 

    return () => clearTimeout(timer);
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
    scrollPositions.current = { home: 0, products: 0, cart: 0 };
    sessionStorage.removeItem("lastPage");
  }, []);

  // ستايل الحاوية لضمان نعومة الانتقال
  const contentStyle = {
    opacity: (isSwitching || isLoading) ? 0 : 1,
    transition: isSwitching ? "none" : "opacity 0.5s ease-in-out",
    visibility: (isSwitching || isLoading) ? "hidden" : "visible"
  };

  return (
    <div className="home-wrapper">
      {/* استدعاء اللودر الذهبي بناءً على حالة isLoading */}
      {isLoading && <PageLoader />}

      <video ref={videoRefOriginal} className="background-video fade-video" src="/assets/background/istockphoto-1304201131-640_adpp_is.mp4" autoPlay muted playsInline></video>
      <video ref={videoRefReversed} className="background-video fade-video" src="/assets/background/istockphoto-1304201131-640_adpp_is.mp4" autoPlay muted playsInline></video>

      <div className="content" style={contentStyle}>
        <Header setPage={setPage} page={page} />

        {hasOpened.home && (
          <div style={{ display: page === "home" ? "block" : "none" }} className={page === "home" ? "page-visible" : "page-hidden"}>
            <Facewash />
            <F2 />
            <F3 />
            <F4 />
            <Footer />
          </div>
        )}

        {hasOpened.products && (
          <div style={{ display: page === "products" ? "block" : "none" }}>
            <Products pagge={pagge} setPagge={setPagge} setPage={setPage} />
            <Review pagge={pagge} setPage={setPage} setPagge={setPagge} />
            <Footer className="footer-with-margin" />
          </div>
        )}

        {hasOpened.cart && (
          <div style={{ display: page === "cart" ? "block" : "none" }}>
            <Shopping />
          </div>
        )}
      </div>
    </div>
  );
}