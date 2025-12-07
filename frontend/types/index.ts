// User types
// Notification Types
export enum NotificationType {
    LIKE = 'LIKE',
    COMMENT = 'COMMENT',
    FOLLOW = 'FOLLOW'
}

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    actorId: string;
    postId?: string;
    commentId?: string;
    message: string;
    read: boolean;
    createdAt: string;
    actor?: {
        id: string;
        name: string;
        profileImage?: string | null;
    };
}
export interface User {
    id: string;
    email: string;
    phoneNumber?: string | null;
    name: string;
    headline?: string | null;
    summary?: string | null;
    location?: string | null;
    profileImage?: string | null;
    resume?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Experience {
    id: string;
    userId: string;
    title: string;
    company: string;
    startDate: string;
    endDate?: string | null;
    description?: string | null;
}

export interface Education {
    id: string;
    userId: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string | null;
}

export interface Skill {
    id: string;
    userId: string;
    name: string;
}

// Company types
export interface Company {
    id: string;
    name: string;
    domain?: string | null;
    gstNumber?: string | null;
    cin?: string | null;
    verified: boolean;
    logo?: string | null;
    about?: string | null;
    location?: string | null;
    size?: string | null;
    industry?: string | null;
    createdAt: string;
    updatedAt: string;
}

// Job types
export interface Job {
    id: string;
    companyId: string;
    postedById: string;
    title: string;
    description: string;
    location?: string | null;
    salaryRange?: string | null;
    employmentType?: string | null;
    requirements: string[];
    isSponsored: boolean;
    createdAt: string;
    expiresAt?: string | null;
    company?: Company;
    postedBy?: User;
}

export interface Application {
    id: string;
    jobId: string;
    userId: string;
    resume?: string | null;
    coverLetter?: string | null;
    status: ApplicationStatus;
    score?: number | null;
    appliedAt: string;
}

export enum ApplicationStatus {
    APPLIED = 'APPLIED',
    REVIEWING = 'REVIEWING',
    SHORTLISTED = 'SHORTLISTED',
    REJECTED = 'REJECTED',
    HIRED = 'HIRED',
}

// Post types
export interface Post {
    id: string;
    authorId: string;
    content: string;
    media: string[];
    likesCount: number;
    createdAt: string;
    updatedAt: string;
    author?: {
        id: string;
        name: string;
        profileImage?: string | null;
        headline?: string | null;
    };
    comments?: Comment[];
    likes?: Like[];
    _count?: {
        comments: number;
        likes: number;
    };
    isLiked?: boolean;
}

export interface Comment {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    createdAt: string;
    author?: User;
}

export interface Like {
    id: string;
    postId: string;
    userId: string;
    user?: User;
}

// Connection types
export interface Connection {
    id: string;
    followerId: string;
    followingId: string;
    status: ConnectionStatus;
    createdAt: string;
    follower?: User;
    following?: User;
}

export enum ConnectionStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    IGNORED = 'IGNORED',
}

// Message types
export interface Conversation {
    id: string;
    createdAt: string;
    updatedAt: string;
    participants?: ConversationParticipant[];
    messages?: Message[];
}

export interface ConversationParticipant {
    conversationId: string;
    userId: string;
    joinedAt: string;
    user?: User;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
}

// Auth types
export interface AuthTokens {
    accessToken: string;
    idToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    email: string;
    password: string;
    name: string;
    phoneNumber?: string;
}

// API Response types
export interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}
