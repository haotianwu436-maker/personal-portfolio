import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Edit } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function ArticleDetail() {
  const [, params] = useRoute("/articles/:slug");
  const [, navigate] = useLocation();

  const { data: article, isLoading, error } = trpc.articles.getBySlug.useQuery(
    { slug: params?.slug || "" },
    { enabled: !!params?.slug }
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif mb-4">文章未找到</h1>
          <Button onClick={() => navigate("/blog")} className="mt-4">
            返回博客
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 py-4">
        <div className="container flex items-center gap-4">
          <button
            onClick={() => navigate("/blog")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="返回博客"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm text-muted-foreground">返回博客</span>
        </div>
      </header>

      <main>
        {/* Article Header */}
        <section className="py-16 md:py-24">
          <div className="container max-w-2xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl md:text-5xl font-serif">
                {article.title}
              </h1>
              <Button onClick={() => navigate(`/articles/${article.id}/edit`)} size="sm">
                <Edit size={16} className="mr-2" />
                编辑
              </Button>
            </div>

              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <time dateTime={article.publishedAt?.toString()}>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })
                      : "未发布"}
                  </time>
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div className="flex gap-2">
                    {article.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-secondary rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xl text-muted-foreground font-light leading-relaxed mt-6">
                {article.excerpt}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container max-w-2xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="prose prose-invert max-w-none"
            >
              <Streamdown>{article.content}</Streamdown>
            </motion.div>
          </div>
        </section>

        {/* Back to Blog CTA */}
        <section className="py-16 md:py-24">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-muted-foreground mb-6">想看更多想法？</p>
              <Button
                onClick={() => navigate("/blog")}
                className="rounded-full px-8 py-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                返回所有文章
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
