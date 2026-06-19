import styles from "@/app/(dashboard)/dashboard/projects/[id]/phase/[phaseId]/tasks/tasks.module.css";
import { Task } from "@/types/task_types";


const STATUS_COLUMNS: { key: Task["status"]; label: string }[] = [
    { key: "todo", label: "To Do" },
    { key: "in_progress", label: "In Progress" },
    { key: "blocked", label: "Blocked" },
    { key: "done", label: "Done" },
];

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

// ── Helpers ──────────────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: Task["priority"] }) {
    const map: Record<string, string> = {
        low: styles.priorityLow,
        medium: styles.priorityMedium,
        high: styles.priorityHigh,
        critical: styles.priorityCritical,
    };
    return <span className={`${styles.priorityBadge} ${map[priority]}`}>{priority}</span>;
}

function PhaseBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; cls: string }> = {
        active: { label: "Active", cls: styles.badgeActive },
        locked: { label: "Locked", cls: styles.badgeLocked },
        complete: { label: "Complete", cls: styles.badgeComplete },
    };
    const s = map[status] ?? { label: status, cls: styles.badgeLocked };
    return <span className={`${styles.badge} ${s.cls}`}>{s.label}</span>;
}

function isOverdue(dueDate: string | null, status: string) {
    if (!dueDate || status === "done") return false;
    return new Date(dueDate) < new Date();
}

export { STATUS_COLUMNS, PriorityBadge, PhaseBadge, isOverdue, PRIORITY_ORDER };