// types/project.ts (or whatever you named it)

export interface Assignee {
    ID: number;
    name: string;
    email: string;
}

export interface Phase {
    ID: number;
    name: string;
    order: number;
    status: "active" | "locked" | "complete";
}

export interface Task {
    ID: number;
    title: string;
    description: string;
    priority: "low" | "medium" | "high" | "critical";
    status: "todo" | "in_progress" | "blocked" | "done";
    due_date: string | null;
    assignee_id: number | null;
    assignee: Assignee | null;
    phase_id: number;
    project_id: number;
    from_template_id: number | null;
}

export interface ProjectMini {
    ID: number;
    name: string;
}