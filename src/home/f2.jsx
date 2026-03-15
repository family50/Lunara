import React, { useEffect, useRef } from 'react';
import './f2.css';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function F2() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  const renderFeelRef = useRef(null);
  
  // المصفوفات للـ Refs
  const boxRefs = useRef([]);
  const iconRefs = useRef([]);
  const textRefs = useRef([]);

  useEffect(() => {
    // 1️⃣ تنظيف المصفوفات قبل البدء لمنع التكرار
    boxRefs.current = [];
    iconRefs.current = [];
    textRefs.current = [];

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 2️⃣ إعداد BabylonJS المحسن
    const engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableUniformBuffers: true,
    });
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    engineRef.current = engine;
    sceneRef.current = scene;

    // الإضاءة والبيئة
    const hdrTexture = new BABYLON.HDRCubeTexture(
      process.env.PUBLIC_URL + "/assets/background/sunny_rose_garden_2k.hdr",
      scene, 256, false, true, false, true
    );
    scene.environmentTexture = hdrTexture;

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / -6.232,
      Math.PI / 2.785,
      9,
      new BABYLON.Vector3(1.17, 1.2, -1.5),
      scene
    );
    camera.detachControl(canvas);

    // أضواء إضافية لتحسين مظهر المنتج
    new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene).intensity = 0.6;
    const keyLight = new BABYLON.DirectionalLight("keyLight", new BABYLON.Vector3(-0.5, -1, -0.5), scene);
    keyLight.intensity = 1.2;

    // 3️⃣ تحميل الموديل والدوران
    let modelRoot = null;
    BABYLON.SceneLoader.ImportMesh("", process.env.PUBLIC_URL + "/assets/models/", "yllo.glb", scene, (meshes) => {
      const allowed = ["L1", "L2", "L3_primitive0", "L3_primitive1", "L4", "L5", "__root__"];
      meshes.forEach(m => { if (!allowed.includes(m.name)) m.dispose(); });

      modelRoot = meshes.find(m => m.name === "__root__");
      if (modelRoot) {
        modelRoot.rotationQuaternion = null;
        // وضع السيروم في وضع مائل جمالياً
        modelRoot.rotation.z = BABYLON.Tools.ToRadians(12);
      }

      // تحسين الماتريال الذهبي والبلاستيك
      const gold = scene.getMeshByName("L5");
      if (gold && gold.material instanceof BABYLON.PBRMaterial) {
        gold.material.metallic = 0.9;
        gold.material.roughness = 0.2;
        gold.material.albedoColor = new BABYLON.Color3(0.5, 0.38, 0.05);
      }
    });

    // 4️⃣ منطق الـ GSAP Context (تنظيف تلقائي)
    const ctx = gsap.context(() => {
      const width = window.innerWidth;
      
      // تحديد إحداثيات الكاميرا بناءً على حجم الشاشة
      const getCamCoords = (w) => {
        if (w <= 425) return { radius: 10, x: 1.5, y: 3, z: 0.3 };
        if (w <= 870) return { radius: 9, x: 2, y: 2, z: 0.3 };
        if (w <= 1225) return { radius: 10, x: 1.17, y: 1.2, z: 2 };
        return { radius: 9, x: 1.17, y: 1.2, z: 3 };
      };

      const coords = getCamCoords(width);

      // تايم لاين الدخول (مرة واحدة فقط)
   // ✅ تعريف التايم لاين مرة واحدة فقط مع الإعدادات المطلوبة
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: renderFeelRef.current,
          start: "top 60%", // تم التعديل ليكون أكثر حساسية
          once: true,
          invalidateOnRefresh: true // ضروري جداً للحساب بعد الـ display block
        }
      });

      // أنيميشن الكاميرا والكانفس
      mainTl.fromTo(camera, 
        { alpha: camera.alpha - 2, radius: coords.radius + 5 },
        { alpha: camera.alpha, radius: coords.radius, duration: 2.5, ease: "power3.out" }, 0
      )
      .fromTo(camera.target, 
        { x: coords.x - 5, y: coords.y },
        { x: coords.x, y: coords.y, z: coords.z, duration: 2.5, ease: "power3.out" }, 0
      )
      .fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 1.5 }, 0.5);

      // أنيميشن البوكسات بالتتابع (Stagger)
      mainTl.fromTo(boxRefs.current,
        { opacity: 0, x: 100, y: 50 },
        { opacity: 1, x: 0, y: 0, stagger: 0.3, duration: 1, ease: "power4.out" }, "-=1.5"
      );

      // أنيميشن المحتويات الداخلية
      mainTl.fromTo([iconRefs.current, textRefs.current],
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, stagger: 0.1, duration: 0.8 }, "-=0.8"
      );

      // 5️⃣ منطق الـ Resize (داخل الـ context لسهولة التنظيف)
      const handleResize = () => {
        engine.resize();
        const newCoords = getCamCoords(window.innerWidth);
        gsap.to(camera, { radius: newCoords.radius, duration: 1 });
        gsap.to(camera.target, { x: newCoords.x, y: newCoords.y, z: newCoords.z, duration: 1 });
      };
      window.addEventListener("resize", handleResize);
    });

    // 6️⃣ الرندر لوب
    engine.runRenderLoop(() => {
      if (modelRoot) modelRoot.rotate(BABYLON.Axis.Y, 0.02, BABYLON.Space.LOCAL);
      scene.render();
    });
    

    // 7️⃣ التنظيف النهائي (The Cleanup)
    return () => {
      ctx.revert(); // يمسح كل GSAP و ScrollTrigger و Resize Listeners
      window.removeEventListener("resize", () => engine.resize());
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return (
    <div className="page-2">
      <div className="RENDER-FEEL" ref={renderFeelRef}>
        <div className="product-area">
          <canvas ref={canvasRef} className="f2-canvas"></canvas>
        </div>
        
        <div className="info-area">
          {[
            { icon: "fa-leaf", title: "Natural Glow", desc: "Enhances skin freshness and gives it a natural glow" },
            { icon: "fa-tint", title: "Deep Hydration", desc: "Deep hydration that lasts all day long" },
            { icon: "fa-magic", title: "Luxury Care", desc: "Premium care for a sophisticated look" }
          ].map((item, i) => (
            <div className="glass-box" key={i} ref={el => boxRefs.current[i] = el}>
              <i className={`fas ${item.icon} icon`} ref={el => iconRefs.current[i] = el}></i>
              <div className="text-content" ref={el => textRefs.current[i] = el}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}