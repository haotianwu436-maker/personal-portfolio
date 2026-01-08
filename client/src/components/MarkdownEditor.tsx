import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Heading2, Code, List, Link as LinkIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in Markdown...",
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.querySelector(
      "textarea[data-markdown-editor]"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newValue =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
    }, 0);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown("**", "**")}
          title="Bold"
        >
          <Bold size={16} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown("*", "*")}
          title="Italic"
        >
          <Italic size={16} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown("## ", "")}
          title="Heading"
        >
          <Heading2 size={16} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown("`", "`")}
          title="Code"
        >
          <Code size={16} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown("- ", "")}
          title="List"
        >
          <List size={16} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown("[", "](url)")}
          title="Link"
        >
          <LinkIcon size={16} />
        </Button>
        <div className="flex-1" />
        <Button
          size="sm"
          variant={showPreview ? "default" : "ghost"}
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      {/* Editor and Preview */}
      <div className="flex gap-0 min-h-96">
        {!showPreview && (
          <textarea
            data-markdown-editor
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-background text-foreground border-none"
          />
        )}

        {showPreview && (
          <div className="flex-1 p-4 overflow-auto prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ ...props }: any) => (
                  <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
                ),
                h2: ({ ...props }: any) => (
                  <h2 className="text-xl font-bold mt-3 mb-2" {...props} />
                ),
                h3: ({ ...props }: any) => (
                  <h3 className="text-lg font-bold mt-2 mb-1" {...props} />
                ),
                p: ({ ...props }: any) => (
                  <p className="mb-2 leading-relaxed" {...props} />
                ),
                ul: ({ ...props }: any) => (
                  <ul className="list-disc list-inside mb-2" {...props} />
                ),
                ol: ({ ...props }: any) => (
                  <ol className="list-decimal list-inside mb-2" {...props} />
                ),
                code: ({ inline, ...props }: any) =>
                  inline ? (
                    <code
                      className="bg-muted px-1 rounded text-sm font-mono"
                      {...props}
                    />
                  ) : (
                    <code
                      className="block bg-muted p-3 rounded mb-2 overflow-x-auto text-sm font-mono"
                      {...props}
                    />
                  ),
                blockquote: ({ ...props }: any) => (
                  <blockquote
                    className="border-l-4 border-primary pl-4 italic mb-2"
                    {...props}
                  />
                ),
                a: ({ ...props }: any) => (
                  <a className="text-primary hover:underline" {...props} />
                ),
              } as any}
            >
              {value}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
