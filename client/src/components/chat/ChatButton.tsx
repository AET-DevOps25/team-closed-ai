import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import ChatBot from "./ChatBot";

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { selectedProject } = useProject();
  const { defaultUser } = useUser();

  const projectId = selectedProject?.id?.toString();

  return (
    <>
      <Button
        onClick={() => {
          if (!projectId) {
            toast.error("Please select a project!");
            return;
          }

          if (!defaultUser) {
            toast.error("Please select a default user!");
            return;
          }

          setIsChatOpen(!isChatOpen);
        }}
        className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-40"
        size="icon"
      >
        <Bot className="h-8 w-8" />
      </Button>

      {projectId && (
        <ChatBot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          projectId={projectId}
          user={defaultUser}
        />
      )}
    </>
  );
};

export default ChatButton;
