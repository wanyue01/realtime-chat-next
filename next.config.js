/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [
      // 允许预渲染函数返回属性，这里用到的预渲染函数是getCurrentUser
      ["next-superjson-plugin", {}]
    ],
  },
  images: {
    domains: [
      'res.cloudinary.com', 
    ],
  },
};

module.exports = nextConfig
