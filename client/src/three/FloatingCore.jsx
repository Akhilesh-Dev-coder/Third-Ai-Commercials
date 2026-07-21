import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FloatingCore({ className = "absolute inset-0 z-0 pointer-events-none w-full h-full" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId;
    let isVisible = true;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const getWidth = () => canvas.clientWidth || window.innerWidth;
    const getHeight = () => canvas.clientHeight || window.innerHeight;

    let width = getWidth();
    let height = getHeight();
    const isMobile = window.innerWidth < 768;

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

    // ─── Scene & Camera ───────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = isMobile ? 6.2 : 6.0;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile, // Disable MSAA antialiasing on mobile GPU
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    // ─── Lighting ─────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a0507, 2.2));

    const redCoreLight = new THREE.PointLight(0xFF2A3B, 16, 15);
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
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    const modelScale = isMobile ? 0.72 : 1.0;
    masterGroup.scale.set(modelScale, modelScale, modelScale);

    // ─── Outer Metallic Barrel Ring ───────────────────────────
    const barrelMesh = new THREE.Mesh(
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
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.035, 16, 40),
      new THREE.MeshStandardMaterial({ color: 0x22222c, metalness: 0.8, roughness: 0.3 })
    );
    masterGroup.add(innerRing);

    // ─── Tertiary Thin Ring ───────────────────────────────────
    const thinRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.95, 0.015, 12, 40),
      new THREE.MeshBasicMaterial({ color: 0xFF2A3B, transparent: true, opacity: 0.7 })
    );
    masterGroup.add(thinRing);

    // ─── Aperture Iris Blades ─────────────────────────────────
    const irisGroup = new THREE.Group();
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

    // ─── Glass Lens Sphere ────────────────────────────────────
    const glassDome = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 32, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0xFF2A3B,
        transparent: true,
        opacity: 0.35,
        roughness: 0.06,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      })
    );
    masterGroup.add(glassDome);

    // ─── Inner Glow Core ─────────────────────────────────────
    const innerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.58, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xFF2A3B, transparent: true, opacity: 0.65 })
    );
    masterGroup.add(innerGlow);

    // ─── Anamorphic Lens Flare Sprite ────────────────────────
    const flareCanvas = document.createElement('canvas');
    flareCanvas.width = 256; flareCanvas.height = 128;
    const fctx = flareCanvas.getContext('2d');
    const flareGrad = fctx.createRadialGradient(128, 64, 0, 128, 64, 64);
    flareGrad.addColorStop(0, 'rgba(255, 42, 59, 0.95)');
    flareGrad.addColorStop(0.35, 'rgba(255, 42, 59, 0.28)');
    flareGrad.addColorStop(1, 'rgba(255, 42, 59, 0)');
    fctx.fillStyle = flareGrad;
    fctx.fillRect(0, 0, 256, 128);

    const flareSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(flareCanvas), transparent: true, depthWrite: false })
    );
    flareSprite.scale.set(isMobile ? 8 : 11, isMobile ? 4 : 5.5, 1);
    scene.add(flareSprite);

    // ─── Particle Swarm ───────────────────────────────────────
    const pCount = isMobile ? 180 : 350;
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 2.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleSys = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0xFFFFFF, size: isMobile ? 0.024 : 0.02, transparent: true, opacity: 0.65 })
    );
    scene.add(particleSys);

    // ─── Mouse / Touch Input ──────────────────────────────────
    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        targetMouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };

    const handleResize = () => {
      width = getWidth();
      height = getHeight();
      const mob = window.innerWidth < 768;
      camera.aspect = width / height;
      camera.position.z = mob ? 6.2 : 6.0;
      masterGroup.scale.setScalar(mob ? 0.72 : 1.0);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // ─── Animation Loop ───────────────────────────────────────
    const animate = () => {
      if (!isVisible) {
        animId = null;
        return;
      }

      animId = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;

      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      masterGroup.rotation.y = currentMouseX * 0.35 + Math.sin(t * 0.5) * 0.05;
      masterGroup.rotation.x = -currentMouseY * 0.35 + Math.cos(t * 0.5) * 0.05;

      barrelMesh.rotation.z += 0.0012;
      innerRing.rotation.z  -= 0.0022;
      thinRing.rotation.z   += 0.0035;
      irisGroup.rotation.z  += 0.0018;

      const irisPulse = Math.sin(t * 0.9) * 0.07 + 1;
      irisGroup.scale.set(irisPulse, irisPulse, 1);

      const glowPulse = Math.sin(t * 1.4) * 0.12 + 0.95;
      innerGlow.scale.setScalar(glowPulse);
      innerGlow.material.opacity = 0.5 + Math.sin(t * 1.8) * 0.15;

      redCoreLight.intensity = 15 + Math.sin(t * 2.1) * 3;

      particleSys.rotation.y -= 0.0008;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="sphere-canvas"
      className={className}
    />
  );
}

