import React, { useEffect, useRef } from "react"; // استيراد ريأكت والهوكس الأساسية
import "./f3.css"; // استيراد ملف التنسيقات الخاص بالمكون

// BabylonJS
import * as BABYLON from "@babylonjs/core"; // استيراد مكتبة بابيلون بالكامل
import "@babylonjs/loaders"; // استيراد محملات الملفات (مثل glb)

// GSAP
import gsap from "gsap"; // استيراد مكتبة الانيميشن GSAP
import { ScrollTrigger } from "gsap/ScrollTrigger"; // استيراد أداة التفاعل مع التمرير
import { useNavigate } from "react-router-dom"; // استيراد أداة التنقل بين الصفحات

// تفعيل ScrollTrigger
gsap.registerPlugin(ScrollTrigger); // تسجيل إضافة التمرير داخل GSAP

export default function F3() {
const navigate = useNavigate(); // إنشاء ثابت لاستخدام وظيفة التنقل
// دالة للتعامل مع الضغط على زر Shop Now

  /* =======================
      Refs (مراجع العناصر)
  ======================= */

  const productCardRef = useRef(null); // مرجع لكارت المحتوى النصي
  const titleRef = useRef(null);       // مرجع لعنوان المنتج
  const descRef = useRef(null);        // مرجع لوصف المنتج
  const btnsRef = useRef([]);          // مرجع لتخزين أزرار الشراء في مصفوفة
  const canvasRef = useRef(null);      // مرجع لعنصر الـ canvas الـ 3D

  const engineRef = useRef(null);      // مرجع لمحرك بابيلون للوصول إليه لاحقاً
  const sceneRef = useRef(null);       // مرجع للمشهد (Scene) للتحكم فيه
const handleShopNow = () => {
    navigate("/products", { state: { pagge: "main", sectionKey: "luxury-serum" } });
  };

  /* =======================
      GSAP Animation
  ======================= */
useEffect(() => {
    btnsRef.current = [];

    // ✅ تعريف التايم لاين هنا مع الإضافات الجديدة
    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1 },
      scrollTrigger: {
        trigger: productCardRef.current,
        start: "top 85%",
        once: true,
        invalidateOnRefresh: true, // ضروري عشان الـ display none/block
      }
    });
    // دخول الكارت بالكامل (تغيير الشفافية والحجم والضبابية)
    tl.fromTo(
      productCardRef.current,
      { opacity: 0, scale: 0.92, filter: "blur(14px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2 }
    )

    // دخول العنوان مع حركة تباعد الأحرف
    .fromTo(
      titleRef.current,
      { opacity: 0, y: 40, letterSpacing: "10px" },
      { opacity: 1, y: 0, letterSpacing: "3px" },
      "-=0.6" // يبدأ قبل نهاية الحركة السابقة بـ 0.6 ثانية
    )

    // دخول وصف المنتج من الأسفل للأعلى
    .fromTo(
      descRef.current,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0 },
      "-=0.5"
    )

   // دخول الأزرار بالتتابع (Stagger) من الأسفل للأعلى
    .fromTo(
      btnsRef.current,
      { opacity: 0, y: 50, scale: 0.95 }, 
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        stagger: 1, // الفارق الزمني بين كل زر والآخر
        duration: 2.5, 
        ease: "power3.out" 
      },
      "-=0.4"
    );

    // تنظيف GSAP عند مسح المكون من الذاكرة
return () => {
      tl.kill();
      ScrollTrigger.refresh(); // نحدث الحسابات عند الخروج
    };
  }, []);


  /* =======================
      BabylonJS Scene
  ======================= */
  useEffect(() => {
    // تنظيف أي مشهد أو محرك قديم لمنع استهلاك الذاكرة
    if (sceneRef.current) sceneRef.current.dispose();
    if (engineRef.current) engineRef.current.dispose();

    const canvas = canvasRef.current; // تعريف متغير للكانفاس من المرجع

    // إنشاء المحرك الأساسي لبابيلون
    const engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableUniformBuffers: true, // حل مشكلات التوافقية في بعض المتصفحات
    });

    const scene = new BABYLON.Scene(engine); // إنشاء مشهد جديد
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // جعل الخلفية شفافة تماماً

    // تحميل إضاءة البيئة (HDR) لتعطي انعكاسات واقعية
    const hdrTexture = new BABYLON.HDRCubeTexture(
     process.env.PUBLIC_URL + "/assets/background/sunny_rose_garden_2k.hdr",
     scene,
     256, 
     false, 
     true, 
     false, 
     true 
   );
    scene.environmentTexture = hdrTexture; // تعيين الـ HDR كخريطة بيئية للمشهد
    engineRef.current = engine; // تخزين المحرك في المرجع
    sceneRef.current = scene;   // تخزين المشهد في المرجع

    /* ========= Camera ========= */
    // إنشاء كاميرا تدور حول الهدف
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI /-1.450, // الزاوية الأفقية
      Math.PI / 2.2,    // الزاوية الرأسية
      4,                // المسافة (الراديوس)
      BABYLON.Vector3.Zero(), // الهدف الابتدائي (نقطة الصفر)
      scene
    );

    camera.wheelDeltaPercentage = 0.01; // حساسية زوم الماوس
    camera.target = new BABYLON.Vector3(-1.00, 1.39, 1.84); // تحديد هدف الكاميرا (مكان المنتج)
  const isCamAnimDone = sessionStorage.getItem("f3_cam_done");
    const width = window.innerWidth; // الحصول على عرض الشاشة الحالي
    let finalCamera; // متغير لتخزين إعدادات الكاميرا النهائية
 
    // تحديد إعدادات الكاميرا بناءً على عرض الشاشة (Responsive)
    if (width <= 550) { // وضع الموبايل الصغير
        finalCamera = {
          alpha: -Math.PI / -1.450,
          beta: Math.PI / 2.2,
          radius: 8,
          targetX: -1.00, targetY: 1.39, targetZ: 1.84
        };
    } else if (width <= 870) { // وضع التابلت
        finalCamera = {
          alpha: -Math.PI / -1.450,
          beta: Math.PI / 2.2,
          radius: 6,
          targetX: -1.00, targetY: 1.39, targetZ: 1.84
        };
    } else { // وضع الديسكتوب
        finalCamera = {
          alpha: -Math.PI / -1.450,
          beta: Math.PI / 2.2,
          radius: 4,
          targetX: -1.00, targetY: 1.39, targetZ: 1.84
        }
        if (isCamAnimDone) {
  // 2. لو الأنيميشن خلص قبل كدة، حط الكاميرا في مكانها النهائي فوراً
  camera.alpha = finalCamera.alpha;
  camera.beta = finalCamera.beta;
  camera.radius = finalCamera.radius;
  camera.target = new BABYLON.Vector3(finalCamera.targetX, finalCamera.targetY, finalCamera.targetZ);
} else {
  // 3. لو أول مرة، شغل الأنيميشن الطبيعي
  camera.target = new BABYLON.Vector3(-1.00, 1.39, 1.84);
  
  const startCamera = {
    alpha: finalCamera.alpha,
    beta: finalCamera.beta + 1,
    radius: finalCamera.radius + 2,
    targetY: finalCamera.targetY - 4
  };

  gsap.fromTo(
    camera,
    { alpha: startCamera.alpha, beta: startCamera.beta, radius: startCamera.radius },
    {
      alpha: finalCamera.alpha,
      beta: finalCamera.beta,
      radius: finalCamera.radius,
      duration: 1.8,
      ease: "power3.out",
      onComplete: () => sessionStorage.setItem("f3_cam_done", "true"), // سجل إنه خلص
      scrollTrigger: {
        trigger: productCardRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    }
  );

  gsap.fromTo(
    camera.target,
    { x: finalCamera.targetX, y: startCamera.targetY, z: finalCamera.targetZ },
    {
      x: finalCamera.targetX,
      y: finalCamera.targetY,
      z: finalCamera.targetZ,
      duration: 1.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: productCardRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    }
  );
}
    }
    
    // دالة لتغيير وضع الكاميرا فورياً عند تغيير حجم الشاشة (Resize)
    const handleResizeAnimation = () => {
      const width = window.innerWidth;
      let fCam;
      if (width <= 550) {
        fCam = { alpha: -Math.PI / -1.450, beta: Math.PI / 2.2, radius: 8, targetX: -1.00, targetY: 1.39, targetZ: 1.84 };
      } else if (width <= 870) {
        fCam = { alpha: -Math.PI / -1.450, beta: Math.PI / 2.2, radius: 6, targetX: -1.00, targetY: 1.39, targetZ: 1.84 };
      } else {
        fCam = { alpha: -Math.PI / -1.450, beta: Math.PI / 2.2, radius: 4, targetX: -1.00, targetY: 1.39, targetZ: 1.84 };
      }

      // عمل انيميشن سلس للانتقال بين أحجام الشاشات
      gsap.to(camera, { alpha: fCam.alpha, beta: fCam.beta, radius: fCam.radius, duration: 1.2, ease: "power3.out" });
      gsap.to(camera.target, { x: fCam.targetX, y: fCam.targetY, z: fCam.targetZ, duration: 1.2, ease: "power3.out" });
    };

    window.addEventListener("resize", handleResizeAnimation); // إضافة مستمع لحدث تغيير الحجم

    /* ========= Lights (الإضاءة) ========= */
    const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene); // إضاءة محيطة
    hemi.intensity = 0.6;

    const key = new BABYLON.DirectionalLight("key", new BABYLON.Vector3(-0.5, -1, -0.5), scene); // إضاءة أساسية موجهة
    key.position = new BABYLON.Vector3(3, 6, 3);
    key.intensity = 1.2;

    const rim = new BABYLON.DirectionalLight("rim", new BABYLON.Vector3(1, -0.5, 1), scene); // إضاءة حواف لإبراز المجسم
    rim.position = new BABYLON.Vector3(-4, 3, -4);
    rim.intensity = 0.6;

    const fill = new BABYLON.PointLight("fill", new BABYLON.Vector3(0, 2, 2), scene); // إضاءة نقطية لملء الظلال
    fill.intensity = 0.5;


    /* ========= Load Model (تحميل الموديل) ========= */
    BABYLON.SceneLoader.ImportMesh(
      "",
      process.env.PUBLIC_URL + "/assets/models/",
      "yllo.glb",
      scene,
      (meshes) => {
        const allowedMeshes = ["L1","L2","L3_primitive0","L3_primitive1","L4","L5","__root__"]; // القائمة المسموح بها

        meshes.forEach(m => {
          if (!allowedMeshes.includes(m.name)) m.dispose(); // حذف أي جزء ليس في القائمة لزيادة الأداء
        });

        const goldMesh = scene.getMeshByName("L5"); // الحصول على الجزء الذهبي
        if (goldMesh && goldMesh.material instanceof BABYLON.PBRMaterial) {
          const mat = goldMesh.material;
          mat.albedoColor = new BABYLON.Color3(0.5, 0.38, 0.05); // لون الذهب
          mat.reflectivityColor = new BABYLON.Color3(0.5, 0.38, 0.05);
          mat.metallic = 0.9; // درجة المعدن
          mat.roughness = 0.2; // درجة النعومة
          mat.environmentIntensity = 1.2; // قوة تأثره بالبيئة المحيطة
        }

        const meshPlastic = scene.getMeshByName("L3_primitive0"); // الحصول على جزء البلاستيك/الغطاء
        if (meshPlastic) {
          const plasticMat = new BABYLON.PBRMaterial("plasticMat", scene);
          plasticMat.alpha = 0.95; // شفافية بسيطة
          plasticMat.roughness = 0.3;
          plasticMat.metallic = 0;
          if (meshPlastic.material) {
            if (meshPlastic.material.albedoTexture) plasticMat.albedoTexture = meshPlastic.material.albedoTexture;
            else plasticMat.albedoColor = meshPlastic.material.albedoColor.clone();
          }
          meshPlastic.material = plasticMat;
        }
      } 
    );

    /* ========= Render Loop ========= */
    engine.runRenderLoop(() => {
      scene.render(); // أمر تكرار الرندر لكل فريم
    });

    const handleResize = () => engine.resize(); // دالة تحديث حجم المحرك
    window.addEventListener("resize", handleResize); // مستمع لتغيير حجم المحرك

    // تنظيف Babylon وكل المستمعات عند مغادرة المكون
    return () => {
          window.addEventListener("resize", () => engine.resize());
    // تنظيف الموارد عند مغادرة الصفحة أو إغلاق المكون
    return () => {
      scene.dispose();
      engine.dispose();
    };
    };

  }, []);


  /* =======================
      JSX (هيكل الصفحة)
  ======================= */
  return (
    <>
        <section className="f3 product-section">

          {/* النص والمحتوى */}
          <div className="product-card" ref={productCardRef}>
            <h1 className="product-title" ref={titleRef}>RENDER FEEL</h1>

            <p className="product-desc" ref={descRef}>
              Luxury Serum crafted for a premium skin experience
            </p>

            <div className="product-actions">
              <button
                className="btn add-to-cart"
                ref={el => el && btnsRef.current.push(el)} // إضافة المرجع للمصفوفة
              >
                <i className="fa-solid fa-cart-plus"></i>
                <span>Add to cart</span>
              </button>

              <button
                className="btn buy-now"
                onClick={handleShopNow} 
                ref={el => el && btnsRef.current.push(el)} // إضافة المرجع للمصفوفة
              >
                <i className="fa-solid fa-bag-shopping"></i>
                <span>Shop now</span>
              </button>
            </div>
          </div>

          {/* مساحة العرض الـ 3D */}
          <div className="product-canvas">
            <canvas ref={canvasRef} />
          </div>

        </section>
    </>
  );
}