import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function LatestArticles() {
  const [, navigate] = useLocation();
  const { data: articles = [] } = trpc.articles.list.useQuery();

  // Get the 3 most recent published articles
  const latestArticles = articles
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
    .slice(0, 3);

  if (latestArticles.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-16 md:mb-24"
        >
          <span className="text-sm font-medium text-primary tracking-widest uppercase mb-4 block">
            一些想法
          </span>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl md:text-4xl">最新文章</h2>
            <Button
              onClick={() => navigate("/blog")}
              variant="link"
              className="text-primary hover:text-primary/80"
            >
              查看全部 <ArrowUpRight size={16} className="ml-2" />
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              onClick={() => navigate(`/articles/${article.slug}`)}
              className="group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 transform"
                  />
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <time className="text-xs text-muted-foreground">
                    {new Date(article.publishedAt || 0).toLocaleDateString('zh-CN')}
                  </time>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex gap-1">
                      {article.tags.slice(0, 2).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-background rounded-full text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
