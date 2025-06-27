import { LogOut, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface UserProfileFooterProps {
  isAuthenticated: boolean;
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function UserProfileFooter({
  isAuthenticated,
  user,
  onSignIn,
  onSignOut,
}: UserProfileFooterProps) {
  return (
    <div className="p-4">
      <Separator className="mb-4" />
      {isAuthenticated && user ? (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      ) : (
        <Button variant="outline" className="w-full gap-2" onClick={onSignIn}>
          <LogIn className="h-4 w-4" />
          Sign in
        </Button>
      )}
    </div>
  );
}
