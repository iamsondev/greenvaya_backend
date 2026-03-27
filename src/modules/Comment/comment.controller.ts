import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { CommentServices } from './comment.service.js';

const createComment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CommentServices.createCommentInDB(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment posted successfully',
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;
  const result = await CommentServices.deleteCommentFromDB(id as string, userId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted successfully',
    data: result,
  });
});

export const CommentControllers = {
  createComment,
  deleteComment,
};
