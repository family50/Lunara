import { useEffect, useRef } from "react";
import "./Products.css";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
export default function Products({ setPagge }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
const handleShopNow = () => {
    navigate("/products", { state: { pagge: "main", sectionKey: "luxury-serum" } });
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    engineRef.current = engine;
    sceneRef.current = scene;

    // 🌍 HDR
    const hdrTexture = new BABYLON.HDRCubeTexture(
      process.env.PUBLIC_URL + "/assets/background/sunny_rose_garden_2k.hdr",
      scene,
      256
    );
    scene.environmentTexture = hdrTexture;

    // 📷 كاميرا (مفتوحة التحكم)
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 1.483,
      Math.PI / 2.586,
      15.005,
      new BABYLON.Vector3( 0.8661148015616418, 3.465866255234289, -1.0501018355337137),
      scene
    );
    camera.attachControl(canvas, true);
    // 🐢 إبطاء الزووم (العجلة)
camera.wheelDeltaPercentage = 0.005;   // كان 0.01 → أبطأ
camera.wheelPrecision = 150;           // كل ما الرقم أكبر = الزووم أبطأ

// 🐢 إبطاء الدوران بالموس
camera.angularSensibilityX = 3000;     // أفقي
camera.angularSensibilityY = 3000;     // رأسي

// 🐢 إبطاء التحريك (لو بتستخدم pan)
camera.panningSensibility = 1500;

    // 🖱️ اطبع أي حركة في الكونسول
 let lastAlpha = camera.alpha;
let lastBeta = camera.beta;
let lastRadius = camera.radius;
let lastTarget = camera.target.clone();

scene.onBeforeRenderObservable.add(() => {
  const changed =
    camera.alpha !== lastAlpha ||
    camera.beta !== lastBeta ||
    camera.radius !== lastRadius ||
    !camera.target.equals(lastTarget);

});


camera.detachControl();

gsap.fromTo(
  camera,
  {
    alpha: Math.PI / 2,
    beta: Math.PI / -1.2,
    radius: 30,

  },
  {
    alpha: Math.PI / 1.483,
    beta: Math.PI / 2.586,
    radius: 15.005,
    duration: 7,
    ease: "power2.out",
     onComplete: () => camera.attachControl(canvas, true)
  }
  
);

    // 💡 الإضاءات
    const hemiLight = new BABYLON.HemisphericLight(
      "hemi",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    hemiLight.intensity = 0.6;

    const keyLight = new BABYLON.DirectionalLight(
      "keyLight",
      new BABYLON.Vector3(-0.5, -1, -0.5),
      scene
    );
    keyLight.position = new BABYLON.Vector3(3, 6, 3);
    keyLight.intensity = 1.2;

    const rimLight = new BABYLON.DirectionalLight(
      "rimLight",
      new BABYLON.Vector3(1, -0.5, 1),
      scene
    );
    rimLight.position = new BABYLON.Vector3(-4, 3, -4);
    rimLight.intensity = 0.6;

    const fillLight = new BABYLON.PointLight(
      "fillLight",
      new BABYLON.Vector3(0, 2, 2),
      scene
    );
    fillLight.intensity = 0.5;

    const serumSpotLight = new BABYLON.SpotLight(
      "serumSpot",
      new BABYLON.Vector3(0, 3, 2.5),
      new BABYLON.Vector3(0, -1, -1),
      Math.PI / 4,
      2,
      scene
    );
    serumSpotLight.intensity = 2.5;

    // 📦 تحميل الموديل
    BABYLON.SceneLoader.ImportMesh(
      "",
      process.env.PUBLIC_URL + "/assets/models/",
      "yllo.glb",
      scene,
      (meshes) => {
        // لون الورق GS1
        const gs1Meshes = meshes.filter(m => m.name.startsWith("GS1"));
        gs1Meshes.forEach(m => {
          if (m.material) {
            m.material.albedoColor = new BABYLON.Color3(107/255, 142/255, 35/255);
          }
        });

        // الغطا L5
        const thanMesh = scene.getMeshByName("L5");
        if (thanMesh && thanMesh.material instanceof BABYLON.PBRMaterial) {
          const mat = thanMesh.material;
          mat.albedoColor = new BABYLON.Color3(0.5, 0.38, 0.05);
          mat.metallic = 0.9;
          mat.roughness = 0.2;
        }

        // البلاستيك L3
        const mesh = scene.getMeshByName("L3_primitive0");
        if (mesh) {
          const plasticMat = new BABYLON.PBRMaterial("plasticMat", scene);
          plasticMat.alpha = 0.95;
          plasticMat.roughness = 0.3;
          plasticMat.metallic = 0;

          if (mesh.material?.albedoTexture) {
            plasticMat.albedoTexture = mesh.material.albedoTexture;
          }

          mesh.material = plasticMat;
        }
      }
    );

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => engine.resize());

    return () => {
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return (
    <div className="Products-page">
      <div className="Products-box">
        <div className="box-content">
          <canvas ref={canvasRef} className="ubtan-canvas22" />
        </div>
        <button className="explore-btn" onClick={handleShopNow}>Explore</button>
      </div>
    </div>
  );
}