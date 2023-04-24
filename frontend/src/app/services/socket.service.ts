import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  constructor() { }

  public connect(id: any): void {
    this.socket = io('http://localhost:3000', {transports: ['polling']}); 
    console.log(id);
    this.emit('joinedOnDrawer', JSON.stringify({id}));
  }

  public emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  public on(eventName: string, callback: (data: any) => void): void {
    this.socket.on(eventName, callback);
  }

  public disconnect(id: any): void {
    this.socket.disconnect();
    this.emit('leftDrawer', JSON.stringify({id}));
  }
}
