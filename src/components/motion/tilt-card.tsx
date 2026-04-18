"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useSyncExternalStore } from "react";

export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  if (!mounted || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        setRotate({
          x: (0.5 - py) * 6, // Reduced rotation for heavier, more premium feel
          y: (px - 0.5) * 8,
        });
      }}
      style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
      transition={{ type: "spring", stiffness: 100, damping: 25, mass: 1.2 }}
      whileHover={{ scale: 1.015 }}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
    >
      {children}
    </motion.div>
  );
}
