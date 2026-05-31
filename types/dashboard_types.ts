interface User {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    name: string;
    email: string;
    role: string;
}

interface SDLC {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    name: string;
    description: string;
    is_active: boolean;
    created_by_id: number;
    created_by: User;
}

interface ProjectListItem {
    id: number;
    name: string;
    email: string;
    status: string;
    sdlc_name: string;
    current_phase: string;
}

interface Project {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    name: string;
    description: string;
    status: "active" | "archived";
    owner_id: number;
    owner: User;
    sdlc_id: number;
    sdlc: SDLC;
    current_phase_id: number;
}