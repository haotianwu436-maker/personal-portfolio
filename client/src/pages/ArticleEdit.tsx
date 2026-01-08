import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import MarkdownEditor from "@/components/MarkdownEditor";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ArticleEdit() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published",
  });

  const [tagInput, setTagInput] = useState("");

  // 获取文章数据
  const { data: article, isLoading: isLoadingArticle } = trpc.articles.getById.useQuery(
    { id: id! },
    { enabled: !!id }
  );

  // 更新文章
  const updateMutation = trpc.articles.update.useMutation({
    onSuccess: () => {
      toast.success("文章已更新");
      navigate(`/articles/${formData.slug}`);
    },
    onError: (error) => {
      toast.error(error.message || "更新失败");
    },
  });

  // 删除文章
  const deleteMutation = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("文章已删除");
      navigate("/blog");
    },
    onError: (error) => {
      toast.error(error.message || "删除失败");
    },
  });

  // 加载文章数据
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        tags: article.tags || [],
        status: article.status as "draft" | "published",
      });
    }
  }, [article]);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      toast.error("请填写所有必填字段");
      return;
    }

    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        id: id!,
        ...formData,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (confirm("确定要删除这篇文章吗？此操作无法撤销。")) {
      deleteMutation.mutate({ id: id! });
    }
  };

  if (isLoadingArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">文章未找到</h1>
          <Button onClick={() => navigate("/blog")}>返回博客</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/articles/${formData.slug}`)}
          >
            <ArrowLeft size={16} className="mr-2" />
            返回
          </Button>
          <h1 className="text-3xl font-bold">编辑文章</h1>
        </div>

        {/* Form */}
        <Card className="p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">标题</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="文章标题"
              className="w-full"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-2">URL Slug</label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="article-slug"
              className="w-full"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2">摘要</label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="文章摘要"
              rows={3}
              className="w-full"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">内容</label>
            <MarkdownEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="用 Markdown 编写文章内容..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">标签</label>
            <div className="flex gap-2 mb-3">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="添加标签，按 Enter 确认"
                className="flex-1"
              />
              <Button onClick={handleAddTag} variant="outline">
                添加
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-primary/80"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">状态</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === "draft"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "draft" | "published",
                    })
                  }
                  className="w-4 h-4"
                />
                <span>草稿</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={formData.status === "published"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "draft" | "published",
                    })
                  }
                  className="w-4 h-4"
                />
                <span>已发布</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  保存中...
                </>
              ) : (
                "保存更改"
              )}
            </Button>
            <Button
              onClick={() => navigate(`/articles/${formData.slug}`)}
              variant="outline"
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <Trash2 size={16} className="mr-2" />
              )}
              删除
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
