import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  constructor() { }

  public connect(): void {
    this.socket = io('http://localhost:3000', {transports: ['polling']}); 
  }

  public emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  public on(eventName: string, callback: (data: any) => void): void {
    this.socket.on(eventName, callback);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}
