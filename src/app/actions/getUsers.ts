import prisma from '@/app/libs/prismadb';
import getSession from './getSession';

const getUsers =async () => {
  const session = await getSession();

  // 如果是非法用户
  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createAt: 'desc',
      },
      where: {
        NOT: {
          email: session.user.email,  // 排除用户自己
        }
      }
    });

    return users;
  } catch (error) {
    return [];
  }
};

export default getUsers;