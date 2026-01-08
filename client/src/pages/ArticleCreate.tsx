import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import MarkdownEditor from "@/components/MarkdownEditor";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { useEditPassword } from "@/_core/hooks/useEditPassword";
import PasswordDialog from "@/components/PasswordDialog";

export default function ArticleCreate() {
  const [, navigate] = useLocation();
  const { user, loading: isAuthLoading } = useAuth();
  const { isVerified, verify, getPassword } = useEditPassword();
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published",
  });

  const [tagInput, setTagInput] = useState("");

  // 创建文章
  const createMutation = trpc.articles.create.useMutation({
    onSuccess: (result) => {
      toast.success("文章已创建");
      navigate(`/articles/${formData.slug}`);
    },
    onError: (error) => {
      toast.error(error.message || "创建失败");
    },
  });

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
    if (!isVerified) {
      setShowPasswordDialog(true);
      return;
    }

    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      toast.error("请填写所有必填字段");
      return;
    }

    const password = getPassword();
    const saveData = {
      ...formData,
      password: password || undefined,
    };

    setIsSaving(true);
    try {
      await createMutation.mutateAsync(saveData);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordVerify = (password: string) => {
    if (verify(password)) {
      setShowPasswordDialog(false);
      toast.success("密码验证成功！");
    } else {
      toast.error("密码不正确");
    }
  };

  // 加载中
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  // 未登录
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="container max-w-2xl">
          <Card className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <Lock size={48} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">需要登录</h1>
              <p className="text-foreground/60 mb-6">
                只有网站所有者才能创建文章。请先登录。
              </p>
              <Button onClick={() => navigate("/")}>
                返回首页
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 未验证密码
  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="container max-w-2xl">
          <Card className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <Lock size={48} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">需要密码验证</h1>
              <p className="text-foreground/60 mb-6">
                创建文章需要输入编辑密码。
              </p>
              <Button 
                onClick={() => setShowPasswordDialog(true)}
                size="lg"
              >
                输入密码
              </Button>
            </div>
          </Card>
        </div>

        <PasswordDialog
          isOpen={showPasswordDialog}
          onVerify={handlePasswordVerify}
          onClose={() => setShowPasswordDialog(false)}
          title="编辑密码"
          description="输入密码以创建文章"
        />
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
            onClick={() => navigate("/blog")}
          >
            <ArrowLeft size={16} className="mr-2" />
            返回
          </Button>
          <h1 className="text-3xl font-bold">创建新文章</h1>
        </div>

        {/* Form */}
        <Card className="p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">标题 *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="文章标题"
              className="w-full"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-2">URL Slug *</label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="article-slug"
              className="w-full"
            />
            <p className="text-sm text-foreground/60 mt-1">
              用于URL中的唯一标识符，只能包含字母、数字和连字符
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-2">摘要 *</label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="文章摘要（会显示在列表中）"
              rows={3}
              className="w-full"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">内容 *</label>
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
            <p className="text-sm text-foreground/60 mt-2">
              选择"草稿"来保存文章但不发布，选择"已发布"来立即发布文章
            </p>
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
                  创建中...
                </>
              ) : (
                "创建文章"
              )}
            </Button>
            <Button
              onClick={() => navigate("/blog")}
              variant="outline"
              className="flex-1"
            >
              取消
            </Button>
          </div>
        </Card>

        <PasswordDialog
          isOpen={showPasswordDialog}
          onVerify={handlePasswordVerify}
          onClose={() => setShowPasswordDialog(false)}
          title="编辑密码"
          description="输入密码以创建文章"
        />

        {/* Help Text */}
        <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/10">
          <h3 className="font-medium mb-2">提示</h3>
          <ul className="text-sm text-foreground/70 space-y-1">
            <li>• 标题、Slug和内容是必填的</li>
            <li>• Slug必须是唯一的，用于生成文章URL</li>
            <li>• 支持Markdown格式编写内容</li>
            <li>• 可以添加多个标签来分类文章</li>
            <li>• 草稿文章只有你能看到</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
