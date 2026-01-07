export enum UserRole {
    ADMIN = 'ADMIN',
    STUDENT = 'STUDENT',
    CLIENT = 'CLIENT',
}

export enum ProjectStatus {
    PENDING = 'PENDING',
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum ApplicationStatus {
    APPLIED = 'APPLIED',
    SHORTLISTED = 'SHORTLISTED',
    REJECTED = 'REJECTED',
    ACCEPTED = 'ACCEPTED',
}

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    REVIEW_REQUIRED = 'REVIEW_REQUIRED',
    COMPLETED = 'COMPLETED',
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}
