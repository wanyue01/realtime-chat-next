import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { NextResponse } from 'next/server';

interface IParams {
  conversationId?: string;
};

/**
 * 
 * @param request 
 * @param param1 
 * @returns 根据conversationId和当前用户信息更新conversation最新消息的已读
 */
export async function POST(
  request: Request,
  { params }: { params: IParams },
) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;
    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse(JSON.stringify({ message: '你是哪位靓仔靓女？', respCode: 1 }), { status: 401 });
    }
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });
    if (!conversation) {
      return new NextResponse(JSON.stringify({ message: 'ID无效', respCode: 1 }), { status: 400 });
    }
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json({respCode: 0, data: conversation});
    }

    // 如果有最新的消息，就更新消息已看人员
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage]
    });

    // 如果之前已经看过这条消息
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json({respCode: 0, data: conversation});
    }

    await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

    return NextResponse.json({respCode: 0, data: updatedMessage});
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES_SEEN');
    return new NextResponse(JSON.stringify({ message: '服务器错误', respCode: 1 }), { status: 500 });
  }
}