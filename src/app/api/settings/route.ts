import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      name,
      image,
    } = body;

    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse(JSON.stringify({ message: '你是哪位靓仔靓女？', respCode: 1 }), { status: 401 });
    }

    const updateUser = await prisma?.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        image,
      }
    });

    return NextResponse.json({respCode: 0, data: updateUser});
  } catch (error) {
    console.log(error, 'ERROR_SETTINGS');
    return new NextResponse(JSON.stringify({ message: '服务器错误', respCode: 1 }), { status: 500 });
  }
}