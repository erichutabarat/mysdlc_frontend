import styles from "../app/(dashboard)/dashboard.module.css";

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

export { ProgressBar };