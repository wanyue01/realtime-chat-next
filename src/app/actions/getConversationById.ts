import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getConversationById = async (
  conversationId: string,
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.email) {
      return null;
    }
    // console.log(444,conversationId)
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    // console.log(2)
    return conversation;
  } catch (error) {
    // console.log(error?.message)
    return null;
  }
};

export default getConversationById;