"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./project.module.css";
import { apiFetch } from "@/utils/api";
import { phaseProgress } from "@/helpers/phase_helper";

import { StatusBadge } from "@/helpers/status_helper";
import { getStatusStyle } from "@/helpers/member_helper";

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [data, setData] = useState<ProjectDetail | null>(null);
    const [dataMembers, setDataMembers] = useState<ProjectMembers[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [error, setError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [email, setEmail] = useState("");
    const [showModalMessage, setShowModalMessage] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await apiFetch(`projects/${id}`);

                if (!res.ok) {
                    throw new Error("Failed to fetch project");
                }

                const json = await res.json();
                console.log(json.data);
                setData(json.data);
            } catch (err) {
                console.error(err);
                setError("Could not load project. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const fetchProjectMembers = async () => {
            try {
                const res = await apiFetch(`projects/${id}/members`);

                if (!res.ok) {
                    throw new Error("Failed to fetch project members");
                }
                const json = await res.json();
                setDataMembers(json.data);
            } catch (err) {
                console.error(err);
                setError("Could not load project members. Please try again.");
            }
            finally {
                setLoadingMembers(false);
            }
        }

        if (id) {
            fetchProject();
            fetchProjectMembers();
        }
    }, [id]);

    const handleDeleteProject = async () => {
        try {
            const res = await apiFetch(`projects/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete project");
            }
            const json = await res.json();
            console.log("Project deleted:", json);
            setShowModalMessage(true);
            setMessage("Project deleted successfully.");
        }
        catch (err) {
            console.error(err);
            setError("Could not delete project. Please try again.");
        }
    };

    const handleInviteMember = async () => {
        try {
            // const res = await apiFetch(`projects/${id}/invite`, {
            //     method: "POST",
            //     body: JSON.stringify({ email }),
            // });

            // if (!res.ok) {
            //     throw new Error("Failed to send invite");
            // }
            // alert(`Invite sent to ${email}`);
            // setEmail("");
            // setShowInviteModal(false);
            alert("invite");
        }
        catch (err) {
            console.error(err);
            setError("Could not send invite. Please try again.");
        }
    };

    const filteredMembers = dataMembers?.filter(
        (m) => m.status === "accepted" || m.status === "pending"
    );

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
                                <h1 className={styles.projectTitle}>{project.name.toUpperCase()}</h1>
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
                                    title={p.name.toUpperCase()}
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

                    {/* Members */}
                    {/* Members */}
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoCardTitle}>Project Members</h3>

                        {loadingMembers ? (
                            <p>Loading members...</p>
                        ) : (
                            <>
                                {filteredMembers && filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <div
                                            key={`${member.project_id}-${member.user_id}`}
                                            className={styles.ownerRow}
                                        >
                                            <div className={styles.ownerAvatar}>
                                                {member.email?.[0]?.toUpperCase() ?? "?"}
                                            </div>

                                            <div>
                                                <p className={styles.ownerName}>{member.email}</p>

                                                <p className={styles.ownerEmail}>
                                                    {member.role} •{" "}
                                                    <span className={getStatusStyle(member.status)}>
                                                        {member.status}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No members found</p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Setting */}
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoCardTitle}>Project Settings</h3>
                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Invite Members
                            </button>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                            >
                                Delete Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    {/* Dark Modal Container */}
                    <div className="bg-gray-900 border border-gray-700 text-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-semibold">Delete Project</h2>
                        <p className="mt-2 text-gray-400">
                            This action cannot be undone. Are you sure you want to delete this
                            project?
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Delete Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 text-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-semibold">Invite Member</h2>

                        <input
                            type="email"
                            placeholder="member@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-4 border rounded-lg px-3 py-2"
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleInviteMember}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Send Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showModalMessage && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 text-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <p className="text-center">{message}</p>
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => {
                                    setShowModalMessage(false);
                                    if (message.includes("deleted")) {
                                        router.push("/dashboard");
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}