import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      message,
      image,
      conversationId,
    } = body;

    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse(JSON.stringify({ message: '你是哪位靓仔靓女？', respCode: 1 }), { status: 401 });
    }

    const newMessage = await prisma?.message.create({
      data: {
        body: message,
        image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
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

    // 发送消息后要更新对话
    const updateConversation = await prisma?.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        laseMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage?.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    return NextResponse.json({respCode: 0, data: newMessage});
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse(JSON.stringify({ message: '服务器错误', respCode: 1 }), { status: 500 });
  }
}