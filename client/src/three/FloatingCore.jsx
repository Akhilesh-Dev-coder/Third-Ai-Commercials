import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FloatingCore() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const isMobile = window.innerWidth < 768;

    // ─── Scene & Camera ───────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

    // On mobile: pull camera WAY back so the whole model fits in portrait
    camera.position.z = isMobile ? 9.5 : 6.5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // ─── Lighting ─────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a0507, 2));

    const redCoreLight = new THREE.PointLight(0xFF2A3B, 14, 14);
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

    // On mobile: shrink model significantly so whole ring fits in portrait width
    const modelScale = isMobile ? 0.42 : 1;
    masterGroup.scale.set(modelScale, modelScale, modelScale);

    // Center model vertically on mobile — slight upward nudge to sit mid-screen
    masterGroup.position.y = isMobile ? 0.1 : 0;

    // ─── Outer Metallic Barrel Ring ───────────────────────────
    const barrelMesh = new THREE.Mesh(
      new THREE.TorusGeometry(2.3, 0.08, 32, 100),
      new THREE.MeshStandardMaterial({ color: 0x181820, metalness: 0.92, roughness: 0.12 })
    );
    masterGroup.add(barrelMesh);

    // ─── Glowing White Accent Ring ────────────────────────────
    const accentRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.022, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    masterGroup.add(accentRing);

    // ─── Secondary Inner Ring ─────────────────────────────────
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.03, 24, 80),
      new THREE.MeshStandardMaterial({ color: 0x22222c, metalness: 0.8, roughness: 0.3 })
    );
    masterGroup.add(innerRing);

    // ─── Tertiary Thin Ring ───────────────────────────────────
    const thinRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.95, 0.012, 12, 80),
      new THREE.MeshBasicMaterial({ color: 0xFF2A3B, transparent: true, opacity: 0.5 })
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
      depth: 0.03, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.01, bevelThickness: 0.01
    });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0c0c12, metalness: 0.88, roughness: 0.18 });
    const bladeEdgeMat = new THREE.LineBasicMaterial({ color: 0xFF2A3B, transparent: true, opacity: 0.8 });
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
      new THREE.SphereGeometry(1.6, 64, 64),
      new THREE.MeshPhysicalMaterial({
        color: 0xFF2A3B, transparent: true, opacity: 0.28,
        roughness: 0.04, metalness: 0.1, transmission: 0.92, ior: 1.55
      })
    );
    masterGroup.add(glassDome);

    // ─── Inner Glow Core ─────────────────────────────────────
    const innerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xFF2A3B, transparent: true, opacity: 0.55 })
    );
    masterGroup.add(innerGlow);

    // ─── Anamorphic Lens Flare Sprite ────────────────────────
    const flareCanvas = document.createElement('canvas');
    flareCanvas.width = 512; flareCanvas.height = 256;
    const fctx = flareCanvas.getContext('2d');
    const flareGrad = fctx.createRadialGradient(256, 128, 0, 256, 128, 128);
    flareGrad.addColorStop(0, 'rgba(255, 42, 59, 0.95)');
    flareGrad.addColorStop(0.3, 'rgba(255, 42, 59, 0.28)');
    flareGrad.addColorStop(1, 'rgba(255, 42, 59, 0)');
    fctx.fillStyle = flareGrad;
    fctx.fillRect(0, 0, 512, 256);

    const flareSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(flareCanvas), transparent: true, depthWrite: false })
    );
    flareSprite.scale.set(isMobile ? 7 : 11, isMobile ? 3.5 : 5.5, 1);
    scene.add(flareSprite);

    // ─── Particle Swarm ───────────────────────────────────────
    const pCount = isMobile ? 200 : 700;
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
      new THREE.PointsMaterial({ color: 0xFFFFFF, size: isMobile ? 0.025 : 0.02, transparent: true, opacity: 0.6 })
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
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.position.z = w < 768 ? 9.5 : 6.5;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // ─── Animation Loop ───────────────────────────────────────
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;

      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      masterGroup.rotation.y = currentMouseX * 0.35 + Math.sin(t * 0.5) * 0.05;
      masterGroup.rotation.x = -currentMouseY * 0.35 + Math.cos(t * 0.5) * 0.05;

      barrelMesh.rotation.z += 0.001;
      innerRing.rotation.z  -= 0.002;
      thinRing.rotation.z   += 0.003;
      irisGroup.rotation.z  += 0.0015;

      const irisPulse = Math.sin(t * 0.9) * 0.07 + 1;
      irisGroup.scale.set(irisPulse, irisPulse, 1);

      const glowPulse = Math.sin(t * 1.4) * 0.1 + 0.9;
      innerGlow.scale.setScalar(glowPulse);
      innerGlow.material.opacity = 0.45 + Math.sin(t * 1.8) * 0.15;

      redCoreLight.intensity = 12 + Math.sin(t * 2.1) * 3;

      particleSys.rotation.y -= 0.0008;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="sphere-canvas"
      className="absolute inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
}
