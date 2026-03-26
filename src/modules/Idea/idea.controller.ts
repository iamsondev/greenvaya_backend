import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { IdeaServices } from './idea.service.js';

const createIdea = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await IdeaServices.createIdeaIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Idea created and submitted for review',
    data: result,
  });
});

const getAllIdeas = catchAsync(async (req: Request, res: Response) => {
  const result = await IdeaServices.getAllIdeasFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ideas retrieved successfully',
    data: result,
  });
});

const getSingleIdea = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const result = await IdeaServices.getSingleIdeaFromDB(id as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Idea retrieved successfully',
    data: result,
  });
});

const updateIdea = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const result = await IdeaServices.updateIdeaInDB(id as string, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Idea updated successfully',
    data: result,
  });
});

const adminAction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await IdeaServices.adminActionInDB(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Idea ${req.body.status.toLowerCase()} successfully`,
    data: result,
  });
});

export const IdeaControllers = {
  createIdea,
  getAllIdeas,
  getSingleIdea,
  updateIdea,
  adminAction,
};
