import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { AppConfigService } from '../AppConfigService.service';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
   socket:any= Socket;
   Lien:any=""
  constructor(public AppConfigService:AppConfigService) {
    this.socket = io(this.AppConfigService.getConfig('ApiSignaturePadsend'))//io('http://192.168.1.12:6001/'); // Remplace par ton adresse serveur si nécessaire
  }



  // Écoute la réception d'une signature en temps réel
  onReceiveSignature(): Observable<any> {
    return new Observable(observer => {//@ts-ignore
      this.socket.on('receive_signature', (data) => {
        observer.next(data);
      });
    });
  }

  // Envoie une signature
  sendSignature(signatureInfo: any) {
    this.socket.emit('send_signature', signatureInfo);
  }

  
}