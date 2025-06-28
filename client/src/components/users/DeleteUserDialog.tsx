import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userToDelete: { id: number; name: string } | null;
}

export function DeleteUserDialog({
  isOpen,
  onClose,
  userToDelete,
}: DeleteUserDialogProps) {
  const { deleteUser } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      toast.success(`Deleted user ${userToDelete.name}`);
      onClose();
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>{userToDelete?.name}</strong>? This action cannot be undone
            and will remove all tasks assigned to this user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={handleClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteUserConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
