import React, { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { SocketContext } from '../../socket.io';

export default function Controls() {
  const socket = useContext(SocketContext);
  const handleSubmit = (event: any) => {
    event.preventDefault();

    // Send values to the server.
    socket.emit('message', event.target.message.value, (err: string) => {
      alert(err);
    });

    // Clear values.
    event.target.message.value = '';
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-0">
        <Form.Label>Message</Form.Label>
        <Form.Control as="textarea" rows={3} name="message" />
      </Form.Group>

      <Button variant="primary" className="float-right mt-1" type="submit">
        Send
      </Button>
    </Form>
  );
}
