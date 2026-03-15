import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./select.css";
import PageLoader from '../PageLoader';
export default function Select() {


  const navigate = useNavigate();
  const refs = useRef({});



const [isLoading, setIsLoading] = useState(true);

// 2. useEffect لإيقاف التحميل بعد وقت معين أو بعد ما الصفحة تجهز
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // هيختفي بعد ثانية ونصف

    return () => clearTimeout(timer);
  }, []);



  const setRef = (key) => (el) => {
    refs.current[key] = el;
  };

  function goHome() {
    navigate("/home");
  }

  useLayoutEffect(() => {
    if (!isLoading) { // شرط: ابدأ الأنيميشن فقط لما isLoading تكون false
    const tl = gsap.timeline({
      defaults: {
        ease: "power4.out",
        duration: 1,
      },
    });

    tl.fromTo(
      refs.current.div1,
      { y: "80%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 1.5, ease: "power3.out" }
    )
      .fromTo(
        refs.current.logo1,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
        "-=0.9"
      )
      .fromTo(
        refs.current.tagline,
        { x: -120, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(
        refs.current.button,
        { x: -120, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );

 }
  }, [isLoading]); // ربط الأنيميشن بحالة isLoading

  return (
    <>
    {isLoading && <PageLoader />}
    <div className="container">
      <div id="select">
        <div
          className="div1"
          ref={setRef("div1")}
          style={{
            background: `url("/assets/background/WhatsAppImage2026-01-03at5.17.29PM.png") center / cover no-repeat`,
          }}
        >
          <div className="top" ref={setRef("logo1")}>
            <img
              src="/assets/background/______________removed_bg_2026-02-15T01-32-16.png"
              alt="LUNARA Logo"
              className="logo"
            />
          </div>

          <div className="bottom">
            <p className="tagline" ref={setRef("tagline")}>
              Introducing Lunara by Family Group.
            </p>

            <input
              ref={setRef("button")}
              type="button"
              id="home"
              value="Explore the shop"
              onClick={goHome}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
