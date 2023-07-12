import bcrypt from 'bcrypt';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();
    const {
      email,
      name,
      password,
    } = body;

    if (!email || !name || !password) {
      return new NextResponse(JSON.stringify({ message: '参数错误', respCode: 1 }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json({ data: user, respCode: 0 });
  } catch (error) {
    console.log(error, 'REGISTER_ERROR');
    return new NextResponse(JSON.stringify({ message: '服务器错误或用户已存在', respCode: 1 }), { status: 500 });
  }
};