"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from '../dashboard.module.css';
import { getProjects } from "@/app/actions/projects";

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
        <div className="flex flex-row p-3 text-lg">
            <span className={`${styles.phaseBadge} ${status === "archived" ? styles.phaseBadgeArchived : ""}`}>
                {status}
            </span>
            <span className={`${styles.phaseBadge} ${status === "archived" ? styles.phaseBadgeArchived : ""}`}>
                Phase {phase}
            </span>
        </div>
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
    const [projects, setProjects] = useState<ProjectListItem[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loadingProject, setLoadingProject] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "archived">("all");

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
                console.log("Loaded projects:", data);
            } catch (err) {
                setError("Could not load projects.");
            } finally {
                setLoadingProject(false);
            }
        };
        loadData();
    }, []);

    const filtered = projects.filter(p => filter === "all" ? true : p.status === filter);
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === "active").length;

    return (
        <>

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
                            Good morning, User 👋
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
                        <p className={styles.statNum}>NULL</p>
                        <p className={styles.statSub}>of NULL total</p>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>Completion Rate</p>
                        <p className={styles.statNum}>NULL</p>
                        <p className={styles.statSub}>across all projects</p>
                    </div>
                    <div className={`${styles.statCard} NULL > 0 ? styles.statCardWarning : ""}`}>
                        <p className={styles.statLabel}>Blocked Tasks</p>
                        <p className={styles.statNum}>NULL</p>
                        <p className={styles.statSub}>{0 > 0 ? "needs attention" : "all clear"}</p>
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
                        {loadingProject && <span>Loading your projects...</span>}
                        {!loadingProject && (<div className={styles.projectsList}>
                            {filtered?.map(p => (
                                // Change p.id to p.ID (if that's what your Go struct uses)
                                <Link href={`/dashboard/projects/${p.id}`} key={p.id} className={styles.projectCard}>
                                    <div className={styles.projectCardTop}>
                                        <div>
                                            {/* Change p.name to p.Name */}
                                            <h3 className={styles.projectName}>{p.name}</h3>
                                            <div className={styles.projectMeta}>
                                                <span className={styles.sdlcTag}>{p.sdlc_name}</span>
                                                <PhaseStatusBadge phase={p.status} status={p.status} />
                                            </div>
                                        </div>
                                        <span className={styles.projectArrow}>→</span>
                                    </div>

                                    {/* <ProgressBar value={p.progress} /> */}

                                </Link>
                            ))}

                            {filtered?.length === 0 && (
                                <div className={styles.emptyState}>
                                    <p className={styles.emptyStateText}>No {filter} projects found.</p>
                                    <Link href="/dashboard/projects/new" className={styles.emptyStateLink}>
                                        Create your first project →
                                    </Link>
                                </div>
                            )}
                        </div>
                        )}
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
        </>
    );
}