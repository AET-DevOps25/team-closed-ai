import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useBoard } from "@/context/BoardContext";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import type { Task, TaskStatus } from "@/types";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTaskDialog = ({ isOpen, onClose }: CreateTaskDialogProps) => {
  const { addTask } = useBoard();
  const { defaultUser, users } = useUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState<TaskStatus>("BACKLOG");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && defaultUser && !assigneeId) {
      setAssigneeId(defaultUser.id.toString());
    }
  }, [isOpen, defaultUser, assigneeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!defaultUser) {
      toast.error("Please select a default user first");
      return;
    }

    const assignee =
      assigneeId && assigneeId !== "unassigned"
        ? users.find((user) => user.id === parseInt(assigneeId))
        : undefined;

    const TaskData: Omit<
      Task,
      "id" | "comments" | "attachments" | "createdAt" | "updatedAt"
    > = {
      title: title.trim(),
      description: description.trim(),
      taskStatus: state,
      assignee,
    };

    setIsSubmitting(true);
    try {
      await addTask(TaskData);
      toast.success("Task created successfully");
      resetForm();
      onClose();
    } catch (error) {
      toast.error("Failed to create Task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setState("BACKLOG");
    setAssigneeId("");
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={isSubmitting ? undefined : handleClose}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Task title"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Task description"
              className="resize-none"
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={state}
                onValueChange={(value) => setState(value as TaskStatus)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BACKLOG">Backlog</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                value={assigneeId}
                onValueChange={setAssigneeId}
                disabled={isSubmitting}
              >
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
