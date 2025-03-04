import { Component, ViewChild, AfterViewInit,ElementRef } from '@angular/core';

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
  @ViewChild('video', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;
  signatureSize: number = 0; // Stocke la taille de la signature en Ko

  photoUrl: string | null = null;
  cameraAvailable: boolean = false;
  photoSize: number = 0; // Variable pour stocker la taille
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


  async checkCameraAvailability() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');

    if (cameras.length > 0) {
      this.cameraAvailable = true;
      this.startCamera();
    } else {
      this.cameraAvailable = false; // Active l'importation d'image
    }
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.videoElement.nativeElement.srcObject = stream;
    }).catch(error => {
      this._alertService.WarningAlert('Information!', 'Erreur d’accès à la caméra: ' + error);
      this.cameraAvailable = false; // Si l’accès échoue, permettre l’importation
    });
  }


  compressImage(dataUrl: string, quality: number, callback: (compressedDataUrl: string) => void) {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Définir une taille réduite (exemple : 300x300px)
      const maxWidth = 300;
      const maxHeight = 300;
      let width = img.width;
      let height = img.height;
  
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
  
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
  
      // Compresser l'image (ajuster le quality entre 0.1 et 1)
      let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      let sizeInKB = this.getImageSize(compressedDataUrl);
  
      while (sizeInKB > 10 && quality > 0.1) {
        quality -= 0.05;
        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        sizeInKB = this.getImageSize(compressedDataUrl);
      }
  
      this.photoSize = Math.round(sizeInKB * 100) / 100; // Stocker la taille arrondie
      callback(compressedDataUrl);
    };
  }
  
  // Fonction pour obtenir la taille d'une image en Ko
  getImageSize(dataUrl: string): number {
    const head = 'data:image/jpeg;base64,';
    const base64Str = dataUrl.replace(head, '');
    const bytes = atob(base64Str).length;
    return bytes / 1024; // Convertir en Ko
  }
  
  // Modifier la prise de photo pour compresser et afficher la taille
  takePhoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
  
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // Qualité initiale
      this.compressImage(dataUrl, 0.9, (compressedDataUrl) => {
        this.photoUrl = compressedDataUrl;
      });
    }
  }
  
  // Modifier l'importation d'image pour compresser et afficher la taille
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        this.compressImage(dataUrl, 0.9, (compressedDataUrl) => {
          this.photoUrl = compressedDataUrl;
        });
      };
      reader.readAsDataURL(file);
    }
  }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
  }

  clear() {
    this.signaturePad.clear();
  }

 /* save() {
    if (this.signaturePad.isEmpty()) {
      this._alertService.WarningAlert('Information!', 'La signature est vide. Veuillez signer avant.');
      return;
    }
    const signature = this.signaturePad.toDataURL('image/png');
    this.signatureSize = this.getImageSize2(signature); // Calculer la taille
    // Envoi de la signature au backend
    this.uploadSignature(signature);
  }

   
    // Fonction pour obtenir la taille en Ko
    getImageSize2(dataUrl: string): number {
      const head = 'data:image/png;base64,';
      const base64Str = dataUrl.replace(head, '');
      const bytes = atob(base64Str).length;
      return Math.round((bytes / 1024) * 100) / 100; // Convertir en Ko et arrondir
    }*/

      save() {
        if (this.signaturePad.isEmpty()) {
          this._alertService.WarningAlert('Information!', 'La signature est vide. Veuillez signer avant.');
          return;
        }
      
        var signature = this.signaturePad.toDataURL('image/png'); // Capture la signature
        this.compressImage2(signature, 0.9, (compressedDataUrl) => {
          signature = compressedDataUrl
          this.signatureSize = this.getImageSize2(compressedDataUrl); // Met à jour la taille
          this.uploadSignature(compressedDataUrl);
        });
      }
      
      // Fonction pour compresser une image
      compressImage2(dataUrl: string, quality: number, callback: (compressedDataUrl: string) => void) {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
      
          // Définir une taille réduite
          const maxWidth = 400;
          const maxHeight = 400;
          let width = img.width;
          let height = img.height;
      
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
      
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
      
          // Compresser l'image
          let compressedDataUrl = canvas.toDataURL('image/png', quality);
          let sizeInKB = this.getImageSize2(compressedDataUrl);
      
          // Ajuster la qualité pour atteindre ~10 Ko
          while (sizeInKB > 10 && quality > 0.1) {
            quality -= 0.05;
            compressedDataUrl = canvas.toDataURL('image/png', quality);
            sizeInKB = this.getImageSize2(compressedDataUrl);
          }
      
          callback(compressedDataUrl);
        };
      }
      
      // Fonction pour obtenir la taille en Ko
      getImageSize2(dataUrl: string): number {
        const head = 'data:image/png;base64,';
        const base64Str = dataUrl.replace(head, '');
        const bytes = atob(base64Str).length;
        return Math.round((bytes / 1024) * 100) / 100; // Convertir en Ko et arrondir
      }

      

  uploadSignature(signature: string) {
    // Méthode pour envoyer la signature au serveur via un service Angular
    
    if(this.Donnee_de_connexion[0].NT_CODENATURESIGNATUREPAD == '2' && (this.photoUrl == '' || this.photoUrl == null || this.photoUrl == undefined)){
      this._alertService.WarningAlert('Information!', 'la photo est obligatoire !!!');return
    }

    if(signature == '' || signature == null || signature == undefined){
      this._alertService.WarningAlert('Information!', 'la signature est obligatoire !!!');return
    }

    this._loaderService._show();

    let body = {
        'AG_CODEAGENCE': this.Donnee_de_connexion[0].AG_CODEAGENCE,
        'SIGNATURE': signature,
        'PHOTO': this.photoUrl,
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
    setTimeout(() => {
      this.checkCameraAvailability();
    }, 3000);
    
    // Écoute de l'événement WebSocket
    this.socketService.onReceiveSignature().subscribe((data) => {
      console.log('Signature reçue :', data);
      this.signatureInfo = data;
    });
  }
}
