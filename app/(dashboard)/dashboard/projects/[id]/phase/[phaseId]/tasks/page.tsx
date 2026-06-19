"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./tasks.module.css";
import { apiFetch } from "@/utils/api";
import { Assignee, Phase, Task, ProjectMini } from "@/types/task_types";
import { STATUS_COLUMNS, PriorityBadge, PhaseBadge, isOverdue, PRIORITY_ORDER } from "@/helpers/task_helper";



// ── Page ─────────────────────────────────────────────────────────────────────
export default function PhaseTasksPage() {
    const { id, phaseId } = useParams<{ id: string; phaseId: string }>();
    const router = useRouter();

    const [project, setProject] = useState<ProjectMini | null>(null);
    const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [priorityFilter, setPriorityFilter] = useState<string>("all");

    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);


    // create task modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "medium" as Task["priority"],
        due_date: "",
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectRes, tasksRes] = await Promise.all([
                    apiFetch(`projects/${id}`),
                    apiFetch(`projects/${id}/phases/${phaseId}/tasks`),
                ]);

                if (projectRes.status === 401 || tasksRes.status === 401) {
                    router.push("/login");
                    return;
                }

                const projectJson = await projectRes.json();
                const tasksJson = await tasksRes.json();

                setProject(projectJson.data.project);
                setTasks(tasksJson.data ?? []);

                const phase = projectJson.data.phases.find(
                    (p: Phase) => p.ID === Number(phaseId)
                );
                setCurrentPhase(phase ?? null);
            } catch (err) {
                console.error(err);
                setError("Could not load tasks. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (id && phaseId) fetchData();
    }, [id, phaseId]);

    const handleStatusChange = async (taskId: number, newStatus: Task["status"]) => {
        setTasks((prev) =>
            prev.map((t) => (t.ID === taskId ? { ...t, status: newStatus } : t))
        );
        try {
            await apiFetch(`tasks/${taskId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (err) {
            console.error("Failed to update task status", err);
        }
    };

    const handleCreateTask = async () => {
        if (!newTask.title.trim()) return;
        setCreating(true);
        try {
            const res = await apiFetch(`projects/${id}/phases/${phaseId}/tasks`, {
                method: "POST",
                body: JSON.stringify({
                    title: newTask.title,
                    description: newTask.description,
                    priority: newTask.priority,
                    due_date: newTask.due_date || null,
                }),
            });
            const json = await res.json();
            setTasks((prev) => [...prev, json.data]);
            setShowCreateModal(false);
            setNewTask({ title: "", description: "", priority: "medium", due_date: "" });
        } catch (err) {
            console.error("Failed to create task", err);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        setDeletingTaskId(taskId);
        try {
            const res = await apiFetch(`tasks/${taskId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete task");

            setTasks((prev) => prev.filter((t) => t.ID !== taskId));
        } catch (err) {
            console.error("Failed to delete task", err);
        } finally {
            setDeletingTaskId(null);
            setConfirmDeleteId(null);
        }
    };


    // ── Loading / Error ──
    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.spinner} />
                <p className={styles.loadingText}>Loading tasks...</p>
            </div>
        );
    }

    if (error || !project || !currentPhase) {
        return (
            <div className={styles.errorScreen}>
                <p className={styles.errorText}>{error || "Phase not found."}</p>
                <Link href={`/dashboard/projects/${id}`} className={styles.backLink}>← Back to Project</Link>
            </div>
        );
    }

    // ── Filtering (priority only — phase is fixed by route) ──
    const filteredTasks = tasks.filter((t) => {
        if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
        return true;
    });

    const tasksByStatus = (status: Task["status"]) =>
        filteredTasks
            .filter((t) => t.status === status)
            .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === "done").length;
    const blockedTasks = tasks.filter((t) => t.status === "blocked").length;
    const overdueTasks = tasks.filter((t) => isOverdue(t.due_date, t.status)).length;
    const isPhaseLocked = currentPhase.status === "locked";

    return (
        <div className={styles.root}>

            {/* ── TOPBAR ── */}
            <div className={styles.topbar}>
                <div className={styles.topbarLeft}>
                    <Link href="/dashboard" className={styles.backBtn}>Dashboard</Link>
                    <span className={styles.topbarDivider}>/</span>
                    <Link href={`/dashboard/projects/${id}`} className={styles.backBtn}>{project.name}</Link>
                    <span className={styles.topbarDivider}>/</span>
                    <span className={styles.topbarCrumb}>{currentPhase.name}</span>
                    <span className={styles.topbarDivider}>/</span>
                    <span className={styles.topbarCrumb}>Tasks</span>
                </div>
                <div className={styles.topbarRight}>
                    <PhaseBadge status={currentPhase.status} />
                    <button
                        className={styles.newTaskBtn}
                        onClick={() => setShowCreateModal(true)}
                        disabled={isPhaseLocked}
                        title={isPhaseLocked ? "This phase is locked" : ""}
                    >
                        + New Task
                    </button>
                </div>
            </div>

            <div className={styles.layout}>

                {/* ── MAIN ── */}
                <div className={styles.main}>

                    {/* header */}
                    <div className={styles.pageHeader}>
                        <div>
                            <p className={styles.sdlcLabel}>Phase {currentPhase.order} · Task Management</p>
                            <h1 className={styles.pageTitle}>{currentPhase.name}</h1>
                        </div>
                    </div>

                    {isPhaseLocked && (
                        <div className={styles.lockedBanner}>
                            <span className={styles.lockedIcon}>🔒</span>
                            This phase is locked. Complete the previous phase to unlock task creation.
                        </div>
                    )}

                    {/* ── STATS ── */}
                    <div className={styles.statsRow}>
                        <div className={styles.statCard}>
                            <p className={styles.statLabel}>Total Tasks</p>
                            <p className={styles.statNum}>{totalTasks}</p>
                        </div>
                        <div className={styles.statCard}>
                            <p className={styles.statLabel}>Completed</p>
                            <p className={styles.statNum}>{doneTasks}</p>
                            <p className={styles.statSub}>{totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%</p>
                        </div>
                        <div className={`${styles.statCard} ${blockedTasks > 0 ? styles.statCardWarning : ""}`}>
                            <p className={styles.statLabel}>Blocked</p>
                            <p className={styles.statNum}>{blockedTasks}</p>
                        </div>
                        <div className={`${styles.statCard} ${overdueTasks > 0 ? styles.statCardDanger : ""}`}>
                            <p className={styles.statLabel}>Overdue</p>
                            <p className={styles.statNum}>{overdueTasks}</p>
                        </div>
                    </div>

                    {/* ── FILTERS (priority only) ── */}
                    <div className={styles.filterBar}>
                        <div className={styles.filterGroup}>
                            <span className={styles.filterLabel}>Priority</span>
                            <div className={styles.filterTabs}>
                                {["all", "critical", "high", "medium", "low"].map((p) => (
                                    <button
                                        key={p}
                                        className={`${styles.filterTab} ${priorityFilter === p ? styles.filterTabActive : ""}`}
                                        onClick={() => setPriorityFilter(p)}
                                    >
                                        {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── KANBAN BOARD ── */}
                    <div className={styles.board}>
                        {STATUS_COLUMNS.map((col) => {
                            const colTasks = tasksByStatus(col.key);
                            return (
                                <div key={col.key} className={styles.column}>
                                    <div className={styles.columnHeader}>
                                        <span className={styles.columnTitle}>{col.label}</span>
                                        <span className={styles.columnCount}>{colTasks.length}</span>
                                    </div>

                                    <div className={styles.columnBody}>
                                        {colTasks.map((task) => {
                                            const overdue = isOverdue(task.due_date, task.status);

                                            return (
                                                <div key={task.ID} className={styles.taskCard}>
                                                    <div className={styles.taskCardTop}>
                                                        <div className={styles.taskCardTopLeft}>
                                                            <PriorityBadge priority={task.priority} />
                                                            {overdue && <span className={styles.overdueTag}>Overdue</span>}
                                                        </div>
                                                        <button
                                                            className={styles.taskDeleteBtn}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setConfirmDeleteId(task.ID);
                                                            }}
                                                            title="Delete task"
                                                            aria-label="Delete task"
                                                        >
                                                            🗑
                                                        </button>
                                                    </div>


                                                    <h3 className={styles.taskTitle}>{task.title}</h3>
                                                    {task.description && (
                                                        <p className={styles.taskDesc}>{task.description}</p>
                                                    )}

                                                    <div className={styles.taskMeta}>
                                                        {task.due_date && (
                                                            <span className={`${styles.taskDueTag} ${overdue ? styles.taskDueTagOverdue : ""}`}>
                                                                {new Date(task.due_date).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className={styles.taskCardBottom}>
                                                        {task.assignee ? (
                                                            <div className={styles.taskAssignee}>
                                                                <span className={styles.taskAssigneeAvatar}>
                                                                    {task.assignee.name[0].toUpperCase()}
                                                                </span>
                                                                <span className={styles.taskAssigneeName}>{task.assignee.name}</span>
                                                            </div>
                                                        ) : (
                                                            <span className={styles.taskUnassigned}>Unassigned</span>
                                                        )}

                                                        <select
                                                            className={styles.statusSelect}
                                                            value={task.status}
                                                            onChange={(e) => handleStatusChange(task.ID, e.target.value as Task["status"])}
                                                        >
                                                            {STATUS_COLUMNS.map((s) => (
                                                                <option key={s.key} value={s.key}>{s.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {colTasks.length === 0 && (
                                            <div className={styles.columnEmpty}>No tasks</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>

                {/* ── RIGHT SIDEBAR ── */}
                <div className={styles.right}>
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoCardTitle}>Phase Info</h3>
                        <p className={styles.infoCardName}>{currentPhase.name}</p>
                        <div className={styles.phaseSummaryProgress} style={{ marginTop: 12 }}>
                            <div className={styles.phaseSummaryTrack}>
                                <div
                                    className={styles.phaseSummaryFill}
                                    style={{ width: totalTasks > 0 ? `${(doneTasks / totalTasks) * 100}%` : "0%" }}
                                />
                            </div>
                            <span className={styles.phaseSummaryCount}>{doneTasks}/{totalTasks}</span>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <h3 className={styles.infoCardTitle}>Priority Breakdown</h3>
                        <div className={styles.priorityBreakdown}>
                            {(["critical", "high", "medium", "low"] as const).map((p) => {
                                const count = tasks.filter((t) => t.priority === p).length;
                                return (
                                    <div key={p} className={styles.priorityRow}>
                                        <PriorityBadge priority={p} />
                                        <span className={styles.priorityCount}>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CREATE TASK MODAL ── */}
            {showCreateModal && (
                <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>New Task — {currentPhase.name}</h2>
                            <button className={styles.modalClose} onClick={() => setShowCreateModal(false)}>×</button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Title</label>
                                <input
                                    className={styles.formInput}
                                    placeholder="e.g. Design wireframes"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>

                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Description</label>
                                <textarea
                                    className={styles.formTextarea}
                                    placeholder="Optional details..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Priority</label>
                                    <select
                                        className={styles.formSelect}
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>

                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Due Date</label>
                                    <input
                                        type="date"
                                        className={styles.formInput}
                                        value={newTask.due_date}
                                        onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.modalCancelBtn} onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button
                                className={styles.modalCreateBtn}
                                onClick={handleCreateTask}
                                disabled={creating || !newTask.title.trim()}
                            >
                                {creating ? "Creating..." : "Create Task"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {confirmDeleteId !== null && (
                <div className={styles.modalOverlay} onClick={() => setConfirmDeleteId(null)}>
                    <div className={styles.modal} style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Delete Task</h2>
                            <button className={styles.modalClose} onClick={() => setConfirmDeleteId(null)}>×</button>
                        </div>

                        <div className={styles.modalBody}>
                            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>
                                Are you sure you want to delete{" "}
                                <strong style={{ color: "var(--text)" }}>
                                    "{tasks.find((t) => t.ID === confirmDeleteId)?.title}"
                                </strong>
                                ? This action cannot be undone.
                            </p>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.modalCancelBtn} onClick={() => setConfirmDeleteId(null)}>
                                Cancel
                            </button>
                            <button
                                className={styles.modalDeleteBtn}
                                onClick={() => handleDeleteTask(confirmDeleteId)}
                                disabled={deletingTaskId === confirmDeleteId}
                            >
                                {deletingTaskId === confirmDeleteId ? "Deleting..." : "Delete Task"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}