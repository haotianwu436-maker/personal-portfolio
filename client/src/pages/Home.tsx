import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Mail, Github, Twitter } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

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
          <nav className="hidden md:flex gap-8 text-sm text-muted-foreground">
            <button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">About</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-primary transition-colors">Projects</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">Contact</button>
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
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif font-light leading-[1.1] mb-6">
                半梦半醒<br />
                <span className="italic text-primary/90">永远年轻</span>，<br />
                永远热泪盈眶
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground font-light mb-12 max-w-lg">
                我在做社区、文化与技术之间的连接
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex gap-4">
                <Button 
                  onClick={() => scrollToSection('projects')}
                  className="rounded-full px-8 py-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                >
                  查看项目
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => scrollToSection('contact')}
                  className="rounded-full px-8 py-6 text-base border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300"
                >
                  联系我
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
              <motion.span variants={fadeInUp} className="text-sm font-medium text-primary tracking-widest uppercase mb-4 block">About Me</motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl mb-12">关于我</motion.h2>
              
              <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
                <motion.p variants={fadeInUp}>
                  我关注人与人之间的连接，相信微小的善意可以汇聚成巨大的能量。
                </motion.p>
                <motion.p variants={fadeInUp}>
                  我做项目，但更在意过程中的“人”与“温度”，技术是实现方式，而非目的。
                </motion.p>
                <motion.p variants={fadeInUp}>
                  我相信社区、文化与技术可以共存，并致力于探索它们之间有机结合的可能性。
                </motion.p>
              </div>

              <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap gap-3">
                {["社区", "文化", "区块链", "实验性项目", "长期主义"].map((tag) => (
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
              <span className="text-sm font-medium text-primary tracking-widest uppercase mb-4 block">Selected Works</span>
              <h2 className="text-3xl md:text-4xl">我的实践</h2>
            </motion.div>

            <div className="space-y-24 md:space-y-32">
              <ProjectsList />
            </div>
          </div>
        </section>

        {/* Writing / Thoughts Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl font-serif mb-4">一些想法</h2>
              <p className="text-muted-foreground mb-8 font-light">关于社区、文化与技术的思考与记录</p>
              <Button 
                onClick={() => navigate("/blog")}
                className="rounded-full px-8 py-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                阅读所有文章 <ArrowUpRight size={16} className="ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section-padding">
          <div className="container max-w-2xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif mb-8">Let's Connect</motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground font-light mb-12">
                如果你对社区、文化或长期建设感兴趣，<br/>欢迎联系我，一同探索更多可能。
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex justify-center gap-8">
                <a href="#" className="p-4 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group">
                  <Mail size={24} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="p-4 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group">
                  <Github size={24} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="p-4 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group">
                  <Twitter size={24} className="group-hover:scale-110 transition-transform" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground/60 border-t border-border/40">
        <p>Built slowly, with care.</p>
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
          了解更多 <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
