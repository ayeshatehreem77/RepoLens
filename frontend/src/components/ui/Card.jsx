import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  hoverGlow = true,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverGlow ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`relative overflow-hidden rounded-xl border border-dark-border/80 bg-dark-surface/60 backdrop-blur-md transition-all duration-300 hover:border-accent-cyan/40 hover:shadow-glow-cyan ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};