import type { UserDto } from "@/api/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

interface ChatBotAvatarProps {
  user?: UserDto | null;
}

const ChatBotAvatar = ({ user }: ChatBotAvatarProps) => {
  if (!user) {
    return (
      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
    );
  }

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user.profilePicture} alt={user.name} />
      <AvatarFallback className="bg-gray-200 text-xs">
        {user.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default ChatBotAvatar;
