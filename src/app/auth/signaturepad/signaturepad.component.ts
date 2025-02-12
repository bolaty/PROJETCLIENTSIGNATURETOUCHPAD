import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolsService } from 'src/app/services/tools.service';
import { LoaderService } from 'src/app/services/loader.service';
import { LangueService } from 'src/app/services/langue.service';

import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';

declare var Mmenu: any;
declare var $: any;

import SignaturePad from 'signature_pad';
@Component({
  selector: 'app-signaturepad',
  templateUrl: './signaturepad.component.html',
  styleUrls: ['./signaturepad.component.scss']
})
export class SignaturepadComponent implements AfterViewInit {
  @ViewChild('signaturePad') signaturePadElement: any;
  Donnee_de_connexion: any = JSON.parse(
    sessionStorage.getItem('donnee_de_connexion') || '{}'
  );
  signaturePad: any;
  retourservice:any=[]
  signatureInfo: any;
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _alertService: AlertService,
    private _notificationService: NotificationService,
    private _toolsService: ToolsService,
    public _loaderService: LoaderService,
    private socketService: SocketService,
    public _langueService: LangueService
  ) {}

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
  }

  clear() {
    this.signaturePad.clear();
  }

  save() {
    const signature = this.signaturePad.toDataURL('image/png');
    // Envoi de la signature au backend
    this.uploadSignature(signature);
  }

  uploadSignature(signature: string) {
    // Méthode pour envoyer la signature au serveur via un service Angular

    this._loaderService._show();

    let body = {
        'AG_CODEAGENCE': this.Donnee_de_connexion[0].AG_CODEAGENCE,
        'SIGNATURE': signature,
        'SG_CODESIGNATURE':this.Donnee_de_connexion[0].SG_CODESIGNATURE,
        'OP_CODEOPERATEUR': this.Donnee_de_connexion[0].OP_CODEOPERATEUR,
        'CL_IDCLIENT': this.Donnee_de_connexion[0].CL_IDCLIENT == null ? "" : this.Donnee_de_connexion[0].CL_IDCLIENT,
        'EJ_IDEPARGNANTJOURNALIER': this.Donnee_de_connexion[0].EJ_IDEPARGNANTJOURNALIER == null ? "" : this.Donnee_de_connexion[0].EJ_IDEPARGNANTJOURNALIER,
        'SG_DATESIGNATURE': this.Donnee_de_connexion[0].SG_DATESIGNATURE,
        'SG_TOKENSIGNATURE': this.Donnee_de_connexion[0].SG_TOKENSIGNATURE,
        'SG_NOMSIGNATURE': this.Donnee_de_connexion[0].SG_NOMSIGNATURE,
        'SG_STATUTSIGNATURE': this.Donnee_de_connexion[0].SG_STATUTSIGNATURE,
        'NT_CODENATURESIGNATUREPAD': this.Donnee_de_connexion[0].NT_CODENATURESIGNATUREPAD,
        'TYPEOPERATION': '1'
        
    };

    this.socketService.sendSignature(body)
    this._alertService.WarningAlert('Information!', 'Opération effectué avec succes !!!');
    this._loaderService._hide();

    setTimeout(() => {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('donnee_de_connexion');

      // vider les sessions utilisateur
      sessionStorage.clear();
      localStorage.clear();

      window.location.href = '/auth';
    }, 2000);
  }

  ngOnInit() {
    
    if(!sessionStorage.getItem('donnee_de_connexion')){
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('donnee_de_connexion');

      // vider les sessions utilisateur
      sessionStorage.clear();
      localStorage.clear();

      window.location.href = '/auth';
    }
    // Écoute de l'événement WebSocket
    this.socketService.onReceiveSignature().subscribe((data) => {
      console.log('Signature reçue :', data);
      this.signatureInfo = data;
    });
  }
}
