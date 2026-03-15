import React, { useEffect, useRef } from "react"; // استيراد مكتبة ريأكت والهوكس الأساسية
import "./facewash.css"; // استيراد ملف التنسيقات الخاص بالصفحة
import gsap from "gsap"; // استيراد مكتبة GSAP للتحريك
import { ScrollTrigger } from "gsap/ScrollTrigger"; // استيراد إضافة التفاعل مع التمرير
import * as BABYLON from "@babylonjs/core"; // استيراد محرك BabylonJS الأساسي
import "@babylonjs/loaders"; // استيراد محملات الموديلات (GLB/GLTF)

gsap.registerPlugin(ScrollTrigger); // تفعيل إضافة ScrollTrigger داخل GSAP

export default function Facewash() { 
  const textRef = useRef(null); // مرجع لعنصر حاوية النصوص للتحريك
  const canvasRef = useRef(null); // مرجع لعنصر الكانفاس لعرض المشهد ثلاثي الأبعاد
  const engineRef = useRef(null); // مرجع لتخزين محرك Babylon للوصول إليه لاحقاً
  const sceneRef = useRef(null);  // مرجع لتخزين المشهد (Scene) لإدارته وتنظيفه

  // --- تأثير تحريك النصوص عند ظهورها ---
useEffect(() => {
  if (!textRef.current) return;

  const lines = textRef.current.querySelectorAll(".line");
  
  // 1. نشيك هل الأنيميشن ده اتعرض قبل كده؟
  const isFinished = localStorage.getItem("facewash_anim_done");

  if (isFinished) {
    // 2. لو اتعرض قبل كده، اظهر النص فوراً في مكانه النهائي
    gsap.set(lines, { y: 0, opacity: 1 });
  } else {
    // 3. لو أول مرة، شغل الأنيميشن الطبيعي
    gsap.fromTo(
      lines,
      { y: -60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5,
        stagger: 0.3,
        onComplete: () => {
          // 4. لما يخلص تماماً، سجل في ذاكرة المتصفح إنه خلص
          localStorage.setItem("facewash_anim_done", "true");
        },
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }
}, []);

  // --- إعداد وتشغيل مشهد BabylonJS ---
  useEffect(() => {
    // تنظيف المشهد والمحرك القديم من الذاكرة لمنع تسريب الذاكرة (Memory Leak)
    if (sceneRef.current) {
      sceneRef.current.dispose();
      sceneRef.current = null;
    }
    if (engineRef.current) {
      engineRef.current.dispose();
      engineRef.current = null;
    }

    const canvas = canvasRef.current; // الحصول على عنصر الكانفاس من المرجع

    // إنشاء محرك BabylonJS مع إعدادات جودة الرسم
    const engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });

    const scene = new BABYLON.Scene(engine); // إنشاء مشهد جديد
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // جعل خلفية المشهد شفافة

    // تحميل صورة البيئة (HDR) للإضاءة الواقعية وانعكاسات المعادن
    const hdrTexture = new BABYLON.HDRCubeTexture(
      process.env.PUBLIC_URL + "/assets/background/sunny_rose_garden_2k.hdr",
      scene,
      256,
      false,
      true,
      false,
      true
    );

    scene.environmentTexture = hdrTexture; // تطبيق خريطة البيئة على المشهد
    engineRef.current = engine; // تخزين المحرك في المرجع
    sceneRef.current = scene; // تخزين المشهد في المرجع

    // --- إعداد الكاميرا ---
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 1.514, // زاوية الدوران الأفقية (Alpha)
      Math.PI / 3.2,   // زاوية الدوران الرأسية (Beta)
      14.602,          // المسافة عن الهدف (Radius)
      BABYLON.Vector3.Zero(), // نقطة الهدف (مركز المشهد)
      scene
    );

    camera.attachControl(canvas, true); // السماح للمستخدم بالتحكم جزئياً بالكاميرا
    camera.wheelDeltaPercentage = 0.01; // ضبط سرعة الزووم بالماوس
    camera.target = new BABYLON.Vector3(0.38, 1.8, -0.9); // تحديد نقطة تركيز الكاميرا بدقة

    // تعديل إحداثيات الكاميرا حسب مقاس الشاشة (Responsiveness)
    if (window.innerWidth < 478) {
      camera.target = new BABYLON.Vector3(0.38, 0.8, -0.9); // خفض الهدف للهواتف
    } else if (window.innerWidth < 1201) {
      camera.radius = 17; // زيادة المسافة للأجهزة اللوحية
    }

    // تعطيل تفاعل المستخدم أثناء الأنيميشن الافتتاحي
    disableUserInteraction(camera, canvas);

    // --- أنيميشن دخول الكاميرا والكانفاس باستخدام GSAP ---
    if (window.innerWidth > 1201) {
      gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power3.out" }); // ظهور تدريجي للكانفاس

      gsap.fromTo(
        camera,
        { alpha: Math.PI / -3.111, beta: Math.PI / 2.59, radius: 44.34 }, // من بعيد وبزاوية مختلفة
        {
          alpha: Math.PI / 1.514,
          beta: Math.PI / 3.2,
          radius: 14.602,
          duration: 7, // مدة حركة الكاميرا 7 ثوانٍ
          ease: "power2.out",
          onComplete: () => lockUserCamera(camera, canvas) // قفل الكاميرا بعد الانتهاء
        }
      );
    } else {
      gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power3.out" });

      gsap.fromTo(
        camera,
        { alpha: Math.PI / -3.111, beta: Math.PI / 2.59, radius: 44.34 },
        {
          alpha: Math.PI / 1.514,
          beta: Math.PI / 3.2,
          radius: 17,
          duration: 7,
          ease: "power2.out",
          onComplete: () => lockUserCamera(camera, canvas)
        }
      );
    }

    // --- وظيفة تعطيل التحكم أثناء الأنيميشن ---
    function disableUserInteraction(camera, canvas) {
      camera.detachControl(); // فصل الكاميرا عن الكانفاس
     
      canvas.style.touchAction = "none"; // منع حركات اللمس على الكانفاس
    }

    // --- وظيفة قفل حدود الكاميرا بعد الأنيميشن ---
    function lockUserCamera(camera, canvas) {
      camera.lowerRadiusLimit = camera.radius; // تثبيت الزووم (منع التصغير)
      camera.upperRadiusLimit = camera.radius; // تثبيت الزووم (منع التكبير)
      camera.beta = Math.PI / 3; // ضبط زاوية الميل الرأسي
      camera.upperBetaLimit = Math.PI / 2; // منع الكاميرا من النزول تحت الأرض
      camera.lowerBetaLimit = camera.beta; // منع الكاميرا من الصعود للأعلى
      camera.keysUp = []; camera.keysDown = []; camera.keysLeft = []; camera.keysRight = []; // تعطيل أزرار الكيبورد

      const pointersInput = camera.inputs.attached["pointers"];
      if (pointersInput) {
        const original = pointersInput.onPointerDown;
        pointersInput.onPointerDown = function (evt) {
          if (evt.pointerType === "touch") { evt.preventDefault(); return; } // منع سحب التاتش
          original.call(this, evt);
        };
      }
      canvas.style.touchAction = "none"; // تأكيد منع حركات التاتش
      document.body.style.overflow = ""; // إعادة تفعيل سكرول الصفحة للمستخدم
    }

    // تشغيل حلقة الرندر (Render Loop) لتحديث المشهد بستين إطار في الثانية
    engine.runRenderLoop(() => { scene.render(); });

    // إعادة ضبط حجم المحرك عند تغيير حجم نافذة المتصفح
    window.addEventListener("resize", () => { engine.resize(); });

    // --- إعدادات الإضاءة ---
    const hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene); // إضاءة من السماء
    hemiLight.intensity = 0.6;
    hemiLight.diffuse = new BABYLON.Color3(0, 0, 0); 
    hemiLight.groundColor = new BABYLON.Color3(0.95, 0.9, 0.85); // لون الانعكاس من الأرض

    const keyLight = new BABYLON.DirectionalLight("keyLight", new BABYLON.Vector3(-0.5, -1, -0.5), scene); // الضوء الأساسي الجانبي
    keyLight.position = new BABYLON.Vector3(3, 6, 3);
    keyLight.intensity = 1.2;
    keyLight.diffuse = new BABYLON.Color3(0.95, 0.75, 0.35); // لون ذهبي دافئ

    const rimLight = new BABYLON.DirectionalLight("rimLight", new BABYLON.Vector3(1, -0.5, 1), scene); // ضوء لإبراز الحواف
    rimLight.position = new BABYLON.Vector3(-4, 3, -4);
    rimLight.intensity = 0.6;

    const fillLight = new BABYLON.PointLight("fillLight", new BABYLON.Vector3(0, 2, 2), scene); // ضوء أمامي لتوضيح التفاصيل
    fillLight.intensity = 0.5;

    const serumSpotLight = new BABYLON.SpotLight("serumSpot", new BABYLON.Vector3(0, 3, 2.5), new BABYLON.Vector3(0, -1, -1), Math.PI / 4, 2, scene); // ضوء مركز (كشاف)
    serumSpotLight.intensity = 2.5;

    // --- تحميل موديل المنتج وتعديل الخامات ---
    BABYLON.SceneLoader.ImportMesh("", process.env.PUBLIC_URL + "/assets/models/", "yllo.glb", scene, (meshes) => {
      
      // تلوين الأوراق (الميشات التي تبدأ بـ GS1)
      const gs1Meshes = meshes.filter(m => m.name.startsWith("GS1"));
      gs1Meshes.forEach(m => {
        if (m.material) m.material.albedoColor = new BABYLON.Color3(107/255, 142/255, 35/255);
      });

      // تعديل خامة غطاء العبوة (L5) لتصبح ذهبية معدنية
      const thanMesh = scene.getMeshByName("L5");
      if (thanMesh && thanMesh.material instanceof BABYLON.PBRMaterial) {
        const mat = thanMesh.material;
        mat.albedoColor = new BABYLON.Color3(0.5, 0.38, 0.05);
        mat.metallic = 0.9; // جعل السطح معدني
        mat.roughness = 0.2; // جعل السطح ناعم ولامع
        mat.environmentIntensity = 1.2;
      }

      // إظهار الموديل تدريجياً باستخدام GSAP
      scene.meshes.forEach(mesh => {
        gsap.fromTo(mesh, { visibility: 0 }, { visibility: 1 });
      });

      // تعديل خامة الزجاج/البلاستيك (L3_primitive0) لتصبح شفافة
      const mesh = scene.getMeshByName("L3_primitive0");
      if (mesh) {
        const plasticMat = new BABYLON.PBRMaterial("plasticMat", scene);
        plasticMat.alpha = 0.95; // درجة الشفافية
        if (mesh.material) {
          if (mesh.material.albedoTexture) plasticMat.albedoTexture = mesh.material.albedoTexture;
          else plasticMat.albedoColor = mesh.material.albedoColor.clone();
        }
        plasticMat.roughness = 0.3; // لمعة السطح
        plasticMat.metallic = 0; // مادة غير معدنية
        mesh.material = plasticMat;
      }
    });
   window.addEventListener("resize", () => engine.resize());
    // تنظيف الموارد عند مغادرة الصفحة أو إغلاق المكون
    return () => {
      scene.dispose();
      engine.dispose();
    };
  }, []);
  





  return (
    <div className="page-container">
      <div className="RENDERFEEL-page">
        {/* قسم النصوص */}
      <div className="RENDERFEEL-wrapper"> 
        <div className="RENDERFEEL-text"ref={textRef} >
          <h1 className="title-line line">RENDER FEEL Serum</h1>
          <p className="subtitle-line line">Natural Glow. Pure Comfort.</p>
          <p className="tagline-line line">Feel the Glow. Live the Luxury.</p>
        </div>
        </div>
        {/* الكانفاس الذي سيتم رسم الـ 3D داخله */}
        <canvas ref={canvasRef} id="MainProductCanvas" className="ubtan-canvas"></canvas>
      </div>
    </div>
  );
}