import React from 'react';
import { Card } from '../ui/Card';
import { Sparkles, Cpu, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const AiInsightsPlaceholder: React.FC = () => {
  return (
    <Card className="p-8 border-dashed border-accent-violet/40 bg-dark-surface/40 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-violet/5 via-accent-cyan/5 to-transparent pointer-events-none" />
      <div className="flex flex-col items-center text-center max-w-xl mx-auto py-8">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="p-4 rounded-2xl bg-accent-violet/10 border border-accent-violet/30 text-accent-violet shadow-glow-violet mb-4"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-violet/20 border border-accent-violet/30 text-accent-violet text-xs font-mono font-medium mb-3">
          <Lock className="w-3 h-3" /> COMING SOON
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 font-mono">
          AI Repository Intelligence
        </h2>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          RepoLens AI module is currently in development. Soon, you will get automated issue triaging, code sentiment analysis, pull request summaries, and intelligent project diagnostics right here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left">
          {[
            { title: 'Project Summaries', desc: 'Deterministic & LLM overview' },
            { title: 'PR Analysis', desc: 'Automated review flags' },
            { title: 'Repository QA', desc: 'Ask questions about codebase' },
          ].map((feature, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-dark-border bg-dark-bg/60">
              <p className="text-xs font-mono text-accent-cyan font-semibold flex items-center gap-1">
                <Cpu className="w-3 h-3" /> {feature.title}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};