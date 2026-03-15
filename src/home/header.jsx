import React, { useState, useRef, useEffect } from "react"; // استيراد React والـ Hooks الأساسية
import gsap from "gsap"; // استيراد مكتبة GSAP للأنيميشن
import "./header.css"; // استيراد ملف الـ CSS

export default function Header({ setPage, page }) { // استقبال setPage لتغيير الحالة و page لمعرفة الصفحة الحالية

  const headerRef = useRef(null); // مرجع للهيدر
  const logoRef = useRef(null); // مرجع للوجو
  const navLinksRef = useRef([]); // مراجع الروابط
  const buttonRef = useRef(null); // مرجع الزر اليمين
  const dropdownRef = useRef(null); // مرجع القائمة

  const [hovered, setHovered] = useState(null); // تتبع الـ Hover
  const pages = ["home", "products", "cart"]; // أسماء الصفحات البرمجية
  const labels = ["Home", "Products", "Cart"]; // الأسماء المعروضة
  const icons = ["fa-bag-shopping", "fa-box", "fa-cart-shopping"]; // الأيقونات

  /* ============================================================
        🎬 دالة الأنيميشن الأصلية (الظهور الفاخر)
     ============================================================ */
  const animateOnLoad = () => {
    // أنيميشن الهيدر من الأعلى
    gsap.fromTo(headerRef.current,
      { y: -80, opacity: 0 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.5 }
    );

    const tl = gsap.timeline({ delay: 0.5 });

    // أنيميشن اللوجو
    tl.fromTo(logoRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    // أنيميشن الروابط
    tl.fromTo(navLinksRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1 },
      "-=0.7"
    );

    // أنيميشن الزر اليمين
    tl.fromTo(buttonRef.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.7"
    );
  };

  /* ============================================================
        🛡️ الحل النهائي: استخدام Flags لكل حالة انتقال
     ============================================================ */
  useEffect(() => {
    // نتحقق إذا كان الموقع ككل قد تم فتحه لأول مرة في هذه الجلسة
    const isFirstTimeEver = !sessionStorage.getItem("site_loaded");

    if (isFirstTimeEver) {
      // 🟢 أول مرة نفتح الموقع: شغل الأنيميشن الفاخر
      animateOnLoad();
      sessionStorage.setItem("site_loaded", "true"); // سجل أن الموقع تم تحميله
      sessionStorage.setItem(`visited_${page}`, "true"); // سجل أن هذه الصفحة الحالية تمت زيارتها
    } else {
      // 🔴 الموقع محمل مسبقاً (انتقال بين الصفحات)
      const hasVisitedThisPage = sessionStorage.getItem(`visited_${page}`);

      if (hasVisitedThisPage) {
        // إذا زار هذه الصفحة من قبل في نفس الجلسة: أظهر كل شيء فوراً بدون أي حركة
        gsap.set([headerRef.current, logoRef.current, navLinksRef.current, buttonRef.current], 
                 { opacity: 1, y: 0, x: 0 });
      } else {
        // إذا كانت صفحة جديدة ننتقل إليها: يمكننا عمل أنيميشن بسيط جداً أو إظهار فوري
        // هنا سأختار الإظهار الفوري لضمان عدم حدوث "ريفرش" بصري مزعج
        gsap.set([headerRef.current, logoRef.current, navLinksRef.current, buttonRef.current], 
                 { opacity: 1, y: 0, x: 0 });
        sessionStorage.setItem(`visited_${page}`, "true"); // سجل الزيارة لهذه الصفحة
      }
    }
  }, [page]); // جعلنا page هنا "Dependency" لكي يراقب الانتقال

  return (
    <header className="header" ref={headerRef}>
      <div className="header-left" ref={logoRef}>
        Lunara
      </div>

      <nav className="header-center">
        {pages.map((p, i) => {
          const isHovered = hovered === p;
          const isActive = page === p;
          const showHighlight = isActive || isHovered;

          return (
            <button
              type="button" // منع الـ Refresh التلقائي
              key={p}
              ref={(el) => (navLinksRef.current[i] = el)}
              className={`nav-item ${showHighlight ? "active" : ""}`}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => {
                e.preventDefault(); // منع أي سلوك افتراضي
                if (page === p) return; // لا تفعل شيء إذا كنت في نفس الصفحة
                setPage(p); // غيّر الصفحة في الـ State الخاص بالـ Home
              }}
            >
              <i className={`fa-solid ${icons[i]} icon`}></i>
              {labels[i]}
            </button>
          );
        })}
      </nav>

      <div className="header-right" ref={dropdownRef}>
        <button
          type="button"
          className="RENDERFEEL-btn"
          ref={buttonRef}
          onClick={(e) => e.preventDefault()}
        >
          <span className="circle" style={{ backgroundColor: "yellow" }}></span>
          <span className="theme-name">RENDERFEEL</span>
          <i className="fas fa-chevron-down arrow-icon"></i>
        </button>
      </div>
    </header>
  );
}