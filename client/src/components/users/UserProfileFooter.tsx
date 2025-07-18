import { useState } from "react";
import { Users, Plus, Trash2, ChevronDown, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ForwardedButton } from "@/components/custom/ForwardedButton";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { CreateUserDialog } from "./CreateUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";

interface UserProfileFooterProps {
  isAuthenticated?: boolean;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  onSignIn?: () => void;
  onSignOut?: () => void;
}

// eslint-disable-next-line no-empty-pattern
export function UserProfileFooter({}: UserProfileFooterProps) {
  const { users, defaultUser, loading, setDefaultUser } = useUser();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleUserSelect = (selectedUser: (typeof users)[0]) => {
    setDefaultUser(selectedUser);
    toast.success(`Default user set to ${selectedUser.name}`);
  };

  const handleDeleteUserClick = (user: { id: number; name: string }) => {
    if (users.length <= 1) {
      toast.error("Cannot delete the last user");
      return;
    }
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleClearDefaultUser = () => {
    setDefaultUser(null);
    toast.success("Default user cleared");
  };

  return (
    <>
      <div className="p-4">
        <Separator className="mb-4" />

        {defaultUser ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={defaultUser.profilePicture}
                  alt={defaultUser.name}
                />
                <AvatarFallback>
                  {defaultUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {defaultUser.name}
                </p>
                <p className="text-xs text-muted-foreground">Default User</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ForwardedButton
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <ChevronDown className="h-4 w-4" />
                    <span className="sr-only">User options</span>
                  </ForwardedButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-semibold">
                    Switch Default User
                  </div>
                  <DropdownMenuSeparator />
                  {users.map((u) => (
                    <DropdownMenuItem
                      key={u.id}
                      className="flex items-center gap-2"
                      onClick={() => handleUserSelect(u)}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={u.profilePicture} alt={u.name} />
                        <AvatarFallback className="bg-gray-200 text-xs">
                          {u.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{u.name}</span>
                      {u.id === defaultUser.id && (
                        <UserCheck className="h-4 w-4 text-green-600" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create New User</span>
                  </DropdownMenuItem>
                  {users.length > 1 && (
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-destructive"
                      onClick={() =>
                        handleDeleteUserClick({
                          id: defaultUser.id,
                          name: defaultUser.name,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Current User</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={handleClearDefaultUser}
                  >
                    <Users className="h-4 w-4" />
                    <span>Clear Default</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {users.length > 0 ? (
              <>
                <div className="text-center mb-3">
                  <p className="text-sm text-muted-foreground">
                    No default user selected
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ForwardedButton variant="outline" className="w-full gap-2">
                      <UserCheck className="h-4 w-4" />
                      Select Default User
                    </ForwardedButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-semibold">
                      Choose Default User
                    </div>
                    <DropdownMenuSeparator />
                    {users.map((u) => (
                      <DropdownMenuItem
                        key={u.id}
                        className="flex items-center gap-2"
                        onClick={() => handleUserSelect(u)}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={u.profilePicture} alt={u.name} />
                          <AvatarFallback className="text-xs">
                            {u.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1">{u.name}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create New User</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setIsCreateDialogOpen(true)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Users className="h-4 w-4 animate-pulse" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create First User
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      <CreateUserDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        usersCount={users.length}
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
        userToDelete={userToDelete}
      />
    </>
  );
}
