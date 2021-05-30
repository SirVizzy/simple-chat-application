import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';

interface Message {
  user: User;
  message: string;
}

interface User {
  id: string;
  username: string;
}

class ChatStore {
  users: Array<User> = [];
  messages: Array<Message> = [];

  constructor() {
    makeAutoObservable(this);
  }

  get getMessages() {
    return this.messages;
  }

  get getUsers() {
    return this.users;
  }

  reset() {
    this.users = [];
    this.messages = [];
  }

  addUser(user: User) {
    this.users.push(user);
  }

  removeUser(user: User) {
    this.users = this.users.filter((i) => i.id !== user.id);
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }
}

const StoreContext = createContext(new ChatStore());
export { ChatStore, StoreContext as ChatContext };
