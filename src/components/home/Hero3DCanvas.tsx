"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Sparkles } from "lucide-react";

export function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let destroyed = false;
    let animId: number;

    const getDims = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(Math.floor(rect.width || 540), 280);
      const h = Math.max(Math.floor(rect.height || 580), 360);
      return { w, h };
    };

    const { w, h } = getDims();

    // 1. Safely query WebGL context
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }

    if (!gl) {
      // Graceful 2D luxury illustration fallback
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2;
        const cy = h / 2;

        // Soft radial aura
        const rad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 160);
        rad.addColorStop(0, "rgba(216, 174, 152, 0.4)");
        rad.addColorStop(0.6, "rgba(64,76,52, 0.15)");
        rad.addColorStop(1, "rgba(247, 244, 238, 0)");
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(cx, cy, 180, 0, Math.PI * 2);
        ctx.fill();

        // Elegant geometric rings
        ctx.strokeStyle = "rgba(64,76,52, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 120, 48, -0.25, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(216, 174, 152, 0.4)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, 145, 58, 0.35, 0, Math.PI * 2);
        ctx.stroke();

        setIsLoaded(true);
      }
      return;
    }

    // 2. Transparent WebGL Renderer - 100% Seamless with Hero Background
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0); // Pure transparency
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
    } catch {
      return;
    }

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0, 0.1, 7.8);

    // Root Group for interactive mouse / touch parallax
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Tooth Centered Group (Contains molar-tooth.glb)
    const toothGroup = new THREE.Group();
    rootGroup.add(toothGroup);

    // Environment Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xFFFBF5, 2.0);
    scene.add(ambientLight);

    // Key Light (Warm ivory sunlight)
    const keyLight = new THREE.DirectionalLight(0xFFF5E6, 2.5);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    // Fill Light (Soft sky reflection)
    const fillLight = new THREE.DirectionalLight(0xE8F0FE, 1.5);
    fillLight.position.set(-5, 3, 3);
    scene.add(fillLight);

    // Back Rim Light (Warm rose gold luster for tooth silhouette)
    const rimLight = new THREE.DirectionalLight(0xD8AE98, 2.4);
    rimLight.position.set(0, -3, -6);
    scene.add(rimLight);

    // Top Light for Occlusal Cusps
    const topLight = new THREE.PointLight(0xFFFFFF, 1.4, 10);
    topLight.position.set(0, 4, 2);
    scene.add(topLight);

    // =========================================================
    // 4. Luxurious 3D Orbit Rings
    // =========================================================
    const ringGroup = new THREE.Group();
    rootGroup.add(ringGroup);

    // Ring 1: Metallic Rose Gold
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.024, 20, 128);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xD8AE98,
      metalness: 0.88,
      roughness: 0.22,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3.8;
    ring1Mesh.rotation.y = Math.PI / 5;
    ringGroup.add(ring1Mesh);

    // Ring 2: Metallic Khaki / Olive Gold
    const ring2Geo = new THREE.TorusGeometry(2.72, 0.020, 20, 128);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xA09B7C,
      metalness: 0.84,
      roughness: 0.28,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = -Math.PI / 3.2;
    ring2Mesh.rotation.z = Math.PI / 4.2;
    ringGroup.add(ring2Mesh);

    // Satellite Sphere on Ring 1
    const satGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xD8AE98,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0xD8AE98,
      emissiveIntensity: 0.35,
    });
    const satMesh = new THREE.Mesh(satGeo, satMat);
    ring1Mesh.add(satMesh);
    satMesh.position.set(2.35, 0, 0);

    // Satellite Sphere on Ring 2
    const sat2Geo = new THREE.SphereGeometry(0.055, 16, 16);
    const sat2Mat = new THREE.MeshStandardMaterial({
      color: 0xA09B7C,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0xA09B7C,
      emissiveIntensity: 0.3,
    });
    const sat2Mesh = new THREE.Mesh(sat2Geo, sat2Mat);
    ring2Mesh.add(sat2Mesh);
    sat2Mesh.position.set(2.72, 0, 0);

    // =========================================================
    // 5. Floating Ambient Luminous Particles
    // =========================================================
    const particleCount = 36;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSeeds: { radius: number; speed: number; angle: number; y: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.6 + Math.random() * 1.8;
      const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5;
      const py = (Math.random() - 0.5) * 3.4;
      const speed = (0.2 + Math.random() * 0.35) * (Math.random() > 0.5 ? 1 : -1);

      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      particleSeeds.push({ radius, speed, angle, y: py });
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xD8AE98,
      size: 0.07,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // Soft Ambient Floor Shadow Disc
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      grad.addColorStop(0, "rgba(48, 42, 33, 0.16)");
      grad.addColorStop(0.4, "rgba(64,76,52, 0.08)");
      grad.addColorStop(1, "rgba(247, 244, 238, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.1;
    rootGroup.add(shadowMesh);

    // =========================================================
    // 6. Load Molar Tooth (molar-tooth.glb) at Center
    // =========================================================
    const loader = new GLTFLoader();
    loader.load(
      "/models/molar-tooth.glb",
      (gltf) => {
        if (destroyed) return;

        const tooth = gltf.scene;

        // Auto-fit & Auto-center directly within the orbit rings
        const box = new THREE.Box3().setFromObject(tooth);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = 3.35; // Harmonious size inside orbit rings
        const scale = targetSize / maxDim;
        tooth.scale.setScalar(scale);

        tooth.position.x = -center.x * scale;
        tooth.position.y = -center.y * scale;
        tooth.position.z = -center.z * scale;

        // Optimize materials for dental porcelain enamel sheen
        tooth.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => {
                  m.needsUpdate = true;
                });
              } else {
                mesh.material.needsUpdate = true;
              }
            }
          }
        });

        toothGroup.add(tooth);
        toothGroup.rotation.x = 0.12;
        toothGroup.rotation.y = -0.28;

        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.error("Error loading molar-tooth.glb:", err);
      }
    );

    // =========================================================
    // 7. Natural Interactive Drag & Mouse Parallax
    // =========================================================
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
      dragVelocityX = 0;
      dragVelocityY = 0;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      // Parallax on gentle hover
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouseParallaxX = ((clientX - rect.left) / rect.width - 0.5) * 0.45;
        mouseParallaxY = ((clientY - rect.top) / rect.height - 0.5) * 0.35;
      }

      if (!isDragging) return;

      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      dragVelocityX = deltaX * 0.007;
      dragVelocityY = deltaY * 0.007;

      toothGroup.rotation.y += dragVelocityX;
      toothGroup.rotation.x += dragVelocityY;
      ringGroup.rotation.y += dragVelocityX * 0.6;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onPointerDown, { passive: true });
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("mouseup", onPointerUp, { passive: true });

    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp, { passive: true });

    // 8. Resize Observer
    const handleResize = () => {
      if (destroyed || !renderer) return;
      const { w: nw, h: nh } = getDims();
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 9. Animation Loop with performance.now()
    const startTime = performance.now();

    const animate = () => {
      if (destroyed) return;
      animId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) / 1000;

      // Inertial damping after user releases drag
      if (!isDragging) {
        dragVelocityX *= 0.94;
        dragVelocityY *= 0.94;
        toothGroup.rotation.y += dragVelocityX + 0.007; // Gentle auto-rotate
        toothGroup.rotation.x += dragVelocityY;
      }

      // Smooth floating oscillation (Breathing effect)
      toothGroup.position.y = Math.sin(elapsedTime * 1.3) * 0.1;

      // Orbital Rings Rotation
      ring1Mesh.rotation.z = elapsedTime * 0.22;
      ring2Mesh.rotation.y = -elapsedTime * 0.18;

      // Animate Particles
      const pArr = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const seed = particleSeeds[i];
        const curAngle = seed.angle + elapsedTime * seed.speed;
        pArr[i * 3] = Math.cos(curAngle) * seed.radius;
        pArr[i * 3 + 1] = seed.y + Math.sin(elapsedTime * 1.5 + i) * 0.12;
        pArr[i * 3 + 2] = Math.sin(curAngle) * seed.radius;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Smooth Mouse Parallax Lerp
      rootGroup.rotation.y += (mouseParallaxX - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (-mouseParallaxY - rootGroup.rotation.x) * 0.05;

      renderer?.render(scene, camera);
    };

    animate();

    // 10. Cleanup
    return () => {
      destroyed = true;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();

      canvas.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);

      canvas.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);

      // Clean Three.js geometries & materials
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      satGeo.dispose();
      satMat.dispose();
      sat2Geo.dispose();
      sat2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();

      toothGroup.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });

      renderer?.dispose();
      renderer?.forceContextLoss();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] flex items-center justify-center select-none bg-transparent overflow-visible"
    >
      {/* 
        Seamless Radial Ambient Glow - Fades 100% invisibly into the #F7F4EE hero background.
        Zero borders, zero cards, zero container boxes.
      */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-full blur-[130px] opacity-35"
        style={{
          background: "radial-gradient(circle at center, #D8AE98 0%, #404c34 40%, transparent 70%)"
        }}
      />

      {/* 100% Transparent Canvas directly in the hero flow */}
      <canvas
        ref={canvasRef}
        className="relative w-full h-full max-w-[580px] max-h-[580px] cursor-grab active:cursor-grabbing z-10 block bg-transparent"
        aria-label="مدل سه‌بعدی تعاملی دندان آسیاب"
      />

      {/* Subtle Unboxed Interaction Hint - Floating seamlessly without border box */}
      <div className={`absolute bottom-2 sm:bottom-4 z-20 pointer-events-none transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-2 text-xs font-medium text-[#817C70]/90">
          <Sparkles className="w-3.5 h-3.5 text-[#404c34] animate-pulse" />
          <span>مدل سه‌بعدی دندان آسیاب · با ماوس یا لمس بچرخانید</span>
        </div>
      </div>
    </div>
  );
}
