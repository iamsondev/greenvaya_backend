import { prisma } from '../../lib/prisma';
import { Role } from '../../generated/prisma/enums';
import bcrypt from 'bcrypt';
import { TUser } from './user.interface';

const getAllUsersFromDB = async () => {
    const result = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
};

const getSingleUserFromDB = async (id: string) => {
    const result = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
};

const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
    const result = await prisma.user.update({
        where: { id },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
};

export const UserServices = {
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserIntoDB,
};
