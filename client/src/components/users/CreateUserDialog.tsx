import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  usersCount: number;
}

export function CreateUserDialog({
  isOpen,
  onClose,
  usersCount,
}: CreateUserDialogProps) {
  const { createUser } = useUser();
  const [newUserName, setNewUserName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateUser = async () => {
    if (!newUserName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    setIsCreating(true);
    try {
      await createUser({ name: newUserName.trim() });
      toast.success("User created successfully");
      setNewUserName("");
      onClose();
    } catch (error) {
      console.error("Create user error:", error);
      toast.error("Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setNewUserName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            {usersCount === 0
              ? "Create your first user to get started with task assignment."
              : "Create a new user profile for task assignment."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter user name"
              disabled={isCreating}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateUser();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreateUser}
            disabled={isCreating || !newUserName.trim()}
          >
            {isCreating ? "Creating..." : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
