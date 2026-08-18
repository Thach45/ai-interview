'use client';

import {
  createElement,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from 'framer-motion';

interface TextTypeProps extends HTMLAttributes<HTMLElement> {
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | ReactNode;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  startOnVisible?: boolean;
}

export default function TextType({
  text,
  as: Component = 'span',
  typingSpeed = 45,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 25,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  startOnVisible = false,
  ...props
}: TextTypeProps) {
  const prefersReducedMotion = useReducedMotion();
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const containerRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const getSpeed = useCallback(
    () => variableSpeed ? Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min : typingSpeed,
    [typingSpeed, variableSpeed],
  );

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!cursorRef.current || !showCursor || prefersReducedMotion) return;
    const animation = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
    });
    return () => animation.kill();
  }, [cursorBlinkDuration, prefersReducedMotion, showCursor]);

  useEffect(() => {
    const currentText = textArray[currentTextIndex] ?? '';
    if (prefersReducedMotion) {
      setDisplayedText(currentText);
      return;
    }
    if (!isVisible) return;

    const isComplete = currentCharIndex >= currentText.length;
    if (!loop && isComplete && !isDeleting) return;

    const delay = isDeleting ? deletingSpeed : getSpeed();
    const timeout = window.setTimeout(() => {
      if (isDeleting) {
        if (displayedText.length === 0) {
          const isLast = currentTextIndex === textArray.length - 1;
          if (!loop && isLast) return;
          setIsDeleting(false);
          setCurrentTextIndex((index) => (index + 1) % textArray.length);
          setCurrentCharIndex(0);
          return;
        }
        setDisplayedText((value) => value.slice(0, -1));
        setCurrentCharIndex((index) => Math.max(0, index - 1));
        return;
      }

      if (!isComplete) {
        setDisplayedText((value) => value + currentText[currentCharIndex]);
        setCurrentCharIndex((index) => index + 1);
        return;
      }

      if (loop && textArray.length > 1) setIsDeleting(true);
    }, isComplete && !isDeleting ? pauseDuration : currentCharIndex === 0 && displayedText === '' ? initialDelay || delay : delay);

    return () => window.clearTimeout(timeout);
  }, [currentCharIndex, currentTextIndex, deletingSpeed, displayedText, getSpeed, initialDelay, isDeleting, isVisible, loop, pauseDuration, prefersReducedMotion, textArray]);

  const hideCursor = hideCursorWhileTyping && !prefersReducedMotion && (currentCharIndex < (textArray[currentTextIndex]?.length ?? 0) || isDeleting);
  const textColor = textColors.length ? textColors[currentTextIndex % textColors.length] : undefined;

  return (
    <span ref={containerRef}>
      {createElement(
        Component,
        { className: `inline-block whitespace-pre-wrap tracking-tight ${className}`, ...props },
        <span style={textColor ? { color: textColor } : undefined}>{displayedText}</span>,
        showCursor && !prefersReducedMotion && <span ref={cursorRef} className={`ml-1 inline-block ${hideCursor ? 'hidden' : ''} ${cursorClassName}`}>{cursorCharacter}</span>,
      )}
    </span>
  );
}
