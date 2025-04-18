import { cn } from '@/lib/utils';
import { animated, useSpring } from '@react-spring/web';
import { useCallback, useEffect, useRef } from 'react';

interface ScaledContainerProps {
  cref?: React.RefObject<HTMLDivElement>;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const ScaledContainer: React.FC<ScaledContainerProps> = ({
  cref,
  className,
  style,
  children,
}) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const containerRef = cref ?? useRef<HTMLDivElement | null>(null);
  const [{ scale }, scaleApi] = useSpring(() => ({
    scale: 1,
  }));

  const updateScale = useCallback(() => {
    if (!parentRef.current || !containerRef.current) return;
    const scale = Math.min(
      parentRef.current.clientHeight / containerRef.current.clientHeight,
      parentRef.current.clientWidth / containerRef.current.clientWidth,
    );
    void scaleApi.start({
      scale,
    });
  }, [parentRef, containerRef, scaleApi]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', () => updateScale());
    return () => {
      window.removeEventListener('resize', () => updateScale());
    };
  }, [updateScale]);

  return (
    <div
      ref={parentRef}
      className={cn('relative flex items-center justify-center', className)}
    >
      <animated.div
        ref={containerRef}
        className="absolute"
        style={{ ...style, scale }}
      >
        {children}
      </animated.div>
    </div>
  );
};

export default ScaledContainer;
