import styles from "../app/(dashboard)/dashboard.module.css";

const getStatusStyle = (status: string) => {
    switch (status) {
        case "accepted":
            return styles.statusAccepted; // green
        case "pending":
            return styles.statusPending; // gray
        default:
            return "";
    }
};

export { getStatusStyle };