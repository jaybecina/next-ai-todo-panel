import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Todo } from "@/lib/db/schema";

interface TodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: Todo | null;
}

export function TodoDialog({ open, onOpenChange, todo }: TodoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Todo Details</DialogTitle>
        </DialogHeader>
        {todo ? (
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Title:</span> {todo.title}
            </div>
            <div>
              <span className="font-semibold">Description:</span>{" "}
              {todo.description}
            </div>
            <div>
              <span className="font-semibold">Due Date:</span>{" "}
              {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "-"}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              {todo.isCompleted ? "Completed" : "Pending"}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">No todo selected.</div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
