import React from 'react';
import { Card } from './Card';
import { motion } from 'framer-motion';

const colorMap = {
  cyan: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20 shadow-glow-cyan',
  violet: 'text-accent-violet bg-accent-violet/10 border-accent-violet/20 shadow-glow-violet',
  emerald: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20 shadow-glow-emerald',
  amber: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
};

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  color = 'cyan',
}) => {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider font-mono text-slate-400">{title}</p>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold font-mono text-white mt-1"
          >
            {value}
          </motion.h3>
          {trend && <p className="text-xs text-accent-emerald mt-2 font-mono">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg border ${colorMap[color] || colorMap.cyan}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};