import React, { useState, useEffect, useRef } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Code,
  Database,
  Layout,
  Cpu,
  ChevronDown,
  Send,
  Download,
  Award,
  BookOpen,
  Terminal,
  Trophy,
  School,
  Sun,
  Moon
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

// --- Terminal Loading Screen ---
const TerminalLoader = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const fullText = [
    "> initializing_core_systems...",
    "> establishing_secure_connection...",
    "> loading_modules [React, Framer_Motion, Tailwind]...",
    "> access_granted. welcome_user."
  ];

  useEffect(() => {
    let mounted = true;
    const typingSpeed = 800; // ms between lines (increase to slow down)
    const finalPause = 1000;  // ms to wait after last line before hiding

    const timeouts = [];

    fullText.forEach((line, idx) => {
      const t = setTimeout(() => {
        if (!mounted) return;
        setLines(prev => [...prev, line]);

        if (idx === fullText.length - 1) {
          const finish = setTimeout(() => {
            if (mounted) onComplete();
          }, finalPause);
          timeouts.push(finish);
        }
      }, typingSpeed * idx);
      timeouts.push(t);
    });

    return () => {
      mounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#030014] flex flex-col items-center justify-center font-mono text-sm md:text-base p-4"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-slate-800 pb-2">
          <Terminal size={16} className="text-fuchsia-500" />
          <span>terminal_root@anish-portfolio:~</span>
        </div>
        <div className="space-y-2">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-green-400"
            >
              {line}
            </motion.div>
          ))}
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-fuchsia-500 ml-1 align-middle"
          />
        </div>
      </div>
    </motion.div>
  );
};

// --- Custom Cursor Component ---
const CustomCursor = ({ theme }) => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 25, stiffness: 150 };
  const followerX = useSpring(mouseX, springConfig);
  const followerY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", moveCursor);

    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  const cursorColor = theme === 'dark' ? 'bg-fuchsia-400' : 'bg-violet-600';
  const ringColor = theme === 'dark' ? 'border-fuchsia-400' : 'border-violet-600';
  const ringBg = theme === 'dark' ? 'rgba(232, 121, 249, 0.2)' : 'rgba(124, 58, 237, 0.1)';

  return (
    <div className="hidden md:block pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference">
      {/* Increased size from w-3/h-3 to w-4/h-4 */}
      <motion.div
        className={`fixed top-0 left-0 w-4 h-4 rounded-full ${cursorColor}`}
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: isHovering ? 0 : 1 }}
      />
      {/* Increased size from w-8/h-8 to w-12/h-12 */}
      <motion.div
        className={`fixed top-0 left-0 w-12 h-12 border rounded-full ${ringColor}`}
        style={{ x: followerX, y: followerY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? ringBg : 'transparent',
          borderColor: isHovering ? 'transparent' : undefined
        }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
};

// --- Navbar ---
const Navbar = ({ activeSection, theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const glassClass = theme === 'dark'
    ? 'bg-[#030014]/80 shadow-violet-500/10'
    : 'bg-white/80 shadow-slate-200/50';

  const textClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const activeTextClass = theme === 'dark' ? 'text-fuchsia-400' : 'text-violet-600';
  const underlineClass = theme === 'dark' ? 'bg-fuchsia-400' : 'bg-violet-600';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? `${glassClass} backdrop-blur-md shadow-lg py-2` : 'bg-transparent py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between md:justify-end items-center relative">

        {/* Theme Toggle */}
        <div className="absolute left-6 md:static md:mr-8">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-yellow-300' : 'bg-slate-100 hover:bg-slate-200 text-violet-600'}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link, idx) => (
            <motion.a
              key={link.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              href={link.href}
              className={`relative text-sm font-medium transition-colors hover:${theme === 'dark' ? 'text-fuchsia-400' : 'text-violet-600'} ${activeSection === link.name.toLowerCase() ? activeTextClass : textClass}`}
            >
              {link.name}
              {activeSection === link.name.toLowerCase() && (
                <motion.div
                  layoutId="underline"
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 ${underlineClass}`}
                />
              )}
            </motion.a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden z-50 absolute right-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden absolute top-full left-0 w-full shadow-xl border-t overflow-hidden ${theme === 'dark' ? 'bg-[#0a0520] border-white/10' : 'bg-white border-slate-200'}`}
          >
            <div className="p-4 flex flex-col space-y-4 text-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`block p-2 ${theme === 'dark' ? 'text-slate-300 hover:text-fuchsia-400' : 'text-slate-600 hover:text-violet-600'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// --- Reusable Animated Section ---
const Section = ({ id, children, className = "" }) => {
  return (
    <section id={id} className={`py-20 px-6 overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
};

// --- Hero Section ---
const Hero = ({ theme }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subTextColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';

  // Dynamic Gradients
  const blob1 = theme === 'dark' ? 'bg-violet-600/30' : 'bg-blue-400/30';
  const blob2 = theme === 'dark' ? 'bg-fuchsia-600/30' : 'bg-purple-400/30';
  const blob3 = theme === 'dark' ? 'bg-indigo-600/30' : 'bg-cyan-400/30';

  const nameGradient = theme === 'dark'
    ? 'from-violet-400 via-fuchsia-400 to-white'
    : 'from-violet-600 via-fuchsia-600 to-slate-900';

  const pillClass = theme === 'dark'
    ? 'border-violet-500/30 bg-violet-500/10 text-violet-300'
    : 'border-violet-600/20 bg-violet-50 text-violet-700';

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-20 ${theme === 'dark' ? 'bg-[#030014]' : 'bg-slate-50'}`}>
      {/* Parallax Background Blobs */}
      <motion.div style={{ y: y1, x: -50 }} className={`absolute top-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50 ${blob1}`} />
      <motion.div style={{ y: y2, x: 50 }} className={`absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50 ${blob2}`} />
      <motion.div className={`absolute -bottom-32 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse ${blob3}`} />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`inline-block mb-4 px-4 py-1 rounded-full border text-sm font-semibold tracking-wide ${pillClass}`}
        >
          PORTFOLIO 2025
        </motion.div>

        <h1 className={`text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight ${textColor}`}>
          Hi, I'm <br className="md:hidden" />
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${nameGradient} inline-block`}>
            {/* Staggered Text Reveal */}
            {Array.from("Anish Singh Butola").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.5 }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed ${subTextColor}`}
        >
          Full Stack Developer & AI Enthusiast specializing in building modern, scalable web applications with React, Next.js, and Cloud Technologies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#projects"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-violet-500/30 transition-all hover:shadow-fuchsia-500/40"
          >
            View Projects
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className={`px-8 py-3 rounded-full font-semibold border flex items-center gap-2 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            Contact Me <Send size={16} />
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className={`mt-16 flex justify-center gap-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}
        >
          {[
            { Icon: Github, href: "https://github.com/777anishsingh" },
            { Icon: Linkedin, href: "https://www.linkedin.com/in/777anishsingh/" },
            { Icon: Mail, href: "mailto:777anish.singh@gmail.com" }
          ].map(({ Icon, href }, idx) => (
            <motion.a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, color: '#e879f9' }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon size={28} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}
      >
        <ChevronDown size={32} />
      </motion.div>
    </div>
  );
};

// --- Skills Section (Bento Grid) ---
const Skills = ({ theme }) => {
  const categories = [
    {
      title: "Languages",
      icon: <Code className="text-violet-400" />,
      skills: ["C", "C++", "JavaScript", "TypeScript", "SQL", "HTML", "CSS", "Python"],
      spanClass: "md:col-span-1 lg:col-span-2"
    },
    {
      title: "Frameworks & Libraries",
      icon: <Layout className="text-fuchsia-400" />,
      skills: ["React.js", "Next.js", "Node.js", "Express.js", "Tailwind CSS", "shadcn/ui"],
      spanClass: "md:col-span-1 lg:col-span-2"
    },
    {
      title: "Databases",
      icon: <Database className="text-emerald-400" />,
      skills: ["MongoDB", "MySQL", "PostgreSQL", "Convex", "Neon"],
      spanClass: "md:col-span-1 lg:col-span-2"
    },
    {
      title: "AI Technologies",
      icon: <Cpu className="text-rose-400" />,
      skills: ["Gen AI", "AI Agents", "LLM Models", "RAG", "LangChain"],
      spanClass: "md:col-span-1 lg:col-span-3"
    },
    {
      title: "Developer Tools",
      icon: <Terminal className="text-amber-400" />,
      skills: ["Firebase", "Supabase", "Appwrite", "GitHub", "Git", "Clerk", "ImageKit"],
      spanClass: "md:col-span-2 lg:col-span-3"
    }
  ];

  const cardClass = theme === 'dark'
    ? 'bg-white/5 border-white/10 hover:shadow-fuchsia-500/10'
    : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:shadow-violet-200/50';

  const headingColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const iconBg = theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-slate-50 group-hover:bg-slate-100';
  const chipClass = theme === 'dark' ? 'bg-black/30 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Section id="skills" className={theme === 'dark' ? 'bg-[#030014]' : 'bg-slate-50'}>
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`text-3xl md:text-4xl font-bold text-center mb-16 ${headingColor}`}
        >
          <span className="border-b-4 border-violet-500 pb-2">Technical Arsenal</span>
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6"
        >
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ scale: 1.02, borderColor: 'rgba(232, 121, 249, 0.5)' }}
              className={`backdrop-blur-sm p-6 rounded-2xl border transition-all duration-300 group flex flex-col h-full ${cardClass} ${cat.spanClass}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg transition-colors ${iconBg}`}>
                  {cat.icon}
                </div>
                <h3 className={`text-lg font-bold ${headingColor}`}>{cat.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {cat.skills.map((skill, sIdx) => (
                  <span key={sIdx} className={`text-xs font-medium px-2 py-1 rounded-md border transition-colors ${chipClass}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};

// --- Experience & Education Section ---
const Experience = ({ theme }) => {
  const bgClass = theme === 'dark' ? 'bg-[#050212]' : 'bg-white';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subTextColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const bodyTextColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const borderClass = theme === 'dark' ? 'border-white/10' : 'border-slate-200';
  const cardBg = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

  return (
    <Section id="experience" className={bgClass}>
      <div className="max-w-5xl mx-auto">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${headingColor}`}>
          <span className="border-b-4 border-fuchsia-500 pb-2">Journey So Far</span>
        </h2>

        <div className={`relative border-l-2 ml-3 md:ml-6 space-y-12 ${borderClass}`}>
          {/* Work Experience */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative pl-8 md:pl-12"
          >
            <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-fuchsia-500 border-4 ${theme === 'dark' ? 'border-[#050212]' : 'border-white'}`}></div>
            <h3 className={`text-2xl font-bold ${headingColor}`}>React Developer</h3>
            <div className={`flex flex-col sm:flex-row sm:items-center gap-2 mb-4 ${subTextColor}`}>
              <span className="font-semibold text-fuchsia-500">Infinity Lift</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-sm">March 2025 - Present</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-sm">Chandigarh, India</span>
            </div>
            <ul className={`list-disc list-outside space-y-3 ml-4 ${bodyTextColor}`}>
              <li>Deployed a fully responsive gym website, resulting in a 15% increase in online lead generation.</li>
              <li>Built navigation and validated contact form using React Router and Formspree, enabling seamless user flow and improving conversion rates.</li>
              <li>Launched the business’s first online presence from scratch, setting up Google Business Profile and enabling digital inquiries.</li>
            </ul>
          </motion.div>

          {/* Education - Degree */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative pl-8 md:pl-12"
          >
            <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-violet-500 border-4 ${theme === 'dark' ? 'border-[#050212]' : 'border-white'}`}></div>
            <h3 className={`text-2xl font-bold ${headingColor}`}>B.E. in Electronics & Computer Science</h3>
            <div className={`flex flex-col sm:flex-row sm:items-center gap-2 mb-4 ${subTextColor}`}>
              <span className="font-semibold text-violet-500">Thapar University</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-sm">2021 - 2025</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-sm">Patiala, Punjab</span>
            </div>
            <p className={bodyTextColor}>
              Relevant Coursework: Data Structures & Algorithms, OOPS, DBMS, Operating Systems, Computer Networks, AI.
              <br />
              <span className={`text-sm mt-2 block ${subTextColor}`}>Awarded Govt. of India scholarship for exceptional academic performance (4 years).</span>
            </p>
          </motion.div>

          {/* Education - Class 12 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative pl-8 md:pl-12"
          >
            <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-indigo-500 border-4 ${theme === 'dark' ? 'border-[#050212]' : 'border-white'}`}></div>
            <h3 className={`text-2xl font-bold ${headingColor}`}>Class 12</h3>
            <div className={`flex flex-col sm:flex-row sm:items-center gap-2 mb-4 ${subTextColor}`}>
              <span className="font-semibold text-indigo-500">Saint Soldier Divine Public School</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-sm">April 2020 - July 2021</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-sm">Panchkula, Haryana</span>
            </div>
            <p className={bodyTextColor}>
              Relevant Coursework: PCM & Information Technology.
              <br />
              <span className={`text-sm mt-2 block ${subTextColor}`}>Awarded 100% scholarship for exceptional academic performance.</span>
            </p>
          </motion.div>

          {/* Education - Class 10 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative pl-8 md:pl-12"
          >
            <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-500 border-4 ${theme === 'dark' ? 'border-[#050212]' : 'border-white'}`}></div>
            <h3 className={`text-2xl font-bold ${headingColor}`}>Class 10</h3>
            <div className={`flex flex-col sm:flex-row sm:items-center gap-2 mb-4 ${subTextColor}`}>
              <span className="font-semibold text-blue-500">Saint Soldier Divine Public School</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-sm">Completed 2019</span>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative pl-8 md:pl-12"
          >
            <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-500 border-4 ${theme === 'dark' ? 'border-[#050212]' : 'border-white'}`}></div>
            <h3 className={`text-2xl font-bold mb-6 ${headingColor}`}>Achievements & Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "300+ DSA Problems", desc: "Solved 300+ problems across various platforms, demonstrating strong logic.", icon: Code, color: "text-amber-400" },
                { title: "Govt. of India Scholar", desc: "Awarded scholarship for exceptional academic performance for 4 years.", icon: Award, color: "text-rose-400" },
                { title: "100% School Scholarship", desc: "Awarded 100% scholarship for Class 11 & 12 academics.", icon: BookOpen, color: "text-violet-400" },
                { title: "Sports Captain", desc: "Served as Sports Captain (2019–2020), showcasing leadership & discipline.", icon: Trophy, color: "text-fuchsia-400" }
              ].map((ach, i) => (
                <motion.div key={i} whileHover={{ scale: 1.02 }} className={`p-4 rounded-lg border flex items-start gap-3 transition-colors ${cardBg}`}>
                  <ach.icon className={`${ach.color} shrink-0 mt-1`} size={20} />
                  <div>
                    <h4 className={`font-bold ${headingColor}`}>{ach.title}</h4>
                    <p className={`text-sm ${subTextColor}`}>{ach.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

// --- Projects Section ---
const Projects = ({ theme }) => {
  const projects = [
    {
      title: "FocusPad: AI PDF Note Taker",
      description: "Architected a RAG-powered SaaS platform using Next.js and React. Enables users to upload PDFs and generate AI notes via natural language queries. Engineered a RAG pipeline with LangChain and Gemini API for PDF text splitting and vector search.",
      tags: ["Next.js", "React.js", "TypeScript", "RAG", "LangChain", "Gemini API", "ConvexDB", "Clerk"],
      date: "Nov 2025 (Ongoing)",
      preview: "#",
      github: "#",
      color: "from-amber-500 to-rose-500"
    },
    {
      title: "NextDEV: AI Website Generator",
      description: "A full-stack AI-powered SaaS platform enabling one-click website generation. Features inline editing via Tailwind CSS, reducing user editing time by 60%. Integrated authentication and billing with Clerk and Neon.",
      tags: ["Next.js", "React", "TypeScript", "Clerk", "Neon DB", "Drizzle ORM", "AI Agents"],
      date: "Oct 2025",
      preview: "https://nextdev-app.vercel.app/",
      github: "https://github.com/777anishsingh/NextDev",
      color: "from-violet-500 to-fuchsia-500"
    },
    {
      title: "SnapIn: Community Forum",
      description: "Responsive social media forum with real-time interaction. Implemented post creation, clapping, and image uploads via Supabase. Streamlined UI with Tailwind CSS, reducing page load times by 15%.",
      tags: ["React", "TypeScript", "Supabase", "Tailwind CSS", "Realtime DB"],
      date: "June 2025",
      preview: "https://snap-in.vercel.app/",
      github: "https://github.com/777anishsingh/SnapIn",
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "EMS: Employee Management System",
      description: "Created a dashboard for employee task management with a role-based access system. Built core features like task assignment and user permission control using React and Tailwind CSS. Implemented lightweight authentication using localStorage to manage sessions efficiently.",
      tags: ["React.js", "JavaScript", "Tailwind CSS"],
      date: "Nov 2024",
      preview: "https://ems-eight-phi.vercel.app/",
      github: "https://github.com/777anishsingh/EMS",
      color: "from-sky-500 to-blue-600"
    },
    {
      title: "Algorithm Visualizer",
      description: "Designed a visualization tool to demonstrate search and sort algorithms step-by-step. Included interactive UI, time/space complexity insights, and an intuitive multi-tab interface.",
      tags: ["HTML5", "CSS3", "JavaScript", "Algorithms"],
      date: "Sep 2024",
      preview: "https://algorithm-visualizer-anish.netlify.app/",
      github: "https://github.com/777anishsingh/algorithm-Visualizer",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const scrollRef = useRef(null);

  const bgClass = theme === 'dark' ? 'bg-[#030014]' : 'bg-slate-50';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subTextColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const cardBg = theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-white border-slate-200 hover:border-violet-200';
  const tagClass = theme === 'dark' ? 'bg-black/40 text-slate-300 border-white/10' : 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <Section id="projects" className={bgClass}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${headingColor}`}>
          <span className="border-b-4 border-fuchsia-500 pb-2">Featured Projects</span>
        </h2>
        <p className={`text-center mb-12 max-w-2xl mx-auto ${subTextColor}`}>
          Here are some of the technical projects I've built, showcasing my expertise in Full Stack Development and AI integration.
        </p>

        {/* Horizontal Scroll Container - Hidden Scrollbar */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto pb-12 gap-8 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ scrollBehavior: 'smooth' }}
        >
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`min-w-[320px] md:min-w-[450px] snap-center group relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col shadow-lg ${cardBg}`}
            >
              {/* Decorative Header Gradient */}
              <div className={`h-2 w-full bg-gradient-to-r ${project.color}`}></div>

              <div className="p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-2xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-fuchsia-500 group-hover:to-violet-500 transition-all ${headingColor}`}>
                    {project.title}
                  </h3>
                  <motion.a
                    whileHover={{ scale: 1.2, rotate: 45 }}
                    href={project.preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${subTextColor} hover:text-fuchsia-500 transition-colors`}
                  >
                    <ExternalLink size={20} />
                  </motion.a>
                </div>

                <p className={`${subTextColor} mb-6 leading-relaxed text-sm md:text-base`}>
                  {project.description}
                </p>

                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className={`text-xs font-medium px-2 py-1 rounded border whitespace-nowrap ${tagClass}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className={`flex items-center justify-between text-sm font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span>{project.date}</span>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 group-hover:text-fuchsia-500 transition-colors cursor-pointer"
                    >
                      View Code <Github size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

// --- Contact Section ---
const Contact = ({ theme }) => {
  const bgGradient = theme === 'dark'
    ? 'from-[#030014] to-[#0a0520]'
    : 'from-slate-50 to-slate-100';

  const headingColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subTextColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const btnSecondary = theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200';
  const borderTop = theme === 'dark' ? 'border-white/10' : 'border-slate-200';

  return (
    <Section id="contact" className={`bg-gradient-to-b pb-32 ${bgGradient}`}>
      <div className="max-w-4xl mx-auto text-center px-4">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className={`text-3xl md:text-4xl font-bold mb-8 ${headingColor}`}
        >
          Let's Work Together
        </motion.h2>
        <p className={`text-xl mb-12 max-w-2xl mx-auto ${subTextColor}`}>
          I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:777anish.singh@gmail.com"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-fuchsia-500/20"
          >
            <Mail size={20} />
            Say Hello
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://drive.google.com/file/d/1HZ2lEsBZIhqybdqVOaPM0CU0G3h2eWOw/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold border transition-all ${btnSecondary}`}
          >
            <Download size={20} />
            Download Resume
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-12 ${subTextColor} ${borderTop}`}
        >
          <div className="flex flex-col items-center gap-2">
            <Phone className="text-violet-400 mb-2" size={24} />
            <span className={`font-semibold ${headingColor}`}>Phone</span>
            <span>+91 9501377424</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MapPin className="text-fuchsia-400 mb-2" size={24} />
            <span className={`font-semibold ${headingColor}`}>Location</span>
            <span>Chandigarh, India</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Mail className="text-emerald-400 mb-2" size={24} />
            <span className={`font-semibold ${headingColor}`}>Email</span>
            <span>777anish.singh@gmail.com</span>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

// --- Footer ---
const Footer = ({ theme }) => {
  const bgClass = theme === 'dark' ? 'bg-[#0a0520] border-white/5' : 'bg-slate-100 border-slate-200';
  const textColor = theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-900';

  return (
    <footer className={`py-8 text-center border-t ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">
          © 2025 Anish Singh Butola. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="https://github.com/777anishsingh" target="_blank" rel="noopener noreferrer" className={`transition-colors ${textColor}`}><Github size={18} /></a>
          <a href="https://www.linkedin.com/in/777anishsingh/" target="_blank" rel="noopener noreferrer" className={`transition-colors ${textColor}`}><Linkedin size={18} /></a>
        </div>
      </div>
    </footer>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  // Initialize theme state (default to dark)
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Active section tracking for navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'experience', 'projects', 'contact'];
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= (element.offsetTop - 200)) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <TerminalLoader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className={`min-h-screen font-sans cursor-none transition-colors duration-300 ${theme === 'dark' ? 'bg-[#030014] text-slate-200 selection:bg-fuchsia-500/30' : 'bg-slate-50 text-slate-900 selection:bg-violet-500/20'}`}>
          <CustomCursor theme={theme} />

          <Navbar activeSection={activeSection} theme={theme} toggleTheme={toggleTheme} />
          <Hero theme={theme} />
          <div id="about"></div> {/* Anchor for scroll */}
          <Skills theme={theme} />
          <Experience theme={theme} />
          <Projects theme={theme} />
          <Contact theme={theme} />
          <Footer theme={theme} />
        </div>
      )}
    </>
  );
}