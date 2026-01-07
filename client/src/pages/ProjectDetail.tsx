import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { getProjectById } from "@/data/projects";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const [, navigate] = useLocation();

  const project = params ? getProjectById(params.id) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif mb-4">项目未找到</h1>
          <Button onClick={() => navigate("/")} className="mt-4">
            返回主页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 py-4">
        <div className="container flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="返回主页"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm text-muted-foreground">返回主页</span>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="section-padding pt-12">
          <div className="container">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-serif mb-4">{project.title}</h1>
              <p className="text-xl text-muted-foreground font-light mb-6">{project.subtitle}</p>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">我的角色</p>
                  <p className="text-lg">{project.role}</p>
                </div>
                <div>
                  <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">关键词</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-secondary rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Project Image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full aspect-[16/9] overflow-hidden rounded-sm bg-secondary mb-16 group"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0"
              />
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container max-w-2xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="prose prose-invert max-w-none"
            >
              <div className="space-y-8 text-lg text-muted-foreground font-light leading-relaxed">
                {project.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="section-padding">
          <div className="container max-w-2xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-2xl md:text-3xl font-serif mb-8">核心成果</h2>
              <div className="space-y-4">
                {project.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-secondary/50 rounded-sm"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container max-w-2xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-2xl md:text-3xl font-serif mb-6">项目影响</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                {project.impact}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Learnings Section */}
        <section className="section-padding">
          <div className="container max-w-2xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-2xl md:text-3xl font-serif mb-8">主要收获</h2>
              <div className="space-y-6">
                {project.learnings.map((learning, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-2 border-primary pl-6 py-2"
                  >
                    <p className="text-muted-foreground font-light text-lg">
                      {learning}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Back to Home CTA */}
        <section className="section-padding bg-secondary/30">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-muted-foreground mb-6">想了解更多项目？</p>
              <Button
                onClick={() => navigate("/#projects")}
                className="rounded-full px-8 py-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                查看所有项目
              </Button>
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
