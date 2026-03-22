import { TaskStatus } from "@/lib/workflow/types";

export const taskTransitions: Record<TaskStatus, TaskStatus[]> = {
  todo: ["in_progress"],
  in_progress: ["blocked", "in_review"],
  blocked: ["todo", "in_progress"],
  in_review: ["in_progress", "done"],
  done: ["todo"],
};

export function getAllowedTaskTransitions(status: TaskStatus) {
  return taskTransitions[status];
}
