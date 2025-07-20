import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/context/BoardContext";

interface ChatBotMarkdownProps {
  message: string;
}

const ChatBotMarkdown = ({ message }: ChatBotMarkdownProps) => {
  const { openTaskDetails } = useBoard();

  const handleTaskClick = (taskId: number) => {
    openTaskDetails(taskId);
  };

  return (
    <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          p: ({ children }) => {
            if (typeof children !== "string") {
              return children;
            }

            const taskIdRegex = /\[id:(\d+)\]/g;
            const parts = [];
            let lastIndex = 0;
            let match;

            while ((match = taskIdRegex.exec(children)) !== null) {
              // Add text before the match
              if (match.index > lastIndex) {
                parts.push(children.slice(lastIndex, match.index));
              }

              // Add the clickable task reference
              const taskId = parseInt(match[1]);
              parts.push(
                <Button
                  key={`task-${taskId}-${match.index}`}
                  variant="link"
                  className="h-auto p-0 text-blue-600 dark:text-blue-400 underline text-sm font-normal"
                  onClick={() => handleTaskClick(taskId)}
                >
                  [id:{taskId}]
                </Button>,
              );

              lastIndex = match.index + match[0].length;
            }

            // Add remaining text after the last match
            if (lastIndex < children.length) {
              parts.push(children.slice(lastIndex));
            }

            return parts.length > 1 ? (
              <p className="mb-2 last:mb-0">{parts}</p>
            ) : (
              children
            );
          },
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-2 text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          code: ({ children }) => (
            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted p-3 rounded-md overflow-x-auto mb-2">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-muted-foreground pl-4 italic text-muted-foreground mb-2">
              {children}
            </blockquote>
          ),
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-foreground mb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold text-foreground mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {children}
            </h3>
          ),
        }}
      >
        {message}
      </ReactMarkdown>
    </div>
  );
};

export default ChatBotMarkdown;
