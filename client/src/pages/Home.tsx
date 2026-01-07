import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Mail, Github, Twitter } from "lucide-react";
import { useEffect, useState } from "react";

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
              {/* Project 1 */}
              <ProjectCard 
                title="拼团社区项目"
                role="社区发起 / 组织 / 产品与运营协调"
                description="一个基于线下与线上结合的拼团社区实验，关注信任、协作与真实关系的建立。"
                tags={["社区实验", "信任", "在地化"]}
                image="/images/project-community.jpg"
                align="right"
              />
              
              {/* Project 2 */}
              <ProjectCard 
                title="风水文化项目"
                role="内容策划 / 文化转译 / 社群搭建"
                description="尝试用现代方式重新理解与表达传统风水与东方文化，让它回到“生活智慧”本身。"
                tags={["东方文化", "现代转译", "生活美学"]}
                image="/images/project-fengshui.jpg"
                align="left"
              />

              {/* Project 3 */}
              <ProjectCard 
                title="区块链社区项目"
                role="社区建设 / 活动组织 / 对外合作"
                description="围绕区块链与 Web3 的学习型社区，重点不在投机，而在共识、协作与长期建设。"
                tags={["学习型社区", "共识", "长期主义"]}
                image="/images/project-blockchain.jpg"
                align="right"
              />
            </div>
          </div>
        </section>

        {/* Writing / Thoughts Placeholder */}
        <section className="section-padding bg-secondary/30">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl font-serif mb-4">一些想法 / 一些记录</h2>
              <p className="text-muted-foreground italic">正在整理中，敬请期待...</p>
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

function ProjectCard({ title, role, description, tags, image, align = "left" }: { 
  title: string, 
  role: string, 
  description: string, 
  tags: string[], 
  image: string,
  align?: "left" | "right" 
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

        <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 group">
          了解更多 <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
