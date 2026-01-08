import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import MarkdownEditor from "@/components/MarkdownEditor";
import PasswordDialog from "@/components/PasswordDialog";
import { ArrowLeft, Loader2, Trash2, Lock, Send } from "lucide-react";
import { toast } from "sonner";
import { useEditPassword } from "@/_core/hooks/useEditPassword";

export default function ArticleEdit() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { isVerified, verify, canPublish, getPassword, isPublishVerified, verifyPublish, getPublishPassword } = useEditPassword();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [passwordDialogType, setPasswordDialogType] = useState<"edit" | "publish">("edit");

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
      toast.success("Article updated successfully");
      navigate(`/articles/${formData.slug}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update article");
    },
  });

  // 删除文章
  const deleteMutation = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("Article deleted successfully");
      navigate("/blog");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete article");
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
    if (!isVerified) {
      setPasswordDialogType("edit");
      setShowPasswordDialog(true);
      return;
    }

    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // 如果要发布，需要发布密码验证
    if (formData.status === "published" && !canPublish) {
      setPasswordDialogType("publish");
      setShowPublishDialog(true);
      return;
    }

    const password = getPassword();
    const saveData = {
      id: id!,
      ...formData,
      password: password || undefined,
    };

    setIsSaving(true);
    try {
      await updateMutation.mutateAsync(saveData);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!isVerified) {
      setPasswordDialogType("edit");
      setShowPasswordDialog(true);
      return;
    }

    if (!canPublish) {
      setPasswordDialogType("publish");
      setShowPublishDialog(true);
      return;
    }

    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const password = getPassword();
    const publishData = {
      id: id!,
      ...formData,
      status: "published" as const,
      password: password || undefined,
    };

    setIsSaving(true);
    try {
      await updateMutation.mutateAsync(publishData);
      toast.success("Article published successfully!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!isVerified) {
      setPasswordDialogType("edit");
      setShowPasswordDialog(true);
      return;
    }

    if (confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      const password = getPassword();
      deleteMutation.mutate({ id: id!, password: password || undefined });
    }
  };

  const handlePasswordVerify = (password: string) => {
    if (verify(password)) {
      setShowPasswordDialog(false);
      toast.success("Password verified! You can now edit.");
    } else {
      toast.error("Incorrect password");
    }
  };

  const handlePublishPasswordVerify = (password: string) => {
    if (verifyPublish(password)) {
      setShowPublishDialog(false);
      toast.success("Publish password verified! You can now publish.");
    } else {
      toast.error("Incorrect publish password");
    }
  };

  // 加载中
  if (isLoadingArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  // 文章未找到
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Button onClick={() => navigate("/blog")}>Back to blog</Button>
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
              <h1 className="text-3xl font-bold mb-2">Password Required</h1>
              <p className="text-foreground/60 mb-6">
                This article is password protected. Enter the password to edit.
              </p>
              <Button 
                onClick={() => {
                  setPasswordDialogType("edit");
                  setShowPasswordDialog(true);
                }}
                size="lg"
              >
                Enter Password
              </Button>
            </div>
          </Card>
        </div>

        <PasswordDialog
          isOpen={showPasswordDialog}
          onVerify={handlePasswordVerify}
          onClose={() => setShowPasswordDialog(false)}
          title="Edit Password"
          description="Enter the password to edit this article"
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
            onClick={() => navigate(`/articles/${formData.slug}`)}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Article</h1>
        </div>

        {/* Form */}
        <Card className="p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Article title"
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
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Article excerpt"
              rows={3}
              className="w-full"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <MarkdownEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Write your article in Markdown..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
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
                placeholder="Add tags, press Enter to confirm"
                className="flex-1"
              />
              <Button onClick={handleAddTag} variant="outline">
                Add
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
            <label className="block text-sm font-medium mb-2">Status</label>
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
                <span>Draft</span>
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
                  disabled={!canPublish}
                  className="w-4 h-4 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className={!canPublish ? "opacity-50" : ""}>
                  Published {!canPublish && "(需要发布密码)"}
                </span>
              </label>
            </div>
            {!canPublish && (
              <p className="text-sm text-muted-foreground mt-2">
                需要输入发布密码才能发布文章。点击下方"发布"按钮输入发布密码。
              </p>
            )}
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
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            {formData.status === "draft" && (
              <Button
                onClick={handlePublish}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Publish
                  </>
                )}
              </Button>
            )}
            <Button
              onClick={() => navigate(`/articles/${formData.slug}`)}
              variant="outline"
              className="flex-1"
            >
              Cancel
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
              Delete
            </Button>
          </div>
        </Card>
      </div>

      {/* Edit Password Dialog */}
      <PasswordDialog
        isOpen={showPasswordDialog}
        onVerify={handlePasswordVerify}
        onClose={() => setShowPasswordDialog(false)}
        title="Edit Password"
        description="Enter the password to edit this article"
      />

      {/* Publish Password Dialog */}
      <PasswordDialog
        isOpen={showPublishDialog}
        onVerify={handlePublishPasswordVerify}
        onClose={() => setShowPublishDialog(false)}
        title="Publish Password"
        description="Enter the publish password to publish this article"
      />
    </div>
  );
}
