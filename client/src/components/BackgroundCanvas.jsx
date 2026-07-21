import React, { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const starCanvas = canvasRef.current;
    if (!starCanvas) return;
    const sctx = starCanvas.getContext('2d');
    let stars = [];
    let animId;

    function resizeStars() {
      starCanvas.width = window.innerWidth;
      starCanvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
      stars = [];
      const count = window.innerWidth < 768 ? 70 : 160;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * starCanvas.width,
          y: Math.random() * starCanvas.height,
          r: Math.random() * 1.3 + 0.2,
          s: Math.random() * 0.4 + 0.05,
          o: Math.random() * 0.6 + 0.2
        });
      }
    }

    function drawStars() {
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
    }

    resizeStars();
    animId = requestAnimationFrame(drawStars);

    window.addEventListener('resize', resizeStars);

    return () => {
      window.removeEventListener('resize', resizeStars);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="bg-stars" />
      <div id="bg-grid" />
    </>
  );
}
