import { prisma } from '../../lib/prisma.js';

const createCommentInDB = async (userId: string, payload: any) => {
  const result = await prisma.comment.create({
    data: {
      ...payload,
      authorId: userId,
    },
    include: {
      author: { select: { name: true, profileImage: true } },
    },
  });
  return result;
};

const deleteCommentFromDB = async (commentId: string, userId: string, userRole: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  
  if (!comment) {
    throw new Error('Comment not found');
  }

  // Admins can delete any comment, members only their own
  if (userRole !== 'ADMIN' && comment.authorId !== userId) {
    throw new Error('You are not authorized to delete this comment');
  }

  const result = await prisma.comment.delete({ where: { id: commentId } });
  return result;
};

export const CommentServices = {
  createCommentInDB,
  deleteCommentFromDB,
};
