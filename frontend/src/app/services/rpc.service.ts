import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class RpcService {
  private url = 'http://localhost:3000/api';
  constructor() { }

  public ask(endpoint: any, params: any, callback: any) {
    let body = {
      endpoint: endpoint,
      id: 1,
      jsonrpc: "2.0",
      params: params
    };

    axios({
      url: this.url,
      data: body,
      method: 'post'
    })
    .then(response => {
      if (response) {
        callback(null, response.data);
      }
    })
    .catch(err => {
      if (err) {
        callback(err, null);
      }
    });
  }
}
