import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  CheckCircle2,
  Layers,
  Zap,
  Terminal,
  Shield,
  Search,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { MouseGlowCursor, SpotlightCard, TiltPreview } from '../../layouts/MouseGlowCursor';
import logoSvg from '../../assets/logo.svg';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function LandingPage() {

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, -50]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 font-sans selection:bg-accent-cyan/30 selection:text-accent-cyan overflow-x-hidden relative">
      {/* Background Subtle Grid Pattern */}
      <MouseGlowCursor />
      <div className="fixed inset-0 bg-grid-pattern [background-size:32px_32px] opacity-15 pointer-events-none z-0" />

      {/* Ambient Lighting Gradients */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent-cyan/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed top-[40%] left-[-10%] w-[500px] h-[500px] bg-accent-violet/5 blur-[160px] rounded-full pointer-events-none" />

      {/* 1. NAVBAR */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border/80 py-3 shadow-2xl'
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

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-accent-cyan transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-accent-cyan transition-colors">
              How It Works
            </a>
            <a href="#why-repolens" className="hover:text-accent-cyan transition-colors">
              Why RepoLens
            </a>
            <a href="#ai-insights" className="hover:text-accent-cyan transition-colors flex items-center gap-1.5">
              <span>AI Insights</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent-violet/20 text-accent-violet border border-accent-violet/30">
                SOON
              </span>
            </a>
          </nav>

          {/* Desktop CTA Buttons */}
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
              <span className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-violet rounded-lg" />
              <span className="relative block px-4 py-2.5 rounded-[7px] bg-dark-surface hover:bg-transparent text-white transition-all duration-300 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-dark-surface border-b border-dark-border px-6 py-6 space-y-4"
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
              href="#why-repolens"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white text-base"
            >
              Why RepoLens
            </a>
            <a
              href="#ai-insights"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white text-base"
            >
              AI Insights
            </a>
            <div className="pt-4 border-t border-dark-border flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full text-center py-2.5 rounded-lg border border-dark-border text-slate-300 hover:bg-dark-hover text-sm font-mono"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-violet text-dark-bg font-bold text-sm font-mono"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column Text */}
          <motion.div
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 font-mono text-xs text-accent-cyan">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Intelligent GitHub Workspace</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] font-sans"
            >
              Understand Your Codebase.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan via-slate-100 to-accent-violet">
                At a Glance.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              RepoLens turns your GitHub repositories into clear, actionable insights — helping you understand projects, issues, pull requests, activity, and codebase health from one intelligent workspace.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-violet font-mono text-sm font-bold text-dark-bg hover:opacity-90 shadow-glow-cyan transition-all flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#product-preview"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-dark-border/80 bg-dark-surface/60 backdrop-blur-md hover:bg-dark-hover font-mono text-sm text-slate-300 transition-all flex items-center justify-center gap-2"
              >
                Explore RepoLens
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column Visual (Repository Intelligence Diagram) */}
          <motion.div
            style={{ y: heroParallax }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-2xl border border-dark-border/80 bg-dark-surface/40 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-violet/5 pointer-events-none" />

              {/* Node Card 1: Main Repo */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="p-3.5 rounded-xl border border-accent-cyan/30 bg-dark-bg/90 backdrop-blur-md shadow-glow-cyan flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <FolderGit2 className="w-5 h-5 text-accent-cyan" />
                  <div>
                    <p className="text-xs font-mono text-slate-400">Repository</p>
                    <p className="text-sm font-mono font-bold text-white">repoLens / core-api</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-ping" />
              </motion.div>

              {/* Connecting Vector Lines Simulation */}
              <div className="my-2 flex justify-around text-slate-600 font-mono text-xs">
                <div className="w-px h-8 bg-gradient-to-b from-accent-cyan/50 to-transparent" />
                <div className="w-px h-8 bg-gradient-to-b from-accent-violet/50 to-transparent" />
              </div>

              {/* Grid Nodes (Issues, PRs, Activity) */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="p-3 rounded-lg border border-dark-border bg-dark-bg/70 backdrop-blur-md space-y-1"
                >
                  <div className="flex items-center gap-2 text-accent-amber">
                    <CircleDot className="w-4 h-4" />
                    <span className="text-xs font-mono font-semibold">12 Open Issues</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">Auth module refactor</p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="p-3 rounded-lg border border-dark-border bg-dark-bg/70 backdrop-blur-md space-y-1"
                >
                  <div className="flex items-center gap-2 text-accent-emerald">
                    <GitPullRequest className="w-4 h-4" />
                    <span className="text-xs font-mono font-semibold">5 PRs Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">NestJS + Prisma fix</p>
                </motion.div>
              </div>

              <div className="my-2 flex justify-center">
                <div className="w-px h-6 bg-gradient-to-b from-accent-violet/50 to-transparent" />
              </div>

              {/* Analytics Graph Floating Pill */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="p-3 rounded-xl border border-accent-violet/30 bg-dark-bg/90 backdrop-blur-md flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-accent-violet" />
                  <span className="text-xs font-mono text-slate-300">Activity Health</span>
                </div>
                <div className="flex items-end gap-1 h-5">
                  <span className="w-1 h-2 bg-accent-violet rounded-full animate-pulse" />
                  <span className="w-1 h-4 bg-accent-violet rounded-full animate-pulse" />
                  <span className="w-1 h-3 bg-accent-cyan rounded-full animate-pulse" />
                  <span className="w-1 h-5 bg-accent-cyan rounded-full animate-pulse" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 3. TRUST / VALUE STRIP */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="border-y border-dark-border bg-dark-surface/30 backdrop-blur-sm py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest mb-6">
            Unified Repository Workspace Capability
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {[
              { label: 'GitHub Integration', icon: GithubIcon },
              { label: 'Repository Analytics', icon: BarChart3 },
              { label: 'Issue Tracking', icon: CircleDot },
              { label: 'Pull Request Insights', icon: GitPullRequest },
              { label: 'Activity Monitoring', icon: Activity },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 transition-colors py-2"
                >
                  <Icon className="w-4 h-4 text-accent-cyan" />
                  <span className="text-xs font-mono font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 4. FEATURES SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-sans">
            Everything you need to understand your repositories.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Engineered for developers who want clear, aggregated insight without navigating through dozens of GitHub tabs.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'GitHub Integration',
              desc: 'Connect your GitHub repositories and bring your development data into RepoLens seamlessly.',
              icon: GithubIcon,
              color: 'cyan',
            },
            {
              title: 'Repository Overview',
              desc: 'See important repository statistics, language breakdowns, and health information in one place.',
              icon: FolderGit2,
              color: 'violet',
            },
            {
              title: 'Issue Intelligence',
              desc: 'Track open issues, labels, comments, authors, and project activity with clean filtering.',
              icon: CircleDot,
              color: 'amber',
            },
            {
              title: 'Pull Request Insights',
              desc: 'Understand PR status, code reviews, changed files, and overall development progress.',
              icon: GitPullRequest,
              color: 'emerald',
            },
            {
              title: 'Activity Timeline',
              desc: 'See important repository events, commits, and team development activity chronologically.',
              icon: Activity,
              color: 'cyan',
            },
            {
              title: 'Smart Notifications',
              desc: 'Keep track of critical PR requests and issue updates without constantly checking GitHub.',
              icon: Bell,
              color: 'violet',
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group relative p-6 rounded-xl border border-dark-border/80 bg-dark-surface/60 backdrop-blur-md hover:border-accent-cyan/40 hover:shadow-glow-cyan transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Special Feature Card: AI Insights Coming Soon */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-2 lg:col-span-3 p-8 rounded-xl border border-accent-violet/40 bg-gradient-to-r from-dark-surface/80 via-accent-violet/5 to-dark-surface/80 backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-accent-violet/40 bg-accent-violet/20 font-mono text-[11px] text-accent-violet">
                <Sparkles className="w-3 h-3" />
                <span>COMING SOON</span>
              </div>
              <h3 className="text-xl font-bold font-mono text-white">AI Repository Insights & RAG</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                RepoLens will soon leverage AI to answer complex natural language questions about your repositories, code changes, and open discussions in real-time.
              </p>
            </div>
            <div className="shrink-0 px-5 py-2.5 rounded-lg border border-accent-violet/30 bg-accent-violet/10 font-mono text-xs text-accent-violet font-semibold">
              In Development
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* 5. HOW IT WORKS */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} id="how-it-works" className="py-20 border-t border-dark-border/60 bg-dark-surface/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
            <p className="text-xs font-mono text-accent-cyan uppercase tracking-widest">Simple Workflow</p>
            <h2 className="text-3xl font-bold font-sans">How RepoLens Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Connect GitHub',
                desc: 'Authorize your GitHub account and select the repositories you want to monitor.',
                icon: GithubIcon,
              },
              {
                step: '02',
                title: 'RepoLens Analyzes',
                desc: 'RepoLens organizes repository information, issues, pull requests, and activity.',
                icon: Layers,
              },
              {
                step: '03',
                title: 'Understand & Act',
                desc: 'Get a clear overview of what is happening across all your projects in one unified workspace.',
                icon: Zap,
              },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="relative p-6 rounded-xl border border-dark-border bg-dark-surface/80 backdrop-blur-md space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-extrabold text-slate-400/40">{st.step}</span>
                    <div className="p-2.5 rounded-lg bg-dark-bg border border-dark-border text-accent-cyan">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold font-mono text-white">{st.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 6. PRODUCT PREVIEW */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} id="product-preview" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold font-sans">Designed for modern dev teams</h2>
          <p className="text-slate-400 text-sm">Experience the high-contrast, dark tech dashboard interface.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-dark-border/90 bg-dark-surface/80 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden group"
        >
          {/* Mockup Top Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-4 text-xs font-mono text-slate-400 hidden sm:inline">
                app.repolens.dev/dashboard
              </span>
            </div>
            <div className="text-xs font-mono text-accent-cyan px-2.5 py-1 rounded bg-accent-cyan/10 border border-accent-cyan/20">
              PREVIEW MODE
            </div>
          </div>

          {/* Mockup Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pointer-events-none select-none opacity-90">
            {/* Mock Sidebar */}
            <div className="hidden lg:block lg:col-span-3 space-y-3 p-4 rounded-xl bg-dark-bg/60 border border-dark-border/60">
              <div className="text-xs font-mono font-bold text-accent-cyan mb-4">REPOLENS</div>
              {['Dashboard', 'Projects', 'Issues', 'Pull Requests', 'Activity', 'Settings'].map((item, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between ${idx === 0
                    ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                    : 'text-slate-400'
                    }`}
                >
                  <span>{item}</span>
                  {idx === 0 && <ChevronRight className="w-3 h-3" />}
                </div>
              ))}
            </div>

            {/* Mock Dashboard Body */}
            <div className="lg:col-span-9 space-y-6">
              {/* Stat Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Repositories', val: '14' },
                  { label: 'Open Issues', val: '38' },
                  { label: 'Active PRs', val: '9' },
                  { label: 'Commits (Week)', val: '142' },
                ].map((st, i) => (
                  <div key={i} className="p-4 rounded-xl bg-dark-bg/60 border border-dark-border/60">
                    <p className="text-[10px] font-mono uppercase text-slate-400">{st.label}</p>
                    <p className="text-xl font-mono font-bold text-white mt-1">{st.val}</p>
                  </div>
                ))}
              </div>

              {/* Mock Project Row */}
              <div className="p-5 rounded-xl bg-dark-bg/60 border border-dark-border/60 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-white">repoLens / frontend</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/30">
                    Healthy
                  </span>
                </div>
                <div className="w-full bg-dark-border/60 h-1.5 rounded-full overflow-hidden flex">
                  <div className="bg-accent-cyan w-[60%]" />
                  <div className="bg-accent-violet w-[25%]" />
                  <div className="bg-accent-amber w-[15%]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* 7. WHY REPO LENS */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} id="why-repolens" className="py-20 border-t border-dark-border/60 bg-dark-surface/30 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">
                The Problem & Solution
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-sans leading-tight">
                GitHub has the data. <br />
                <span className="text-accent-cyan">RepoLens gives you the picture.</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                GitHub contains an incredible amount of repository information. However, developers and technical leads constantly jump between tabs, repositories, pull requests, and notification feeds just to stay aligned.
              </p>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                RepoLens consolidates this scattered information into a focused, beautifully designed developer workspace so you spend less time searching and more time shipping.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'No Tab Switching', desc: 'View PRs and issues across multiple repositories without leaving your workspace.' },
                { title: 'Clean Focus', desc: 'Distraction-free dark UI tailored specifically for engineers.' },
                { title: 'Unified Activity', desc: 'Real-time repository event streams in one consolidated feed.' },
                { title: 'Fast Insights', desc: 'Immediate clarity on codebase health and open bottlenecks.' },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-dark-border bg-dark-surface/60 space-y-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-cyan" />
                  <h4 className="text-sm font-bold font-mono text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 8. AI / FUTURE SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} id="ai-insights" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="p-8 sm:p-12 rounded-2xl border border-accent-violet/40 bg-gradient-to-b from-dark-surface via-dark-surface/90 to-dark-bg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-violet/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-violet/30 bg-accent-violet/10 font-mono text-xs text-accent-violet">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next Generation Feature</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-sans">
              Your repository. Your questions.{' '}
              <span className="text-accent-violet">Intelligent answers.</span>
            </h2>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              AI-powered repository intelligence is coming to RepoLens. Ask natural language questions directly about your codebase, active issues, or recent development activity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {[
                'What are the biggest issues in this project?',
                'Which pull requests need attention?',
                'What has changed recently?',
                'Where should I focus first?',
              ].map((q, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg border border-dark-border/80 bg-dark-bg/80 text-xs font-mono text-slate-300 flex items-center gap-2.5"
                >
                  <Terminal className="w-4 h-4 text-accent-violet shrink-0" />
                  <span className="truncate">"{q}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 9. FINAL CTA */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="py-20 border-t border-dark-border text-center relative z-10 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-sans">See your repositories differently.</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Turn GitHub data into a workspace you can actually understand.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-violet font-mono text-sm font-bold text-dark-bg hover:opacity-90 shadow-glow-cyan transition-all"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 10. FOOTER */}
      <footer className="border-t border-dark-border bg-dark-bg py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-accent-cyan to-accent-violet flex items-center justify-center font-mono font-bold text-xs text-dark-bg">
                RL
              </div>
              <span className="font-mono font-bold text-lg text-white">RepoLens</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent repository analytics and workspace for modern software teams.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-mono">
              <li>
                <a href="#features" className="hover:text-accent-cyan transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-accent-cyan transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#ai-insights" className="hover:text-accent-cyan transition-colors">
                  AI Insights
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-mono">
              <li>
                <Link to="/login" className="hover:text-accent-cyan transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-accent-cyan transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-accent-cyan transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-mono">
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-accent-cyan transition-colors flex items-center gap-2">
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-dark-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
          <p>© {new Date().getFullYear()} RepoLens. All rights reserved.</p>
          <p>Built for modern developers.</p>
        </div>
      </footer>
    </div>
  );
}