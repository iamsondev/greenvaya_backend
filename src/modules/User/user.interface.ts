import { Role } from '@prisma/client';

export type TUserRole = keyof typeof Role;

export interface TUser {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: Role;
    isActive: boolean;
    profileImage?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
