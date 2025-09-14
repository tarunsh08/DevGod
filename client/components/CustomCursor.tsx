"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updatePosition);
    
    // Add hover effect for interactive elements
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    
    const elements = document.querySelectorAll("a, button, [role='button']");
    elements.forEach(el => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      elements.forEach(el => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <div className="fixed pointer-events-none z-90 mix-blend-difference" 
         style={{
           left: `${position.x}px`,
           top: `${position.y}px`,
           transform: 'translate(-50%, -50%)',
           transition: 'transform 0.15s ease-out'
         }}>
      <div className={`rounded-full bg-white transition-all duration-200 ${isHovering ? 'w-6 h-6' : 'w-2 h-2'}`} />
    </div>
  );
}
