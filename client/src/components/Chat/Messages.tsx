import React, { useContext, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { ChatContext } from '../../ChatStore';
import { SocketContext } from '../../socket.io';
import { useRef } from 'react';

// TODO: Create Message component.
const Messages = observer(() => {
  const endOfMessages = useRef<null | HTMLDivElement>(null);
  const socket = useContext(SocketContext);
  const store = useContext(ChatContext);

  useEffect(() => {
    // Listen for incoming messages.
    socket.on('message', function (message) {
      // An incoming message has been received.
      store.addMessage(message);

      // Scroll down view.
      endOfMessages.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [socket, store]);

  return (
    <div>
      {store.getMessages.map(({ user, message }, index) => {
        return (
          <div key={index}>
            <div className="mb-1">{user.username}</div>
            <Card className="mb-3">
              <Card.Body className="p-3">
                <Card.Text>{message}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        );
      })}

      <div ref={endOfMessages}></div>
    </div>
  );
});

export default Messages;
