import { prisma } from '../../lib/prisma.js';
import { IdeaStatus } from '@prisma/client';
import { AppError } from '../../errors/AppError.js';
import httpStatus from 'http-status';

const createIdeaIntoDB = async (authorId: string, payload: any) => {
  const { images, status, ...ideaData } = payload;

  const result = await prisma.idea.create({
    data: {
      ...ideaData,
      authorId,
      status: status || IdeaStatus.DRAFT, // Default to DRAFT if not provided
      images: {
        create: images?.map((url: string) => ({ url })) || [],
      },
    },
    include: {
      images: true,
      category: true,
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return result;
};

const getAllIdeasFromDB = async (query: any) => {
  const {
    searchTerm,
    category,
    status,
    isPaid,
    page = 1,
    limit = 12,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    authorId,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = {};

  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm as string, mode: 'insensitive' } },
      { description: { contains: searchTerm as string, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = { name: category };
  }

  if (status) {
    where.status = status;
  }

  if (isPaid !== undefined) {
    where.isPaid = isPaid === 'true';
  }

  if (authorId) {
    where.authorId = authorId;
  }

  // Define sorting logic
  let orderBy: any = {};
  if (sortBy === 'votes') {
    orderBy = { votes: { _count: sortOrder } };
  } else if (sortBy === 'comments') {
    orderBy = { comments: { _count: sortOrder } };
  } else {
    orderBy = { [sortBy]: sortOrder };
  }

  const [result, total] = await Promise.all([
    prisma.idea.findMany({
      where,
      include: {
        images: true,
        category: true,
        author: {
          select: { name: true, email: true },
        },
        _count: {
          select: { votes: true, comments: true },
        },
      },
      orderBy,
      skip,
      take,
    }),
    prisma.idea.count({ where }),
  ]);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: result,
  };
};

const getSingleIdeaFromDB = async (id: string, userId?: string) => {
  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      images: true,
      category: true,
      author: {
        select: { id: true, name: true, email: true },
      },
      comments: {
        where: { parentId: null },
        include: {
          author: { select: { name: true, profileImage: true } },
          replies: {
            include: {
              author: { select: { name: true, profileImage: true } },
            },
          },
        },
      },
      _count: {
        select: { votes: true },
      },
    },
  });

  if (!idea) {
    throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
  }

  // Handle Paid Idea logic
  if (idea.isPaid && idea.authorId !== userId) {
    const payment = await prisma.payment.findUnique({
      where: {
        userId_ideaId: {
          userId: userId || '',
          ideaId: id,
        },
      },
    });

    if (!payment || payment.status !== 'SUCCESS') {
      return {
        id: idea.id,
        title: idea.title,
        isPaid: true,
        price: idea.price,
        status: idea.status,
        createdAt: idea.createdAt,
        author: idea.author,
        category: idea.category,
        images: idea.images,
        _count: idea._count,
        message: 'This is a paid idea. Please pay to see full details.',
      };
    }
  }

  return idea;
};

const updateIdeaInDB = async (id: string, userId: string, payload: any) => {
  const idea = await prisma.idea.findUnique({ where: { id } });

  if (!idea) {
    throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
  }

  if (idea.authorId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to edit this idea',
    );
  }

  if (idea.status === IdeaStatus.APPROVED) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot edit an approved idea');
  }

  const result = await prisma.idea.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteIdeaFromDB = async (id: string, userId: string, userRole: string) => {
  const idea = await prisma.idea.findUnique({ where: { id } });

  if (!idea) {
    throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
  }

  // Admins can delete any, members only their own unpublished
  if (userRole !== 'ADMIN') {
    if (idea.authorId !== userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not authorized to delete this idea',
      );
    }
    if (idea.status === IdeaStatus.APPROVED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Cannot delete an approved idea',
      );
    }
  }

  return await prisma.idea.delete({ where: { id } });
};

const submitIdeaForReview = async (id: string, userId: string) => {
  const idea = await prisma.idea.findUnique({ where: { id } });

  if (!idea) {
    throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
  }

  if (idea.authorId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to submit this idea',
    );
  }

  if (idea.status !== IdeaStatus.DRAFT) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only draft ideas can be submitted for review',
    );
  }

  return await prisma.idea.update({
    where: { id },
    data: { status: IdeaStatus.UNDER_REVIEW },
  });
};

const adminActionInDB = async (
  id: string,
  payload: { status: IdeaStatus; feedback?: string },
) => {
  const idea = await prisma.idea.findUnique({ where: { id } });

  if (!idea) {
    throw new AppError(httpStatus.NOT_FOUND, 'Idea not found');
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedIdea = await tx.idea.update({
      where: { id },
      data: { status: payload.status },
    });

    if (payload.status === IdeaStatus.REJECTED && payload.feedback) {
      await tx.adminFeedback.upsert({
        where: { ideaId: id },
        create: { ideaId: id, feedback: payload.feedback },
        update: { feedback: payload.feedback },
      });
    }

    return updatedIdea;
  });

  return result;
};

export const IdeaServices = {
  createIdeaIntoDB,
  getAllIdeasFromDB,
  getSingleIdeaFromDB,
  updateIdeaInDB,
  deleteIdeaFromDB,
  submitIdeaForReview,
  adminActionInDB,
};
