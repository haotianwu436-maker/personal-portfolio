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

export default function ProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    role: "",
    content: "",
    highlights: [] as string[],
    learnings: [] as string[],
    tags: [] as string[],
  });

  const [highlightInput, setHighlightInput] = useState("");
  const [learningInput, setLearningInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // 获取项目数据
  const { data: project, isLoading: isLoadingProject } = trpc.projects.getById.useQuery(
    { id: id! },
    { enabled: !!id }
  );

  // 更新项目
  const updateMutation = trpc.projects.update.useMutation({
    onSuccess: () => {
      toast.success("项目已更新");
      navigate(`/projects/${id}`);
    },
    onError: (error) => {
      toast.error(error.message || "更新失败");
    },
  });

  // 删除项目
  const deleteMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      toast.success("项目已删除");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "删除失败");
    },
  });

  // 加载项目数据
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        role: project.role,
        content: project.content || "",
        highlights: project.highlights || [],
        learnings: project.learnings || [],
        tags: project.tags || [],
      });
    }
  }, [project]);

  const handleAddHighlight = () => {
    if (highlightInput.trim() && !formData.highlights.includes(highlightInput.trim())) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, highlightInput.trim()],
      });
      setHighlightInput("");
    }
  };

  const handleRemoveHighlight = (highlight: string) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((h) => h !== highlight),
    });
  };

  const handleAddLearning = () => {
    if (learningInput.trim() && !formData.learnings.includes(learningInput.trim())) {
      setFormData({
        ...formData,
        learnings: [...formData.learnings, learningInput.trim()],
      });
      setLearningInput("");
    }
  };

  const handleRemoveLearning = (learning: string) => {
    setFormData({
      ...formData,
      learnings: formData.learnings.filter((l) => l !== learning),
    });
  };

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
    if (!formData.title.trim() || !formData.description.trim()) {
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
    if (confirm("确定要删除这个项目吗？此操作无法撤销。")) {
      deleteMutation.mutate({ id: id! });
    }
  };

  if (isLoadingProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">项目未找到</h1>
          <Button onClick={() => navigate("/")}>返回首页</Button>
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
            onClick={() => navigate(`/projects/${id}`)}
          >
            <ArrowLeft size={16} className="mr-2" />
            返回
          </Button>
          <h1 className="text-3xl font-bold">编辑项目</h1>
        </div>

        {/* Form */}
        <Card className="p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">项目标题</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="项目名称"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">项目描述</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="简短描述"
              rows={3}
              className="w-full"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-2">我的角色</label>
            <Input
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="例如：产品经理 / 技术负责人"
              className="w-full"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">项目详情</label>
            <MarkdownEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="用 Markdown 编写项目详情..."
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium mb-2">项目成就</label>
            <div className="flex gap-2 mb-3">
              <Input
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddHighlight();
                  }
                }}
                placeholder="添加成就，按 Enter 确认"
                className="flex-1"
              />
              <Button onClick={handleAddHighlight} variant="outline">
                添加
              </Button>
            </div>
            <div className="space-y-2">
              {formData.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="bg-muted p-3 rounded flex items-center justify-between"
                >
                  <span>{highlight}</span>
                  <button
                    onClick={() => handleRemoveHighlight(highlight)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Learnings */}
          <div>
            <label className="block text-sm font-medium mb-2">收获与思考</label>
            <div className="flex gap-2 mb-3">
              <Input
                value={learningInput}
                onChange={(e) => setLearningInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLearning();
                  }
                }}
                placeholder="添加收获，按 Enter 确认"
                className="flex-1"
              />
              <Button onClick={handleAddLearning} variant="outline">
                添加
              </Button>
            </div>
            <div className="space-y-2">
              {formData.learnings.map((learning) => (
                <div
                  key={learning}
                  className="bg-muted p-3 rounded flex items-center justify-between"
                >
                  <span>{learning}</span>
                  <button
                    onClick={() => handleRemoveLearning(learning)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
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
              onClick={() => navigate(`/projects/${id}`)}
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
