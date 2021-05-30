import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from './components/Chat/Chat';
import { ChatStore, ChatContext } from './ChatStore';
import { socket, SocketContext } from './socket.io';

const store = new ChatStore();
ReactDOM.render(
  <React.StrictMode>
    <ChatContext.Provider value={store}>
      <SocketContext.Provider value={socket}>
        <Chat />
      </SocketContext.Provider>
    </ChatContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
