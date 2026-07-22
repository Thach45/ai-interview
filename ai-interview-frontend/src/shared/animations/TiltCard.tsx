import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({ 
  children, 
  className = '',
  depth = 30 // Max rotation in degrees
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [0, 1], [depth, -depth]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-depth, depth]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Normalize coordinates between 0 and 1
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ scale: 1 }}
      animate={{ scale: isHovered ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative rounded-3xl ${className}`}
    >
      {/* Glare effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 rounded-3xl opacity-0 transition-opacity duration-300"
        style={{
          background: useTransform(
            () => `radial-gradient(circle at ${x.get() * 100}% ${y.get() * 100}%, rgba(255,255,255,0.2) 0%, transparent 60%)`
          ),
          opacity: isHovered ? 1 : 0
        }}
      />
      
      {/* Content wrapper with translateZ for 3D pop effect */}
      <div 
        style={{ transform: 'translateZ(50px)', transformStyle: "preserve-3d" }}
        className="w-full h-full relative z-10"
      >
        {children}
      </div>
    </motion.div>
  );
};
