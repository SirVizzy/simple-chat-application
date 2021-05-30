import { createContext } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001/');
const SocketContext = createContext(socket);

export { socket, SocketContext };
