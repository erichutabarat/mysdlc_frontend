import styles from "../app/(dashboard)/dashboard/projects/[id]/project.module.css";

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

export { StatusBadge };