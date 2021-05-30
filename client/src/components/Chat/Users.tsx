import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { ChatContext } from '../../ChatStore';
import { SocketContext } from '../../socket.io';

export default observer(function Users() {
  const socket = useContext(SocketContext);
  const store = useContext(ChatContext);

  useEffect(() => {
    socket.on('user', ({ state, user }) => {
      switch (state) {
        case 'CONNECTED':
          store.addUser(user);
          break;
        case 'DISCONNECTED':
          store.removeUser(user);
          break;
      }
    });
  }, [socket, store]);

  return (
    <ListGroup>
      {store.getUsers.map(({ id, username }) => {
        return <ListGroup.Item key={id}>{username}</ListGroup.Item>;
      })}
    </ListGroup>
  );
});
