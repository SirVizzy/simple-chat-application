/**
 * A simple socket.io server implementation.
 *
 * Possible changes;
 * - Use enums for states over strings.
 * - Shared interfaces between client-server.
 */

import { createServer } from 'http';
import { Server } from 'socket.io';
import { generateUsername } from './helpers';
import database from './database';
import { RowDataPacket } from 'mysql2';

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

interface User {
  id: string;
  username: string;
}

interface Message {
  user: User;
  message: string;
}

let users: Array<User> = []; // Stores all the users connected.
let messages: Array<Message> = []; // Stores the last few messages.

(async () => {
  // wait for some values to be initlaized
  await initalize();

  // fire up the socket.io server
  listen();
})();

async function initalize() {
  // Load the last few messages from the database for immediate access.
  try {
    const [rows] = await database.query<Array<RowDataPacket>>(
      'SELECT username, user_id, message FROM messages ORDER BY id DESC LIMIT 100'
    );
    rows.forEach((row) =>
      messages.push({
        user: {
          id: row.user_id,
          username: row.username,
        },
        message: row.message,
      })
    );
  } catch (err) {
    console.log(err);
  }
}

function listen() {
  io.on('connection', (socket: any) => {
    // Whenever a user connects, for simplicity sake, we will just give them a
    // randomized username.
    const user: User = {
      id: socket.id,
      username: generateUsername(),
    };

    // We can just re-emit all the current users and messages to the client. As a
    // project scales this may not be a great implementation but works perfectly
    // fine for something limited and small.
    users.forEach((user) =>
      socket.emit('user', {
        state: 'CONNECTED',
        user,
      })
    );
    messages.forEach((message) => {
      socket.emit('message', message);
    });

    // Let everyone know a new user has entered the chat.
    users.push(user);
    io.sockets.emit('user', {
      state: 'CONNECTED',
      user,
    });

    socket.on('disconnect', () => {
      users = users.filter((i) => i.id !== socket.id);
      io.sockets.emit('user', {
        state: 'DISCONNECTED',
        user,
      });
    });

    // All incoming chat messages.
    socket.on('message', async (messageText: string, callback: Function) => {
      try {
        // As a simple antiflood feature we will only allow up to 3 messages
        // from the same user at the same time.
        if (messages.slice(messages.length - 3, messages.length).every((i) => i.user.id === user.id)) {
          return callback("You've sent 3 messages in a row, calm down buddy.");
        }

        await database.query('INSERT INTO messages(message, username, user_id) VALUES (?)', [[messageText, user.username, user.id]]);

        const message: Message = {
          user,
          message: messageText,
        };
        if (messages.length >= 100) messages.shift();
        messages.push(message);

        io.sockets.emit('message', message);
      } catch (err) {
        console.log(err);
      }
    });
  });

  server.listen(3001);
}
