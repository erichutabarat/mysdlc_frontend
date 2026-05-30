"use client";
import { useState } from "react";
import Link from "next/link";
import styles from '../dashboard.module.css';

// ── mock data (replace with real API calls) ──────────────────────────────────
const mockUser = { name: "Eric Daniel", email: "eric@example.com", role: "user" };

const mockProjects = [
    {
        id: 1, name: "Final Year Thesis", sdlc: "Agile",
        currentPhase: "Design", status: "active", progress: 35,
        taskSummary: { total: 13, done: 4, inProgress: 3, blocked: 1, todo: 5 },
        updatedAt: "2 hours ago",
    },
    {
        id: 2, name: "E-Commerce API", sdlc: "Waterfall",
        currentPhase: "Implementation", status: "active", progress: 62,
        taskSummary: { total: 20, done: 12, inProgress: 4, blocked: 0, todo: 4 },
        updatedAt: "1 day ago",
    },
    {
        id: 3, name: "Portfolio Redesign", sdlc: "RAD",
        currentPhase: "Testing", status: "active", progress: 80,
        taskSummary: { total: 10, done: 8, inProgress: 1, blocked: 0, todo: 1 },
        updatedAt: "3 days ago",
    },
    {
        id: 4, name: "Mobile App MVP", sdlc: "Agile",
        currentPhase: "Planning", status: "archived", progress: 15,
        taskSummary: { total: 8, done: 1, inProgress: 0, blocked: 2, todo: 5 },
        updatedAt: "2 weeks ago",
    },
];

const mockActivity = [
    { id: 1, project: "Final Year Thesis", action: "Phase advanced to Design", time: "2h ago", type: "phase" },
    { id: 2, project: "E-Commerce API", action: "Task 'Setup DB schema' marked done", time: "5h ago", type: "task" },
    { id: 3, project: "Portfolio Redesign", action: "Document 'Test Plan v2' uploaded", time: "1d ago", type: "doc" },
    { id: 4, project: "Final Year Thesis", action: "Task 'Wireframes' moved to In Progress", time: "1d ago", type: "task" },
    { id: 5, project: "E-Commerce API", action: "John Smith added as Contributor", time: "2d ago", type: "member" },
];
// ────────────────────────────────────────────────────────────────────────────

function PhaseStatusBadge({ phase, status }: { phase: string; status: string }) {
    return (
        <span className={`${styles.phaseBadge} ${status === "archived" ? styles.phaseBadgeArchived : ""}`}>
            {phase}
        </span>
    );
}

function ProgressBar({ value }: { value: number }) {
    return (
        <div className={styles.progressTrack}>
            <div
                className={styles.progressFill}
                style={{ width: `${value}%` }}
            />
        </div>
    );
}

function ActivityIcon({ type }: { type: string }) {
    const icons: Record<string, string> = {
        phase: "◈", task: "◉", doc: "◎", member: "◇",
    };
    return <span className={`${styles.activityIcon} ${styles[`activityIcon_${type}`]}`}>{icons[type] ?? "○"}</span>;
}

export default function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filter, setFilter] = useState<"all" | "active" | "archived">("all");

    const filtered = mockProjects.filter(p => filter === "all" ? true : p.status === filter);

    const totalProjects = mockProjects.length;
    const activeProjects = mockProjects.filter(p => p.status === "active").length;
    const totalTasks = mockProjects.reduce((s, p) => s + p.taskSummary.total, 0);
    const doneTasks = mockProjects.reduce((s, p) => s + p.taskSummary.done, 0);
    const blockedTasks = mockProjects.reduce((s, p) => s + p.taskSummary.blocked, 0);

    return (
        <div className={styles.root}>

            {/* ── SIDEBAR ── */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
                <div className={styles.sidebarTop}>
                    <Link href="/" className={styles.logo}>
                        <span className={styles.logoMark}>M</span>
                        <span className={styles.logoText}>MySDLC</span>
                    </Link>
                </div>

                <nav className={styles.sidebarNav}>
                    <p className={styles.sidebarSection}>Main</p>
                    <Link href="/dashboard" className={`${styles.sidebarLink} ${styles.sidebarLinkActive}`}>
                        <span className={styles.sidebarIcon}>⬡</span> Dashboard
                    </Link>
                    <Link href="/dashboard/projects" className={styles.sidebarLink}>
                        <span className={styles.sidebarIcon}>◈</span> Projects
                    </Link>
                    <Link href="/dashboard/tasks" className={styles.sidebarLink}>
                        <span className={styles.sidebarIcon}>◉</span> My Tasks
                    </Link>

                    <p className={styles.sidebarSection}>Account</p>
                    <Link href="/dashboard/settings" className={styles.sidebarLink}>
                        <span className={styles.sidebarIcon}>◎</span> Settings
                    </Link>
                </nav>

                <div className={styles.sidebarUser}>
                    <div className={styles.userAvatar}>{mockUser.name[0]}</div>
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>{mockUser.name}</p>
                        <p className={styles.userEmail}>{mockUser.email}</p>
                    </div>
                    <button className={styles.logoutBtn} title="Log out">⏻</button>
                </div>
            </aside>

            {/* sidebar overlay on mobile */}
            {sidebarOpen && (
                <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── MAIN ── */}
            <main className={styles.main}>

                {/* topbar */}
                <div className={styles.topbar}>
                    <button
                        className={styles.menuBtn}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle sidebar"
                    >
                        ☰
                    </button>
                    <div className={styles.topbarRight}>
                        <Link href="/dashboard/projects/new" className={styles.newProjectBtn}>
                            + New Project
                        </Link>
                    </div>
                </div>

                {/* content */}
                <div className={styles.content}>

                    {/* greeting */}
                    <div className={styles.greeting}>
                        <div>
                            <h1 className={styles.greetingTitle}>
                                Good morning, {mockUser.name.split(" ")[0]} 👋
                            </h1>
                            <p className={styles.greetingSub}>Here's what's happening across your projects.</p>
                        </div>
                        <Link href="/dashboard/projects/new" className={styles.newProjectBtnDesktop}>
                            + New Project
                        </Link>
                    </div>

                    {/* ── STATS ── */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <p className={styles.statLabel}>Active Projects</p>
                            <p className={styles.statNum}>{activeProjects}</p>
                            <p className={styles.statSub}>{totalProjects} total</p>
                        </div>
                        <div className={styles.statCard}>
                            <p className={styles.statLabel}>Tasks Completed</p>
                            <p className={styles.statNum}>{doneTasks}</p>
                            <p className={styles.statSub}>of {totalTasks} total</p>
                        </div>
                        <div className={styles.statCard}>
                            <p className={styles.statLabel}>Completion Rate</p>
                            <p className={styles.statNum}>{Math.round((doneTasks / totalTasks) * 100)}%</p>
                            <p className={styles.statSub}>across all projects</p>
                        </div>
                        <div className={`${styles.statCard} ${blockedTasks > 0 ? styles.statCardWarning : ""}`}>
                            <p className={styles.statLabel}>Blocked Tasks</p>
                            <p className={styles.statNum}>{blockedTasks}</p>
                            <p className={styles.statSub}>{blockedTasks > 0 ? "needs attention" : "all clear"}</p>
                        </div>
                    </div>

                    {/* ── PROJECTS + ACTIVITY ── */}
                    <div className={styles.mainGrid}>

                        {/* projects */}
                        <div className={styles.projectsPanel}>
                            <div className={styles.panelHeader}>
                                <h2 className={styles.panelTitle}>Projects</h2>
                                <div className={styles.filterTabs}>
                                    {(["all", "active", "archived"] as const).map(f => (
                                        <button
                                            key={f}
                                            className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ""}`}
                                            onClick={() => setFilter(f)}
                                        >
                                            {f.charAt(0).toUpperCase() + f.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.projectsList}>
                                {filtered.map(p => (
                                    <Link href={`/dashboard/projects/${p.id}`} key={p.id} className={styles.projectCard}>
                                        <div className={styles.projectCardTop}>
                                            <div>
                                                <h3 className={styles.projectName}>{p.name}</h3>
                                                <div className={styles.projectMeta}>
                                                    <span className={styles.sdlcTag}>{p.sdlc}</span>
                                                    <PhaseStatusBadge phase={p.currentPhase} status={p.status} />
                                                </div>
                                            </div>
                                            <span className={styles.projectArrow}>→</span>
                                        </div>

                                        <ProgressBar value={p.progress} />

                                        <div className={styles.projectCardBottom}>
                                            <div className={styles.taskPills}>
                                                <span className={styles.taskPillDone}>✓ {p.taskSummary.done}</span>
                                                {p.taskSummary.inProgress > 0 && (
                                                    <span className={styles.taskPillProgress}>● {p.taskSummary.inProgress}</span>
                                                )}
                                                {p.taskSummary.blocked > 0 && (
                                                    <span className={styles.taskPillBlocked}>! {p.taskSummary.blocked}</span>
                                                )}
                                                <span className={styles.taskPillTodo}>○ {p.taskSummary.todo}</span>
                                            </div>
                                            <span className={styles.projectUpdated}>{p.updatedAt}</span>
                                        </div>
                                    </Link>
                                ))}

                                {filtered.length === 0 && (
                                    <div className={styles.emptyState}>
                                        <p className={styles.emptyStateText}>No {filter} projects found.</p>
                                        <Link href="/dashboard/projects/new" className={styles.emptyStateLink}>
                                            Create your first project →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* activity */}
                        <div className={styles.activityPanel}>
                            <div className={styles.panelHeader}>
                                <h2 className={styles.panelTitle}>Recent Activity</h2>
                            </div>
                            <div className={styles.activityList}>
                                {mockActivity.map(a => (
                                    <div key={a.id} className={styles.activityItem}>
                                        <ActivityIcon type={a.type} />
                                        <div className={styles.activityBody}>
                                            <p className={styles.activityAction}>{a.action}</p>
                                            <p className={styles.activityMeta}>
                                                <span className={styles.activityProject}>{a.project}</span>
                                                <span className={styles.activityDot}>·</span>
                                                {a.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}