import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Edit2 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useEditPassword } from "@/_core/hooks/useEditPassword";
import PasswordDialog from "@/components/PasswordDialog";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function Blog() {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const { isVerified, verify } = useEditPassword();
  const { data: articles = [], isLoading } = trpc.articles.list.useQuery();

  const handleEditClick = (articleId: string) => {
    if (isVerified) {
      navigate(`/articles/${articleId}/edit`);
    } else {
      setSelectedArticleId(articleId);
      setShowPasswordDialog(true);
    }
  };

  const handlePasswordVerify = (password: string) => {
    if (verify(password)) {
      setShowPasswordDialog(false);
      if (selectedArticleId) {
        navigate(`/articles/${selectedArticleId}/edit`);
      }
    } else {
      throw new Error("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 py-4">
        <div className="container flex justify-between items-center">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            ← {t.common.back}
          </Button>
          <span className="font-serif text-lg font-medium tracking-tight">
            {t.articles.title}
          </span>
          <div className="w-16" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <section className="container max-w-3xl mx-auto px-4 md:px-0">
          {/* Title */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-serif mb-4">{t.articles.title}</h1>
            <p className="text-lg text-muted-foreground font-light">
              {t.articles.subtitle}
            </p>
          </motion.div>

          {/* Articles List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t.common.loading}</p>
            </div>
          ) : articles.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center py-12"
            >
              <p className="text-muted-foreground mb-6">
                {t.blog.noArticles}
              </p>
              <p className="text-sm text-muted-foreground/60">
                Built slowly, with care.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {articles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/articles/${article.slug}`)}
                >
                  <div className="pb-8 border-b border-border/40 hover:border-border/60 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="text-2xl md:text-3xl font-serif group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(article.id);
                          }}
                          className="gap-1"
                        >
                          <Edit2 size={16} />
                          {t.common.edit}
                        </Button>
                        <ArrowUpRight
                          size={20}
                          className="text-primary flex-shrink-0 mt-1"
                        />
                      </div>
                    </div>

                    <p className="text-muted-foreground font-light mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <time dateTime={article.publishedAt?.toString()}>
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString(
                                language === "zh" ? "zh-CN" : "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                }
                              )
                            : language === "zh" ? "未发布" : "Unpublished"}
                        </time>
                      </div>

                      {article.tags && article.tags.length > 0 && (
                        <div className="flex gap-2">
                          {article.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-secondary/50 rounded-full"
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
          )}
        </section>
      </main>

      <PasswordDialog
        isOpen={showPasswordDialog}
        onVerify={handlePasswordVerify}
        onClose={() => setShowPasswordDialog(false)}
        title="Edit Password"
        description="Enter the password to edit articles"
      />

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground/60 border-t border-border/40">
        <p>Built slowly, with care.</p>
      </footer>
    </div>
  );
}
