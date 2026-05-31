"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./project.module.css";
import { apiFetch } from "@/utils/api";

// ── Helpers ──────────────────────────────────────────────────────────────────
function phaseProgress(phases?: Phase[]) {
    if (!phases || phases.length === 0) return 0;

    const total = phases.length;
    const done = phases.filter(p => p.status === "complete").length;

    return Math.round((done / total) * 100);
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; cls: string }> = {
        active: { label: "Active", cls: styles.badgeActive },
        locked: { label: "Locked", cls: styles.badgeLocked },
        complete: { label: "Complete", cls: styles.badgeComplete },
        archived: { label: "Archived", cls: styles.badgeArchived },
    };
    const s = map[status] ?? { label: status, cls: styles.badgeLocked };
    return <span className={`${styles.badge} ${s.cls}`}>{s.label}</span>;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [data, setData] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await apiFetch(`projects/${id}`);

                if (!res.ok) {
                    throw new Error("Failed to fetch project");
                }

                const json = await res.json();
                setData(json.data);
            } catch (err) {
                console.error(err);
                setError("Could not load project. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProject();
    }, [id]);

    // ── Loading ──
    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.spinner} />
                <p className={styles.loadingText}>Loading project...</p>
            </div>
        );
    }

    // ── Error ──
    if (error || !data) {
        return (
            <div className={styles.errorScreen}>
                <p className={styles.errorText}>{error || "Something went wrong."}</p>
                <Link href="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
            </div>
        );
    }

    // safe destructure with fallback
    const { project, phases = [] } = data;
    const progress = phaseProgress(phases);
    const currentPhase = phases.find(p => p.ID === project.current_phase_id);
    const completedCount = phases.filter(p => p.status === "complete").length;

    return (
        <>
            {/* ── TOPBAR ── */}
            < div className={styles.topbar} >
                <div className={styles.topbarLeft}>
                    <Link href="/dashboard" className={styles.backBtn}>← Dashboard</Link>
                    <span className={styles.topbarDivider}>/</span>
                    <span className={styles.topbarCrumb}>{project.name}</span>
                </div>
                <div className={styles.topbarRight}>
                    <StatusBadge status={project.status} />
                </div>
            </div >

            <div className={styles.layout}>

                {/* ── LEFT COLUMN ── */}
                <div className={styles.left}>

                    {/* Project Header */}
                    <div className={styles.projectHeader}>
                        <div className={styles.projectHeaderTop}>
                            <div>
                                <p className={styles.sdlcLabel}>{project.sdlc?.name ?? "—"}</p>
                                <h1 className={styles.projectTitle}>{project.name}</h1>
                                {project.description && (
                                    <p className={styles.projectDesc}>{project.description}</p>
                                )}
                            </div>
                        </div>

                        <div className={styles.projectMeta}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Owner</span>
                                <span className={styles.metaValue}>{project.owner?.name ?? "—"}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Current Phase</span>
                                <span className={styles.metaValue}>{currentPhase?.name ?? "—"}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Progress</span>
                                <span className={styles.metaValue}>{completedCount} / {phases.length} phases</span>
                            </div>
                        </div>

                        {/* Overall progress bar */}
                        <div className={styles.progressSection}>
                            <div className={styles.progressHeader}>
                                <span className={styles.progressLabel}>Overall Progress</span>
                                <span className={styles.progressPct}>{progress}%</span>
                            </div>
                            <div className={styles.progressTrack}>
                                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* ── PHASE PIPELINE ── */}
                    <div className={styles.phasesCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>SDLC Phases</h2>
                            <span className={styles.cardSub}>{completedCount} of {phases.length} complete</span>
                        </div>

                        <div className={styles.phaseList}>
                            {phases.map((phase, idx) => {
                                const isActive = phase.status === "active";
                                const isDone = phase.status === "complete";
                                const isLocked = phase.status === "locked";

                                return (
                                    <div
                                        key={phase.ID}
                                        className={`${styles.phaseItem}
                      ${isActive ? styles.phaseItemActive : ""}
                      ${isDone ? styles.phaseItemDone : ""}
                      ${isLocked ? styles.phaseItemLocked : ""}`}
                                    >
                                        {/* connector line */}
                                        {idx < phases.length - 1 && (
                                            <div className={`${styles.phaseConnector} ${isDone ? styles.phaseConnectorDone : ""}`} />
                                        )}

                                        {/* dot */}
                                        <div className={`${styles.phaseDot}
                      ${isActive ? styles.phaseDotActive : ""}
                      ${isDone ? styles.phaseDotDone : ""}
                      ${isLocked ? styles.phaseDotLocked : ""}`}
                                        >
                                            {isDone ? "✓" : isLocked ? "🔒" : phase.order}
                                        </div>

                                        {/* content */}
                                        <div className={styles.phaseContent}>
                                            <div className={styles.phaseTop}>
                                                <h3 className={styles.phaseName}>{phase.name}</h3>
                                                <StatusBadge status={phase.status} />
                                            </div>

                                            <div className={styles.phaseMeta}>
                                                {phase.is_required && (
                                                    <span className={styles.requiredTag}>Required</span>
                                                )}
                                                {phase.estimated_duration_days > 0 && (
                                                    <span className={styles.durationTag}>
                                                        ~{phase.estimated_duration_days}d
                                                    </span>
                                                )}
                                                {phase.completed_at && (
                                                    <span className={styles.completedTag}>
                                                        Completed {new Date(phase.completed_at).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {isActive && phase.unlocked_at && (
                                                    <span className={styles.unlockedTag}>
                                                        Started {new Date(phase.unlocked_at).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Phase actions */}
                                            {isActive && (
                                                <div className={styles.phaseActions}>
                                                    <button className={styles.phaseActionBtn}>
                                                        View Tasks
                                                    </button>
                                                    <button className={styles.phaseActionBtnOutline}>
                                                        Upload Document
                                                    </button>
                                                    <button className={styles.phaseCompleteBtn}>
                                                        Mark Complete →
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className={styles.right}>

                    {/* SDLC Info */}
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoCardTitle}>Methodology</h3>
                        <p className={styles.infoCardName}>{project.sdlc?.name ?? "—"}</p>
                        <p className={styles.infoCardDesc}>{project.sdlc?.description ?? ""}</p>
                    </div>

                    {/* Phase Summary */}
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoCardTitle}>Phase Summary</h3>
                        <div className={styles.summaryList}>
                            <div className={styles.summaryItem}>
                                <span className={`${styles.summaryDot} ${styles.summaryDotDone}`} />
                                <span className={styles.summaryLabel}>Complete</span>
                                <span className={styles.summaryNum}>{phases.filter(p => p.status === "complete").length}</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={`${styles.summaryDot} ${styles.summaryDotActive}`} />
                                <span className={styles.summaryLabel}>Active</span>
                                <span className={styles.summaryNum}>{phases.filter(p => p.status === "active").length}</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={`${styles.summaryDot} ${styles.summaryDotLocked}`} />
                                <span className={styles.summaryLabel}>Locked</span>
                                <span className={styles.summaryNum}>{phases.filter(p => p.status === "locked").length}</span>
                            </div>
                        </div>

                        {/* mini phase dots */}
                        <div className={styles.miniPhases}>
                            {phases.map(p => (
                                <div
                                    key={p.ID}
                                    title={p.name}
                                    className={`${styles.miniPhase}
                    ${p.status === "complete" ? styles.miniPhaseDone : ""}
                    ${p.status === "active" ? styles.miniPhaseActive : ""}
                    ${p.status === "locked" ? styles.miniPhaseLocked : ""}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Owner */}
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoCardTitle}>Owner</h3>
                        <div className={styles.ownerRow}>
                            <div className={styles.ownerAvatar}>{project.owner?.name?.[0]?.toUpperCase() ?? "?"}</div>
                            <div>
                                <p className={styles.ownerName}>{project.owner?.name ?? "—"}</p>
                                <p className={styles.ownerEmail}>{project.owner?.email ?? "—"}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}