import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

// 处理单聊群聊
export async function POST(
  request: Request
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      userId,
      isGroup,
      members,
      name,
    } = body;

    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse(JSON.stringify({ message: '你是哪位靓仔靓女？', respCode: 1 }), { status: 401 });
    }

    if (isGroup && (!members.length || members.length < 2 || !name)) {
      return new NextResponse(JSON.stringify({ message: '参数错误', respCode: 1 }), { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              // 这里的members不包含当前用户，因此connect要补上当前用户
              ...members.map((member: { value: string }) => ({
                id: member.value
              })),
              {
                id: currentUser.id,
              }
            ]
          }
        },
        // 返回关联的数据
        include: {
          users: true,
        }
      });

      return NextResponse.json({
        respCode: 0,
        data: newConversation,
      });
    }

    // 单聊
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];
    if (singleConversation) {
      return NextResponse.json({
        respCode: 0,
        data: singleConversation,
      });
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json({
      respCode: 0,
      data: newConversation,
    });
  } catch (error) {
    console.log(error, 'ERROR_MESSAGE_SEND');
    return new NextResponse(JSON.stringify({ message: '服务器错误', respCode: 1 }), { status: 500 });
  }
}