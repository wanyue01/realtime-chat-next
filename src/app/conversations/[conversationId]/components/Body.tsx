'use client';

import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/app/types';
import { FC, useEffect, useRef, useState } from 'react';
import MessageBox from './MessageBox';
import service from '@/app/utils/interceptor';
import { pusherClient } from '@/app/libs/pusher';
import { find } from 'lodash';

interface BodyProps {
  initialMessages: FullMessageType[];
};

const Body: FC<BodyProps> = ({
  initialMessages,
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    service.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    // 订阅频道
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      // 收到消息便是看到这条消息了
      service.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        // 检查新消息是否存在
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    // 如果别人看到了自己发的消息，则触发
    const updateMessageHandler = (message: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === message.id) {
          return message;
        } else {
          return currentMessage;
        }
      }));
    };

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId]);

  return (
    <div className='flex-1 overflow-y-auto'>
      {messages.map((message, i) => (
        <MessageBox
          key={message.id}
          isLast={i === messages.length - 1}
          data={message}
        />
      ))}
      <div ref={bottomRef} className='pt-24' />
    </div>
  );
};

export default Body;