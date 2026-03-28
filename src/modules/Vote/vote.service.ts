import { prisma } from '../../lib/prisma.js';
import { VoteType } from '@prisma/client';

const toggleVoteInDB = async (userId: string, ideaId: string, type: VoteType) => {
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_ideaId: { userId, ideaId },
    },
  });

  if (existingVote) {
    if (existingVote.type === type) {
      // Remove vote if same type is clicked again
      return await prisma.vote.delete({
        where: { id: existingVote.id },
      });
    } else {
      // Update vote if different type is clicked
      return await prisma.vote.update({
        where: { id: existingVote.id },
        data: { type },
      });
    }
  }

  // Create new vote
  return await prisma.vote.create({
    data: { userId, ideaId, type },
  });
};

export const VoteServices = {
  toggleVoteInDB,
};
