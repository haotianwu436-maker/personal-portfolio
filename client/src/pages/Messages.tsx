import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Clock, CheckCircle, MessageCircle, Trash2, Send, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Messages() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: messages = [], isLoading, refetch } = trpc.contact.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const markAsReadMutation = trpc.contact.markAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  const replyMutation = trpc.contact.reply.useMutation({
    onSuccess: () => {
      setReplyText("");
      refetch();
    },
  });

  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      setSelectedMessage(null);
      refetch();
    },
  });

  const handleSelectMessage = async (id: number, status: string) => {
    setSelectedMessage(id);
    if (status === "unread") {
      await markAsReadMutation.mutateAsync({ id });
    }
  };

  const handleReply = async (id: number) => {
    if (!replyText.trim()) return;
    await replyMutation.mutateAsync({ id, reply: replyText });
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这条留言吗？")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unread":
        return <Mail size={16} className="text-primary" />;
      case "read":
        return <CheckCircle size={16} className="text-muted-foreground" />;
      case "replied":
        return <MessageCircle size={16} className="text-green-600" />;
      default:
        return <Mail size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "unread":
        return "未读";
      case "read":
        return "已读";
      case "replied":
        return "已回复";
      default:
        return status;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif mb-4">需要登录</h1>
          <p className="text-muted-foreground mb-6">请先登录以查看留言</p>
          <Button onClick={() => navigate("/")} className="rounded-full">
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="返回首页"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="font-serif text-lg">留言管理</span>
          </div>
          <span className="text-sm text-muted-foreground">
            共 {messages.length} 条留言
          </span>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="md:col-span-1 space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground mb-4 px-2">所有留言</h2>
            
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">加载中...</p>
            ) : messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">暂无留言</p>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedMessage === message.id
                      ? "bg-primary/10 border border-primary/20"
                      : message.status === "unread"
                      ? "bg-secondary/80 hover:bg-secondary"
                      : "bg-secondary/30 hover:bg-secondary/50"
                  }`}
                  onClick={() => handleSelectMessage(message.id, message.status)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`font-medium ${message.status === "unread" ? "text-foreground" : "text-muted-foreground"}`}>
                      {message.name}
                    </span>
                    {getStatusIcon(message.status)}
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {message.subject || message.message.substring(0, 50)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                    <Clock size={12} />
                    {new Date(message.createdAt).toLocaleDateString("zh-CN")}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="md:col-span-2">
            {selectedMessageData ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-secondary/30 rounded-2xl p-6 md:p-8"
              >
                {/* Message Header */}
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-border/40">
                  <div>
                    <h2 className="text-2xl font-serif mb-2">{selectedMessageData.name}</h2>
                    <a 
                      href={`mailto:${selectedMessageData.email}`}
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {selectedMessageData.email}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      selectedMessageData.status === "unread" 
                        ? "bg-primary/10 text-primary" 
                        : selectedMessageData.status === "replied"
                        ? "bg-green-100 text-green-700"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {getStatusText(selectedMessageData.status)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(selectedMessageData.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Subject */}
                {selectedMessageData.subject && (
                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground">主题：</span>
                    <span className="font-medium ml-2">{selectedMessageData.subject}</span>
                  </div>
                )}

                {/* Message Content */}
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground block mb-2">留言内容：</span>
                  <div className="bg-background rounded-lg p-4 whitespace-pre-wrap">
                    {selectedMessageData.message}
                  </div>
                </div>

                {/* Time */}
                <div className="text-sm text-muted-foreground mb-6">
                  收到时间：{new Date(selectedMessageData.createdAt).toLocaleString("zh-CN")}
                </div>

                {/* Previous Reply */}
                {selectedMessageData.reply && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-700">我的回复</span>
                      <span className="text-xs text-green-600">
                        {selectedMessageData.repliedAt && new Date(selectedMessageData.repliedAt).toLocaleString("zh-CN")}
                      </span>
                    </div>
                    <p className="text-green-800 whitespace-pre-wrap">{selectedMessageData.reply}</p>
                  </div>
                )}

                {/* Reply Form */}
                <div className="border-t border-border/40 pt-6">
                  <h3 className="text-lg font-medium mb-4">
                    {selectedMessageData.reply ? "更新回复" : "回复留言"}
                  </h3>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none mb-4"
                    placeholder="写下你的回复..."
                  />
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleReply(selectedMessageData.id)}
                      disabled={!replyText.trim() || replyMutation.isPending}
                      className="rounded-full"
                    >
                      {replyMutation.isPending ? "发送中..." : "发送回复"}
                      <Send size={16} className="ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(`mailto:${selectedMessageData.email}?subject=Re: ${selectedMessageData.subject || "您的留言"}&body=${encodeURIComponent(`\n\n---\n原始留言：\n${selectedMessageData.message}`)}`)}
                      className="rounded-full"
                    >
                      通过邮件回复
                      <ExternalLink size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-secondary/30 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <Mail size={48} className="text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">选择一条留言查看详情</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
