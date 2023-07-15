import prisma from '@/app/libs/prismadb';

const getMessages = async (
  conversationId: string,
) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        seen: true,
        sender: true,
      },
      orderBy: {
        createAt: 'asc',
      },
    });
    return messages;
  } catch (error) {
    return [];
  }
};

export default getMessages;