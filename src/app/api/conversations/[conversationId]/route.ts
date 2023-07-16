import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { NextResponse } from 'next/server';

interface IParams {
  conversationId: string;
};

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse(JSON.stringify({ message: '你是哪位靓仔靓女？', respCode: 1 }), { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    if (!existingConversation) {
      return new NextResponse(JSON.stringify({ message: 'ID无效', respCode: 1 }), { status: 400 });
    }

    const deleteConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    // 推送删除对话的ws
    existingConversation.users.forEach(user => {
      pusherServer.trigger(user.email!, 'conversation:remove', existingConversation);
    });

    return NextResponse.json({respCode: 0, data: deleteConversation});
  } catch (error) {
    console.log(error, 'ERROR_CONVERSATION_DELETE');
    return new NextResponse(JSON.stringify({ message: '服务器错误', respCode: 1 }), { status: 500 });
  }
};