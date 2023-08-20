import {
  Avatar,
  Message,
  MessageList,
  MessageSeparator,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

const MessageList = () => {
  return (
    <div
      style={{
        height: '500px',
        overflow: 'hidden',
      }}
    >
      <MessageList
        typingIndicator={<TypingIndicator content="Eliot is typing" />}
      >
        <MessageSeparator content="Saturday, 30 November 2019" />

        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Eliot',
            direction: 'incoming',
            position: 'single',
          }}
        >
          <Avatar src={'favicon.ico'} name="Eliot" />
        </Message>
        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Zoe',
            direction: 'outgoing',
            position: 'single',
          }}
        />
        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Eliot',
            direction: 'incoming',
            position: 'first',
          }}
          avatarSpacer={true}
        />
      </MessageList>
    </div>
  );
};
