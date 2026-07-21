import React, { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    const dot = document.getElementById('cursor-dot');
    const glow = document.getElementById('cursor-glow');

    if (!dot || !glow) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx;
    let gy = my;
    let animId;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    };

    const animateGlow = () => {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      glow.style.left = `${gx}px`;
      glow.style.top = `${gy}px`;
      animId = requestAnimationFrame(animateGlow);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(animateGlow);

    const handleMouseEnter = () => {
      glow.style.width = '500px';
      glow.style.height = '500px';
    };

    const handleMouseLeave = () => {
      glow.style.width = '340px';
      glow.style.height = '340px';
    };

    const interactiveSelector = 'a, button, .proj-card, .tool-chip, .service-card, input, textarea, select';
    const elements = document.querySelectorAll(interactiveSelector);

    elements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" />
      <div id="cursor-glow" />
      <div id="grain" />
    </>
  );
}
