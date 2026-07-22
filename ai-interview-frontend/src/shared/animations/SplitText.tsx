import React from 'react';
import { motion, type Variants } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  type?: 'words' | 'chars';
}

export const SplitText: React.FC<SplitTextProps> = ({ 
  text, 
  className = '', 
  delay = 0,
  type = 'words' 
}) => {
  const words = text.split(' ');
  const chars = text.split('');
  
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)',
    },
  };

  if (type === 'chars') {
    return (
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className={`inline-flex flex-wrap ${className}`}
      >
        {chars.map((char, index) => (
          <motion.span
            variants={child}
            key={index}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`inline-flex flex-wrap ${className}`}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block mr-[0.25em]" // preserve space between words
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};
