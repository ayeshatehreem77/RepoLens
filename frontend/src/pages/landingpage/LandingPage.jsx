import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  GitPullRequest,
  CircleDot,
  Activity,
  Bell,
  Sparkles,
  BarChart3,
  FolderGit2,
  HeartHandshake,
  Layers,
  Zap,
  Terminal,
  ShieldCheck,
  Menu,
  X,
  Code2,
  Bot,
  TrendingUp,
  Cpu,
  Eye,
  GitBranch,
} from 'lucide-react';
import { MouseGlowCursor } from '../../layouts/MouseGlowCursor';
import logoSvg from '../../assets/logo.svg';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const floatAnim = (duration = 5, delay = 0) => ({
    y: [0, -6, 0],
    transition: {
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#09080e] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-300 overflow-x-hidden relative">
      <MouseGlowCursor />
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern [background-size:32px_32px] opacity-10 pointer-events-none z-0" />

      {/* Ambient Lighting Gradients */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-900/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed top-[40%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 blur-[160px] rounded-full pointer-events-none" />

      {/* 1. NAVBAR (UNTOUCHED) */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-[#09080e]/80 backdrop-blur-xl border-b border-purple-900/20 py-3 shadow-2xl'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logoSvg}
              alt="RepoLens Logo"
              className="h-9 md:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-purple-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-purple-400 transition-colors">
              How It Works
            </a>
            <a href="#insights" className="hover:text-purple-400 transition-colors">
              Insights
            </a>
            <a href="#ai-insights" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
              <span>AI Insights</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-900/40 text-purple-300 border border-purple-500/30">
                SOON
              </span>
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="relative group overflow-hidden rounded-lg p-[1px] font-mono text-xs font-semibold"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg" />
              <span className="relative block px-4 py-2.5 rounded-[7px] bg-[#0d0d15] hover:bg-transparent text-white transition-all duration-300 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0d0d15] border-b border-purple-900/20 px-6 py-6 space-y-4"
          >
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white text-base"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white text-base"
            >
              How It Works
            </a>
            <a
              href="#insights"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white text-base"
            >
              Insights
            </a>
            <a
              href="#ai-insights"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white text-base"
            >
              AI Insights
            </a>
            <div className="pt-4 border-t border-purple-900/20 flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full text-center py-2.5 rounded-lg border border-purple-500/20 text-slate-300 text-sm font-mono"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm font-mono"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* 2. HERO SECTION (UNTOUCHED) */}
      <section className="relative pt-28 pb-12 px-4 sm:px-6 max-w-6xl mx-auto z-10 flex flex-col justify-between overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[350px] bg-purple-900/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="absolute inset-0 pointer-events-none max-w-5xl mx-auto my-auto h-[380px] hidden md:block">
          <svg
            className="absolute inset-0 w-full h-full opacity-25"
            viewBox="0 0 1000 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="500"
              cy="225"
              rx="420"
              ry="180"
              stroke="url(#orbitGradient)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <defs>
              <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>

          <span className="absolute top-[28%] left-[24%] w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7] animate-pulse" />
          <span className="absolute top-[18%] right-[24%] w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7] animate-pulse" />
          <span className="absolute bottom-[28%] left-[12%] w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#a855f7]" />
          <span className="absolute bottom-[22%] right-[25%] w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />

          <motion.div
            animate={floatAnim(6, 0)}
            className="absolute top-[2%] left-[10%] w-36 p-2.5 rounded-xl border border-purple-500/20 bg-[#0d0d15]/80 backdrop-blur-xl shadow-lg shadow-purple-950/20 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-950/50 border border-purple-500/30 text-purple-400">
                <CircleDot className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-sm font-bold font-mono text-white leading-none">12</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Open Issues</p>
              </div>
            </div>
            <svg className="w-full h-4 mt-1.5 text-purple-400/80 stroke-current" viewBox="0 0 100 25" fill="none">
              <path d="M0 20 Q 20 5, 40 18 T 80 8 T 100 15" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>

          <motion.div
            animate={floatAnim(5.5, 0.5)}
            className="absolute top-[4%] right-[10%] w-36 p-2.5 rounded-xl border border-purple-500/20 bg-[#0d0d15]/80 backdrop-blur-xl shadow-lg shadow-purple-950/20 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-950/50 border border-purple-500/30 text-purple-400">
                <GitPullRequest className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-sm font-bold font-mono text-white leading-none">5</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Pull Requests</p>
              </div>
            </div>
            <svg className="w-full h-4 mt-1.5 text-purple-400/80 stroke-current" viewBox="0 0 100 25" fill="none">
              <path d="M0 15 Q 25 22, 50 10 T 80 18 T 100 5" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>

          <motion.div
            animate={floatAnim(4.5, 1)}
            className="absolute top-[38%] left-[11%] p-2.5 rounded-xl border border-purple-500/20 bg-[#0d0d15]/80 backdrop-blur-xl shadow-md shadow-purple-950/20 text-slate-300 pointer-events-auto hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </motion.div>

          <motion.div
            animate={floatAnim(5.2, 0.8)}
            className="absolute top-[40%] right-[12%] p-2.5 rounded-xl border border-purple-500/20 bg-[#0d0d15]/80 backdrop-blur-xl shadow-md shadow-purple-950/20 text-purple-400 pointer-events-auto"
          >
            <Code2 className="w-4 h-4" />
          </motion.div>

          <motion.div
            animate={floatAnim(6.2, 1.2)}
            className="absolute bottom-[10%] left-[12%] w-36 p-2.5 rounded-xl border border-purple-500/20 bg-[#0d0d15]/80 backdrop-blur-xl shadow-lg shadow-purple-950/20 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">
                <HeartHandshake className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-sm font-bold font-mono text-white leading-none">87%</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Code Health</p>
              </div>
            </div>
            <svg className="w-full h-4 mt-1.5 text-emerald-400/80 stroke-current" viewBox="0 0 100 25" fill="none">
              <path d="M0 18 Q 30 5, 50 15 T 80 8 T 100 12" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>

          <motion.div
            animate={floatAnim(5.8, 1.5)}
            className="absolute bottom-[8%] right-[13%] w-36 p-2.5 rounded-xl border border-purple-500/20 bg-[#0d0d15]/80 backdrop-blur-xl shadow-lg shadow-purple-950/20 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-950/50 border border-purple-500/30 text-purple-400">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-sm font-bold font-mono text-white leading-none">142</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Activity</p>
              </div>
            </div>
            <svg className="w-full h-4 mt-1.5 text-purple-400/80 stroke-current" viewBox="0 0 100 25" fill="none">
              <path d="M0 12 Q 20 22, 45 8 T 75 18 T 100 10" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>

        <motion.div
          className="relative z-20 max-w-2xl mx-auto text-center space-y-4 my-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} className="inline-block">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/40 text-[11px] font-mono text-purple-300 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Intelligent GitHub Workspace</span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight font-sans"
          >
            Understand Your <br className="hidden sm:inline" />
            Codebase.{' '}
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-200">
              At a Glance.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-sans"
          >
            RepoLens turns your GitHub repositories into clear, actionable insights — helping you understand projects, issues, PRs, and codebase health.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs transition-all shadow-md shadow-purple-950/50 flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#features"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-purple-500/30 bg-[#0d0d15]/60 hover:bg-purple-950/30 text-slate-300 font-medium text-xs transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              Explore RepoLens
            </a>
          </motion.div>

          <motion.div variants={fadeInUp} className="pt-2 flex justify-center items-center">
            <div className="p-2.5 rounded-full border border-purple-500/30 bg-[#0d0d15] shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <span className="text-sm font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                R
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative z-20 pt-8 border-t border-purple-900/20 max-w-3xl mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left"
        >
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <div className="p-1.5 rounded-md bg-purple-950/40 border border-purple-500/20 text-purple-400">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Real-time Insights</h4>
              <p className="text-[10px] text-slate-500">Live updates, always</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <div className="p-1.5 rounded-md bg-purple-950/40 border border-purple-500/20 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Secure & Private</h4>
              <p className="text-[10px] text-slate-500">Your data stays safe</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <div className="p-1.5 rounded-md bg-purple-950/40 border border-purple-500/20 text-indigo-400">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Built for Developers</h4>
              <p className="text-[10px] text-slate-500">Designed to flow with you</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= REDESIGNED LOWER SECTIONS ================= */}

      {/* SECTION 1 — FEATURES: EDITORIAL ASYMMETRIC GRID */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3 mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white">
            Everything your repository needs
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            A unified view of health, issues, and activity without jumping tabs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Featured Capability */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            className="lg:col-span-2 p-6 sm:p-8 rounded-2xl border border-purple-500/15 bg-gradient-to-br from-[#0e0c18] via-[#0b0a12] to-[#0d0d15] relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-[90px] rounded-full pointer-events-none group-hover:bg-purple-600/15 transition-all" />
            
            <div className="space-y-4 max-w-md relative z-10">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-purple-400 font-semibold">
                Core Workspace
              </span>
              <h3 className="text-xl font-bold font-sans text-white">Unified Repository Command Center</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aggregates active pull requests, open issues, and real-time commit activity into a clean, zero-friction developer interface.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-purple-900/20 flex items-center justify-between text-xs font-mono text-slate-400 relative z-10">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync Engine
              </span>
              <span className="text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Explore View <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>

          {/* Supporting Capability 1 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            className="p-6 rounded-2xl border border-purple-500/15 bg-[#0b0a12] hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <CircleDot className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold font-sans text-white">Issue Intelligence</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by priority, stale states, and unassigned bottlenecks cleanly.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-900/10 text-[10px] font-mono text-slate-500">
              Auto-categorized
            </div>
          </motion.div>

          {/* Supporting Capability 2 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            className="p-6 rounded-2xl border border-purple-500/15 bg-[#0b0a12] hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-indigo-400">
                <GitPullRequest className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold font-sans text-white">PR Flow Metrics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track code review response rates and PR merge velocity effortlessly.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-900/10 text-[10px] font-mono text-slate-500">
              Real-time review tracking
            </div>
          </motion.div>

          {/* Supporting Capability 3 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            className="p-6 rounded-2xl border border-purple-500/15 bg-[#0b0a12] hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-300">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold font-sans text-white">Activity Timeline</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chronological commit streams and repository event audits.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-900/10 text-[10px] font-mono text-slate-500">
              Audit logging
            </div>
          </motion.div>

          {/* Supporting Capability 4 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            className="p-6 rounded-2xl border border-purple-500/15 bg-[#0b0a12] hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Bell className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold font-sans text-white">Smart Alerts</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quiet background notifications for critical updates only.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-900/10 text-[10px] font-mono text-slate-500">
              Zero noise
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — HOW IT WORKS: HORIZONTAL STEP FLOW */}
      <section id="how-it-works" className="py-24 border-y border-purple-900/15 bg-[#07060b] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-2 mb-16"
          >
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white">Three steps to total clarity</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0 -translate-y-8 pointer-events-none" />

            {[
              {
                num: "01",
                title: "Connect GitHub",
                desc: "Authorize with read-only OAuth access in seconds.",
                icon: GithubIcon,
              },
              {
                num: "02",
                title: "RepoLens Analyzes",
                desc: "Indexes your PRs, issues, commits, and dependencies.",
                icon: Cpu,
              },
              {
                num: "03",
                title: "Understand Codebase",
                desc: "Get immediate health metrics and action-ready views.",
                icon: Eye,
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="relative p-6 rounded-xl border border-purple-500/10 bg-[#0d0d15]/60 backdrop-blur-md flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-purple-400/80 bg-purple-950/50 px-2.5 py-1 rounded border border-purple-500/20">
                        {step.num}
                      </span>
                      <div className="p-2 rounded-lg bg-purple-950/30 text-slate-300">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold font-sans text-white">{step.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3 — REPOSITORY INSIGHTS: SPLIT SECTION */}
      <section id="insights" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Visibility</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white leading-tight">
                Clear insights without the noise
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Skip traditional heavy dashboards. RepoLens surfaces critical structural metrics with lightweight visual indicators tailored for modern engineering flows.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "PR review bottlenecks highlighted automatically",
                "Stale issue detection across all active branches",
                "Language composition & health score overview",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-sans text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Floating Minimal Abstract Visualization */}
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 relative flex items-center justify-center p-8 rounded-2xl border border-purple-500/15 bg-gradient-to-b from-[#0d0d15] to-[#08070d] min-h-[320px] overflow-hidden"
          >
            <div className="absolute inset-0 bg-purple-600/5 blur-[80px] pointer-events-none" />
            
            {/* Minimal Nodes Graph Concept */}
            <div className="w-full max-w-md space-y-4 relative z-10 font-mono">
              <div className="p-3.5 rounded-xl border border-purple-500/20 bg-[#12111d]/90 shadow-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">main branch</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  passing
                </span>
              </div>

              <div className="pl-6 border-l border-purple-500/20 space-y-3 ml-4">
                <motion.div 
                  animate={{ y: [0, -3, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="p-3 rounded-lg border border-purple-500/15 bg-[#0e0d17]/80 text-[11px] flex items-center justify-between"
                >
                  <span className="text-slate-300">feat/nest-api-migration</span>
                  <span className="text-purple-400 text-[10px]">#142</span>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 3, 0] }} 
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="p-3 rounded-lg border border-purple-500/15 bg-[#0e0d17]/80 text-[11px] flex items-center justify-between"
                >
                  <span className="text-slate-300">fix/cors-configuration</span>
                  <span className="text-indigo-300 text-[10px]">#139</span>
                </motion.div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 px-2 pt-1">
                <span>Updated 2m ago</span>
                <span>3 reviewers assigned</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 — AI INSIGHTS / FUTURE FEATURE: ELEGANT WIDE CARD */}
      <section id="ai-insights" className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#0e0c18] via-[#090810] to-[#0c0b14] relative overflow-hidden text-center space-y-8"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="space-y-3 max-w-xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/50 text-[10px] font-mono text-purple-300">
              <Bot className="w-3 h-3 text-purple-400" />
              <span>Next Generation RAG Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white">
              Ask your codebase anything
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Natural language repository search coming to RepoLens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto relative z-10 text-left">
            {[
              "What is causing the most issues?",
              "Which files need immediate review?",
              "Where is complexity increasing?",
            ].map((query, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-purple-500/15 bg-[#09080e]/90 text-xs font-mono text-slate-300 flex items-start gap-2.5 shadow-sm"
              >
                <Terminal className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>"{query}"</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 5 — FINAL CTA */}
      <section className="py-24 border-t border-purple-900/15 text-center relative z-10 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto space-y-5 relative z-10"
        >
          <h2 className="text-2xl sm:text-4xl font-bold font-sans text-white tracking-tight">
            See your repositories differently.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Start organizing your GitHub workspace with minimal friction.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs transition-all shadow-lg shadow-purple-950/50 group active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER: ELEGANT & COMPACT */}
      <footer className="border-t border-purple-900/20 bg-[#06050a] py-12 px-6 relative z-10 text-xs font-sans">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-white">RepoLens</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Intelligent repository analytics and workspace for software teams.
            </p>
          </div>

          <div>
            <h4 className="font-mono font-semibold text-slate-200 mb-3 text-[11px] uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a></li>
              <li><a href="#ai-insights" className="hover:text-purple-400 transition-colors">AI Insights</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-semibold text-slate-200 mb-3 text-[11px] uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li><Link to="/login" className="hover:text-purple-400 transition-colors">Log in</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition-colors">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-semibold text-slate-200 mb-3 text-[11px] uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-purple-900/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-2">
          <p>© {new Date().getFullYear()} RepoLens. All rights reserved.</p>
          <p className="font-mono">Built for software engineering flows.</p>
        </div>
      </footer>
    </div>
  );
}