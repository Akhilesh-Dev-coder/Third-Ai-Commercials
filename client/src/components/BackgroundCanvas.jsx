import React, { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const starCanvas = canvasRef.current;
    if (!starCanvas) return;
    
    let sctx;
    try {
      sctx = starCanvas.getContext('2d', { alpha: true });
    } catch (err) {
      console.warn('BackgroundCanvas 2D context error:', err);
      return;
    }
    if (!sctx) return;

    let stars = [];
    let animId;

    function resizeStars() {
      if (!starCanvas) return;
      starCanvas.width = window.innerWidth || 300;
      starCanvas.height = window.innerHeight || 300;
      stars = [];
      const count = window.innerWidth < 768 ? 50 : 110;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * starCanvas.width,
          y: Math.random() * starCanvas.height,
          r: Math.random() * 1.2 + 0.2,
          s: Math.random() * 0.4 + 0.05,
          o: Math.random() * 0.6 + 0.2
        });
      }
    }

    function drawStars() {
      if (document.hidden || !sctx || !starCanvas) return;
      try {
        sctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
        const t = Date.now() * 0.001;
        stars.forEach((st) => {
          const flicker = 0.5 + 0.5 * Math.sin(t * st.s * 3 + st.x);
          sctx.beginPath();
          sctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
          sctx.fillStyle = `rgba(255,255,255,${st.o * flicker})`;
          sctx.fill();
        });
        animId = requestAnimationFrame(drawStars);
      } catch (err) {
        if (animId) cancelAnimationFrame(animId);
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animId) cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(drawStars);
      }
    };

    resizeStars();
    animId = requestAnimationFrame(drawStars);

    window.addEventListener('resize', resizeStars, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', resizeStars);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="bg-stars" />
      <div id="bg-grid" />
    </>
  );
}
