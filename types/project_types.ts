interface Owner {
    ID: number;
    name: string;
    email: string;
    role: string;
}

interface SDLC {
    ID: number;
    name: string;
    description: string;
    is_active: boolean;
}

interface Projects {
    ID: number;
    name: string;
    description: string;
    status: "active" | "archived";
    owner_id: number;
    owner: Owner;
    sdlc_id: number;
    sdlc: SDLC;
    current_phase_id: number;
}

interface Phase {
    ID: number;
    name: string;
    order: number;
    status: "active" | "locked" | "complete";
    is_required: boolean;
    estimated_duration_days: number;
    allowed_doc_types: string;
    unlocked_at: string | null;
    completed_at: string | null;
    project_id: number;
    sdlc_step_id: number;
}

interface ProjectDetail {
    project: Project;
    phases: Phase[];
}

interface ProjectMembers {
    user_id: number;
    project_id: number;
    role: string;
    status: "accepted" | "pending" | "rejected";
    email: string;
}