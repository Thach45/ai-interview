import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useSpring(0, { stiffness: 100, damping: 20, mass: 0.5 });
  const cursorY = useSpring(0, { stiffness: 100, damping: 20, mass: 0.5 });

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
        scale: isHovering ? 1.5 : 1,
      }}
      className="fixed top-0 left-0 size-8 pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center"
    >
      <div className={`size-3 rounded-full bg-white transition-all duration-300 ${isHovering ? 'opacity-50 scale-150' : 'opacity-100'}`}></div>
      <div className={`absolute inset-0 rounded-full border border-white transition-all duration-300 ${isHovering ? 'scale-150 opacity-100' : 'scale-50 opacity-0'}`}></div>
    </motion.div>
  );
};
