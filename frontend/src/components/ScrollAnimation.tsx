
import React, { useEffect, useRef, ReactNode } from 'react';

type ScrollAnimationProps = {
  children: ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
};

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  className = "",
  threshold = 0.2,
  delay = 0
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setTimeout(() => {
              element.classList.add('opacity-100', 'translate-y-0');
              element.classList.remove('opacity-0', 'translate-y-10');
              hasAnimated.current = true;
            }, delay);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, delay]);

  return (
    <div
      ref={elementRef}
      className={`opacity-0 translate-y-10 transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
