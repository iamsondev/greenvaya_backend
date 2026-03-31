import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { UserServices } from './user.service.js';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.getAllUsersFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserServices.getSingleUserFromDB(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserServices.updateUserIntoDB(id as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
});

const getMyProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await UserServices.getSingleUserFromDB(user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile retrieved successfully',
        data: result,
    });
});

const updateMyProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    // Prevent updating role and isActive status for current user via this route
    const { role, isActive, ...updateData } = req.body;
    
    const result = await UserServices.updateUserIntoDB(user.id, updateData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
});

export const UserControllers = {
    getAllUsers,
    getSingleUser,
    updateUser,
    getMyProfile,
    updateMyProfile,
};
