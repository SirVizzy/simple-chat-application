import React, { useContext, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ChatContext } from '../../ChatStore';
import { SocketContext } from '../../socket.io';
import Controls from './Controls';
import Messages from './Messages';
import Users from './Users';

// rfc
export default function Chat() {
  const socket = useContext(SocketContext);
  const store = useContext(ChatContext);

  useEffect(() => {
    socket.on('connect', () => store.reset());
  }, [socket, store]);

  return (
    <Container>
      <Row>
        <Col className="p-0">
          <div className="p-2">
            <Users></Users>
          </div>
        </Col>
        <Col xs={9} className="p-0">
          <div className="p-2">
            <div className="messages">
              <Messages></Messages>
            </div>

            <div className="pt-3">
              <Controls></Controls>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
