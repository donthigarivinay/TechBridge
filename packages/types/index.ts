export enum UserRole {
    ADMIN = 'ADMIN',
    STUDENT = 'STUDENT',
    CLIENT = 'CLIENT',
}

export enum ProjectStatus {
    PENDING = 'PENDING',
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DELIVERED = 'DELIVERED',
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
    IN_REVIEW = 'IN_REVIEW',
    DONE = 'DONE',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export enum ProjectRequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum StudentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum PaymentType {
    PROJECT_BUDGET = 'PROJECT_BUDGET',
    SALARY_DISTRIBUTION = 'SALARY_DISTRIBUTION',
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}
