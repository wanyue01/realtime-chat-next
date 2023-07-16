# realtime-chat-next(基于nextjs, pusher)
- 😊写这个的目的主要是之前软工课设时这个功能没有完全实现，算是弥补遗憾吧
- 😊希望能给有需要的人一点帮助，共同进步！

### 启动方法
```shell
npm run dev
yarn dev
```
### .env配置文件
```env
# 本地的话要开mongodb集群，比较麻烦
# DATABASE_URL="mongodb://wanyue:wanyue@127.0.0.1:27017/realtimeChat"
DATABASE_URL=""
NEXTAUTH_SECRET=""

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

NEXT_PUBLIC_PUSHER_APP_KEY=
PUSHER_APP_ID=
PUSHER_SECRET=