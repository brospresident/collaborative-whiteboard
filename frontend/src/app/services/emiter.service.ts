import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmiterService {
  private emiter: any;
  constructor() { 
    this.emiter = new EventEmitter();
  }

  public broadcast(eventName: string, params: any) {
    this.emiter.emit(eventName, params);
  }

  public on(eventName: string, callback: any) {
    this.emiter.addListener(eventName, callback);
    return () => {
      this.emiter.removeListener(eventName, callback);
    }
  }
}
