import styles from "../app/(dashboard)/dashboard.module.css";

function phaseProgress(phases?: Phase[]) {
    if (!phases || phases.length === 0) return 0;

    const total = phases.length;
    const done = phases.filter(p => p.status === "complete").length;

    return Math.round((done / total) * 100);
}

function PhaseStatusBadge({ phase, status }: { phase: string; status: string }) {
    // Determine color based on status (simple example)
    const statusColor = status === "active" ? "text-green-700" : "text-orange-700";

    return (
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg shadow-sm">
            {/* Status Indicator with a dot */}
            <span className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide ${statusColor}`}>
                <span className={`w-2 h-2 rounded-full bg-current`} />
                {status.toUpperCase()}
            </span>

            {/* Divider */}
            <span className="text-gray-700">|</span>

            {/* Phase Name */}
            <span className="text-sm font-medium text-gray-300">
                {phase}
            </span>
        </div>
    );
}

export { phaseProgress, PhaseStatusBadge };