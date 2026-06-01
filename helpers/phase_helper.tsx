function phaseProgress(phases?: Phase[]) {
    if (!phases || phases.length === 0) return 0;

    const total = phases.length;
    const done = phases.filter(p => p.status === "complete").length;

    return Math.round((done / total) * 100);
}

export { phaseProgress };