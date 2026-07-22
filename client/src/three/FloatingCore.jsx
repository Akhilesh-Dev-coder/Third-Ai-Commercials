import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function FloatingCore({ className = "absolute inset-0 z-0 pointer-events-none w-full h-full" }) {
  const canvasRef = useRef(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId;
    let isVisible = true;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let renderer, scene, camera, masterGroup, barrelMesh, innerRing, thinRing, irisGroup, innerGlow, redCoreLight, particleSys;

    const isMobile = window.innerWidth < 768;
    const isIOS = typeof navigator !== 'undefined' && (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );

    const getWidth = () => canvas.clientWidth || window.innerWidth || 300;
    const getHeight = () => canvas.clientHeight || window.innerHeight || 300;

    let width = getWidth();
    let height = getHeight();

    // Prevent iOS canvas context lost crash
    const handleContextLost = (e) => {
      e.preventDefault();
      if (animId) cancelAnimationFrame(animId);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    const getViewportParams = (w, h) => {
      const aspect = w / h;
      if (aspect < 0.75) {
        // Mobile portrait viewport: optimal scale for background rotating core behind glass card
        return { z: 7.0, scale: 0.70, posY: 0.05 };
      } else if (aspect < 1.0) {
        // Tablet portrait viewport
        return { z: 6.8, scale: 0.80, posY: 0.05 };
      }
      // Desktop / Landscape
      return { z: 6.0, scale: 1.0, posY: 0 };
    };

    const initialParams = getViewportParams(width, height);

    try {
      // ─── Scene & Camera ───────────────────────────────────────
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = initialParams.z;

      // Safe WebGL initialization for iOS Safari & Mobile GPUs
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile && !isIOS,
        powerPreference: isMobile || isIOS ? 'default' : 'high-performance',
        failIfMajorPerformanceCaveat: false
      });

      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile || isIOS ? 1.0 : 1.5));

      if (!isIOS) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.4;
      }

      // ─── Lighting ─────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0x0a0507, 2.2));

      redCoreLight = new THREE.PointLight(0xFF2A3B, 16, 15);
      redCoreLight.position.set(0, 0, 0.5);
      scene.add(redCoreLight);

      const topRim = new THREE.SpotLight(0xFF2A3B, 18);
      topRim.position.set(0, 8, 8);
      topRim.angle = Math.PI / 4;
      topRim.penumbra = 0.85;
      scene.add(topRim);

      const bottomRim = new THREE.SpotLight(0xFF4060, 12);
      bottomRim.position.set(0, -8, 8);
      bottomRim.angle = Math.PI / 4;
      bottomRim.penumbra = 0.85;
      scene.add(bottomRim);

      const sideRim = new THREE.PointLight(0xFF2A3B, 6, 10);
      sideRim.position.set(-5, 2, 3);
      scene.add(sideRim);

      // ─── Master Group ─────────────────────────────────────────
      masterGroup = new THREE.Group();
      scene.add(masterGroup);

      masterGroup.scale.set(initialParams.scale, initialParams.scale, initialParams.scale);
      masterGroup.position.y = initialParams.posY;

      // ─── Outer Metallic Barrel Ring ───────────────────────────
      barrelMesh = new THREE.Mesh(
        new THREE.TorusGeometry(2.3, 0.09, 16, 48),
        new THREE.MeshStandardMaterial({ color: 0x181820, metalness: 0.92, roughness: 0.12 })
      );
      masterGroup.add(barrelMesh);

      // ─── Glowing White Accent Ring ────────────────────────────
      const accentRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.2, 0.025, 12, 48),
        new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
      );
      masterGroup.add(accentRing);

      // ─── Secondary Inner Ring ─────────────────────────────────
      innerRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.65, 0.035, 16, 40),
        new THREE.MeshStandardMaterial({ color: 0x22222c, metalness: 0.8, roughness: 0.3 })
      );
      masterGroup.add(innerRing);

      // ─── Tertiary Thin Ring ───────────────────────────────────
      thinRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.95, 0.015, 12, 40),
        new THREE.MeshBasicMaterial({ color: 0xFF2A3B, transparent: true, opacity: 0.7 })
      );
      masterGroup.add(thinRing);

      // ─── Aperture Iris Blades ─────────────────────────────────
      irisGroup = new THREE.Group();
      const numBlades = 8;
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, 0);
      bladeShape.lineTo(0.9, 0.55);
      bladeShape.lineTo(1.45, 0.15);
      bladeShape.lineTo(0.65, -0.65);
      bladeShape.closePath();

      const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
        depth: 0.03, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.01, bevelThickness: 0.01
      });
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0c0c12, metalness: 0.88, roughness: 0.18 });
      const bladeEdgeMat = new THREE.LineBasicMaterial({ color: 0xFF2A3B, transparent: true, opacity: 0.85 });
      const edgesGeo = new THREE.EdgesGeometry(bladeGeo);

      for (let i = 0; i < numBlades; i++) {
        const angle = (i / numBlades) * Math.PI * 2;
        const bContainer = new THREE.Group();
        bContainer.position.set(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, i * 0.005);
        bContainer.rotation.z = angle + 0.35;
        bContainer.add(new THREE.Mesh(bladeGeo, bladeMat));
        bContainer.add(new THREE.LineSegments(edgesGeo, bladeEdgeMat));
        irisGroup.add(bContainer);
      }
      masterGroup.add(irisGroup);

      // ─── Glass Lens Sphere (Optimized Standard Material for Mobile/iOS) ──
      const DomeMaterialClass = (isMobile || isIOS) ? THREE.MeshStandardMaterial : THREE.MeshPhysicalMaterial;
      const glassDome = new THREE.Mesh(
        new THREE.SphereGeometry(1.6, 24, 24),
        new DomeMaterialClass({
          color: 0xFF2A3B,
          transparent: true,
          opacity: 0.35,
          roughness: 0.06,
          metalness: 0.1,
          ...((!isMobile && !isIOS) ? { clearcoat: 1.0, clearcoatRoughness: 0.1 } : {})
        })
      );
      masterGroup.add(glassDome);

      // ─── Inner Glow Core ─────────────────────────────────────
      innerGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.58, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0xFF2A3B, transparent: true, opacity: 0.65 })
      );
      masterGroup.add(innerGlow);

      // ─── Anamorphic Lens Flare Sprite ────────────────────────
      try {
        const flareCanvas = document.createElement('canvas');
        flareCanvas.width = 128; flareCanvas.height = 64;
        const fctx = flareCanvas.getContext('2d');
        if (fctx) {
          const flareGrad = fctx.createRadialGradient(64, 32, 0, 64, 32, 32);
          flareGrad.addColorStop(0, 'rgba(255, 42, 59, 0.95)');
          flareGrad.addColorStop(0.35, 'rgba(255, 42, 59, 0.28)');
          flareGrad.addColorStop(1, 'rgba(255, 42, 59, 0)');
          fctx.fillStyle = flareGrad;
          fctx.fillRect(0, 0, 128, 64);

          const flareSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(flareCanvas), transparent: true, depthWrite: false })
          );
          flareSprite.scale.set(isMobile ? 8 : 11, isMobile ? 4 : 5.5, 1);
          scene.add(flareSprite);
        }
      } catch (err) {
        console.warn('Flare canvas creation skipped on mobile:', err);
      }

      // ─── Particle Swarm ───────────────────────────────────────
      const pCount = isMobile || isIOS ? 120 : 350;
      const positions = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        const r = 2.2 + Math.random() * 2.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleSys = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({ color: 0xFFFFFF, size: isMobile ? 0.024 : 0.02, transparent: true, opacity: 0.65 })
      );
      scene.add(particleSys);

    } catch (err) {
      console.warn('WebGL Initialization failed safely on this device:', err);
      setWebglFailed(true);
      return;
    }

    // ─── IntersectionObserver to pause rendering off-screen ─
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animId) {
            animate();
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // ─── Mouse / Touch Input ──────────────────────────────────
    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        targetMouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };

    const handleResize = () => {
      if (!renderer || !camera) return;
      width = getWidth();
      height = getHeight();
      const params = getViewportParams(width, height);
      camera.aspect = width / height;
      camera.position.z = params.z;
      if (masterGroup) {
        masterGroup.scale.setScalar(params.scale);
        masterGroup.position.y = params.posY;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // ─── Animation Loop ───────────────────────────────────────
    const animate = () => {
      if (!isVisible || !renderer) {
        animId = null;
        return;
      }

      animId = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;

      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      if (masterGroup) {
        masterGroup.rotation.y = currentMouseX * 0.35 + Math.sin(t * 0.5) * 0.05;
        masterGroup.rotation.x = -currentMouseY * 0.35 + Math.cos(t * 0.5) * 0.05;
      }

      if (barrelMesh) barrelMesh.rotation.z += 0.0012;
      if (innerRing) innerRing.rotation.z -= 0.0022;
      if (thinRing) thinRing.rotation.z += 0.0035;
      if (irisGroup) {
        irisGroup.rotation.z += 0.0018;
        const irisPulse = Math.sin(t * 0.9) * 0.07 + 1;
        irisGroup.scale.set(irisPulse, irisPulse, 1);
      }

      if (innerGlow) {
        const glowPulse = Math.sin(t * 1.4) * 0.12 + 0.95;
        innerGlow.scale.setScalar(glowPulse);
        if (innerGlow.material) innerGlow.material.opacity = 0.5 + Math.sin(t * 1.8) * 0.15;
      }

      if (redCoreLight) redCoreLight.intensity = 15 + Math.sin(t * 2.1) * 3;
      if (particleSys) particleSys.rotation.y -= 0.0008;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      observer.disconnect();
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
    };
  }, []);

  if (webglFailed) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#ff2751] to-[#e722ff] opacity-40 blur-xl animate-pulse" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      id="sphere-canvas"
      className={className}
    />
  );
}
