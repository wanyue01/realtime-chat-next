import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/',
  },
});

// 路由守卫
export const config = {
  matcher: [
    '/users/:path*',
    '/conversations/:path*',
  ],
};