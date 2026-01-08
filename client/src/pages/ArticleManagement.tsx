import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Lock, Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";


export default function ArticleManagement() {
  const [, navigate] = useLocation();
  const { user, loading: isAuthLoading } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 获取所有文章（包括草稿）
  const { data: articles = [], isLoading: isLoadingArticles, refetch } = trpc.articles.list.useQuery(
    undefined,
    { enabled: !!user }
  );

  // 删除文章
  const deleteMutation = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("文章已删除");
      setSelectedIds([]);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "删除失败");
    },
  });

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("请选择至少一篇文章");
      return;
    }

    if (confirm(`确定要删除 ${selectedIds.length} 篇文章吗？此操作无法撤销。`)) {
      selectedIds.forEach((id) => {
        deleteMutation.mutate({ id });
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === articles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(articles.map((a) => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 加载中
  if (isAuthLoading || isLoadingArticles) {
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
                只有网站所有者才能管理文章。请先登录。
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

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={16} className="mr-2" />
              返回
            </Button>
            <h1 className="text-3xl font-bold">文章管理</h1>
          </div>
          <Button onClick={() => navigate("/admin/articles/create")} className="gap-2">
            <Plus size={16} />
            新建文章
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-3xl font-bold">{articles.length}</div>
            <div className="text-sm text-foreground/60">总文章数</div>
          </Card>
          <Card className="p-6">
            <div className="text-3xl font-bold">
              {articles.filter((a) => a.status === "published").length}
            </div>
            <div className="text-sm text-foreground/60">已发布</div>
          </Card>
          <Card className="p-6">
            <div className="text-3xl font-bold">
              {articles.filter((a) => a.status === "draft").length}
            </div>
            <div className="text-sm text-foreground/60">草稿</div>
          </Card>
        </div>

        {/* Toolbar */}
        {selectedIds.length > 0 && (
          <div className="mb-4 p-4 bg-primary/10 rounded-lg flex items-center justify-between">
            <span className="text-sm">
              已选择 <strong>{selectedIds.length}</strong> 篇文章
            </span>
            <Button
              onClick={handleBatchDelete}
              variant="destructive"
              size="sm"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  删除中...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  批量删除
                </>
              )}
            </Button>
          </div>
        )}

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-foreground/5 border-b">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === articles.length && articles.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium">标题</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">发布时间</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-foreground/60">
                      还没有文章。<Button
                        variant="link"
                        onClick={() => navigate("/admin/articles/create")}
                      >
                        创建第一篇
                      </Button>
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.id} className="border-b hover:bg-foreground/5">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(article.id)}
                          onChange={() => toggleSelect(article.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{article.title}</div>
                          <div className="text-sm text-foreground/60">{article.slug}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {article.status === "published" ? (
                            <>
                              <Eye size={16} className="text-green-600" />
                              <span className="text-sm">已发布</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={16} className="text-foreground/40" />
                              <span className="text-sm">草稿</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString("zh-CN")
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm("确定要删除这篇文章吗？")) {
                                deleteMutation.mutate({ id: article.id });
                              }
                            }}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
