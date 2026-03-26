import { prisma } from '../../lib/prisma';
import { IdeaStatus } from '../../generated/prisma/enums';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';

const createIdeaIntoDB = async (authorId: string, payload: any) => {
  const { images, ...ideaData } = payload;
  
  const result = await prisma.idea.create({
    data: {
      ...ideaData,
      authorId,
      status: IdeaStatus.UNDER_REVIEW, // Initial status
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
  const { searchTerm, category, status, isPaid } = query;
  
  const where: any = {};
  
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
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

  const result = await prisma.idea.findMany({
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
    orderBy: { createdAt: 'desc' },
  });
  return result;
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
          replies: { include: { author: { select: { name: true, profileImage: true } } } },
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
    // Check if user has paid for this idea
    const payment = await prisma.payment.findUnique({
      where: {
        userId_ideaId: {
          userId: userId || '',
          ideaId: id,
        },
      },
    });

    if (!payment || payment.status !== 'SUCCESS') {
      // Return partial data for paid ideas
      return {
        id: idea.id,
        title: idea.title,
        isPaid: true,
        price: idea.price,
        author: idea.author,
        category: idea.category,
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
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to edit this idea');
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

const adminActionInDB = async (id: string, payload: { status: IdeaStatus; feedback?: string }) => {
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
  adminActionInDB,
};
