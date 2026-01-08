import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Mail, Instagram, Twitter, Send } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import LatestArticles from "@/components/LatestArticles";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { toast } from "sonner";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const [, navigate] = useLocation();
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      {/* Navigation / Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/80 backdrop-blur-md py-4 border-b border-border/40" : "py-8 bg-transparent"}`}>
        <div className="container flex justify-between items-center">
          <span className="font-serif text-lg font-medium tracking-tight">Personal Portfolio</span>
          <nav className="hidden md:flex gap-8 text-sm text-muted-foreground items-center">
            <button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">{t.nav.about}</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-primary transition-colors">{t.nav.projects}</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">{t.nav.contact}</button>
            <div className="w-px h-4 bg-border/40"></div>
            <LanguageToggle />
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{t.nav.loggedIn}</span>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/admin/articles')}
                  className="text-xs"
                >
                  {t.nav.manage}
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={logout}
                  className="text-xs"
                >
                  {t.nav.logout}
                </Button>
              </div>
            ) : (
              <Button 
                size="sm"
                onClick={() => navigate('/login')}
                className="text-xs"
              >
                {t.nav.login}
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center relative section-padding pt-32">
          <div className="absolute inset-0 -z-10 opacity-30">
             <img src="/images/hero-bg.jpg" alt="Background Texture" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background"></div>
          </div>
          
          <div className="container">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif font-light leading-[1.1] mb-6 whitespace-pre-line">
                {t.hero.title}
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground font-light mb-12 max-w-lg">
                {t.hero.subtitle}
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex gap-4">
                <Button 
                  onClick={() => scrollToSection('projects')}
                  className="rounded-full px-8 py-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                >
                  {t.hero.viewProjects}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => scrollToSection('contact')}
                  className="rounded-full px-8 py-6 text-base border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300"
                >
                  {t.hero.contactMe}
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/50"
          >
            <ArrowDown size={24} />
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="section-padding bg-secondary/30">
          <div className="container">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="max-w-2xl mx-auto"
            >
              <motion.span variants={fadeInUp} className="text-sm font-medium text-primary tracking-widest uppercase mb-4 block">{t.about.subtitle}</motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl mb-12">{t.about.title}</motion.h2>
              
              <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
                <motion.p variants={fadeInUp}>
                  {t.about.paragraph1}
                </motion.p>
                <motion.p variants={fadeInUp}>
                  {t.about.paragraph2}
                </motion.p>
                <motion.p variants={fadeInUp}>
                  {t.about.paragraph3}
                </motion.p>
              </div>

              <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap gap-3">
                {t.about.tags.map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full bg-background border border-border text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section-padding">
          <div className="container">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-16 md:mb-24"
            >
              <span className="text-sm font-medium text-primary tracking-widest uppercase mb-4 block">{t.projects.subtitle}</span>
              <h2 className="text-3xl md:text-4xl">{t.projects.title}</h2>
            </motion.div>

            <div className="space-y-24 md:space-y-32">
              <ProjectsList />
            </div>
          </div>
        </section>

        {/* Latest Articles Section */}
        <LatestArticles />

        {/* Contact Section */}
        <section id="contact" className="section-padding">
          <div className="container max-w-3xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif mb-8">{t.contact.title}</motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground font-light mb-12 whitespace-pre-line">
                {t.contact.subtitle}
              </motion.p>
              
              {/* Contact Info */}
              <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-16">
                <a 
                  href="mailto:haotianwu436@gmail.com" 
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="p-3 rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Mail size={20} />
                  </div>
                  <span className="font-light">haotianwu436@gmail.com</span>
                </a>
                <a 
                  href="https://instagram.com/dlxbxy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="p-3 rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Instagram size={20} />
                  </div>
                  <span className="font-light">@dlxbxy</span>
                </a>
                <a 
                  href="https://x.com/dlxbxy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="p-3 rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Twitter size={20} />
                  </div>
                  <span className="font-light">@dlxbxy</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Message Form */}
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground/60 border-t border-border/40">
        <p>{t.footer.text}</p>
      </footer>
    </div>
  );
}

function ProjectsList() {
  const [, navigate] = useLocation();
  const { data: projects = [] } = trpc.projects.list.useQuery();

  return (
    <>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.title}
          role={project.role}
          description={project.description}
          tags={project.tags}
          image={project.image}
          align={index % 2 === 0 ? "right" : "left"}
          onLearnMore={() => navigate(`/projects/${project.id}`)}
        />
      ))}
    </>
  );
}

function ProjectCard({ id, title, role, description, tags, image, align = "left", onLearnMore }: { 
  id: string,
  title: string, 
  role: string, 
  description: string, 
  tags: string[], 
  image: string,
  align?: "left" | "right",
  onLearnMore?: () => void
}) {
  const { t } = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${align === "right" ? "md:flex-row-reverse" : ""}`}
    >
      <div className="w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded-sm bg-secondary relative group">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0" 
        />
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      <div className="w-full md:w-1/2 space-y-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-serif mb-2">{title}</h3>
          <p className="text-sm text-primary font-medium uppercase tracking-wider">{role}</p>
        </div>
        
        <p className="text-muted-foreground leading-relaxed text-lg font-light">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="text-xs text-muted-foreground/80 border border-border px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 group" onClick={onLearnMore}>
          {t.projects.viewDetails} <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}

function ContactForm() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast.success(t.contact.success);
    },
    onError: (error) => {
      toast.error(t.contact.error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await contactMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary/50 rounded-2xl p-8 md:p-12 text-center"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send size={24} className="text-primary" />
        </div>
        <h3 className="text-2xl font-serif mb-4">{t.contact.success}</h3>
        <p className="text-muted-foreground font-light mb-6">
          {language === "zh" ? "感谢你的留言，我会尽快回复你。" : "Thank you for your message. I'll get back to you soon."}
        </p>
        <Button 
          variant="outline" 
          onClick={() => setSubmitted(false)}
          className="rounded-full"
        >
          {language === "zh" ? "发送另一条消息" : "Send Another Message"}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-secondary/50 rounded-2xl p-8 md:p-12"
    >
      <h3 className="text-2xl font-serif mb-2 text-center">{language === "zh" ? "给我留言" : "Leave a Message"}</h3>
      <p className="text-muted-foreground font-light mb-8 text-center">
        {language === "zh" ? "有任何想法或合作意向，欢迎留言" : "Feel free to leave a message if you have any ideas or collaboration intentions"}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">{t.contact.name} *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder={language === "zh" ? "你的名字" : "Your name"}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t.contact.email} *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">{language === "zh" ? "主题" : "Subject"}</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder={language === "zh" ? "你想聊什么？" : "What would you like to discuss?"}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">{t.contact.message} *</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={5}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            placeholder={language === "zh" ? "写下你的想法..." : "Write your thoughts..."}
            required
          />
        </div>
        
        <div className="text-center">
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="rounded-full px-12 py-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30"
          >
            {isSubmitting ? t.contact.sending : t.contact.send}
            <Send size={16} className="ml-2" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
