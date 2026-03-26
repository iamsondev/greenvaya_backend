import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VoteServices } from './vote.service';

const toggleVote = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { ideaId } = req.params;
  const { type } = req.body;

  const result = await VoteServices.toggleVoteInDB(userId, ideaId as string, type);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vote updated successfully',
    data: result,
  });
});

export const VoteControllers = {
  toggleVote,
};
