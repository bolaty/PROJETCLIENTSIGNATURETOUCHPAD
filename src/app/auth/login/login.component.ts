import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolsService } from 'src/app/services/tools.service';
import { LoaderService } from 'src/app/services/loader.service';
import { LangueService } from 'src/app/services/langue.service';

declare var Mmenu: any;
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _alertService: AlertService,
    private _notificationService: NotificationService,
    private _toolsService: ToolsService,
    public _loaderService: LoaderService,
    public _langueService: LangueService
  ) {}

  flaticon: any = 'flaticon-play';
  isPasswordVisible: boolean = false;
  model_login: any[] = [
    // 0
    {
      id: 'id_login',
      type: 'text',
      valeur: '',
      obligatoire: 'O',
      label: 'login',
      afficher: true,
    },
    // 1
    {
      id: 'id_mdp',
      type: 'text',
      valeur: '',
      obligatoire: 'O',
      label: 'mot de passe',
      afficher: true,
    },
  ];
  retour_connexion: any = [];
  //--------------------------------------------------- fin declaration

  SeConnecter() {
    this._loaderService._show();

    let lien_du_service = 'List_signaturepad';

    let body = {
      Objet: [
        {
          SG_CODESIGNATURE: '',
          NT_CODENATURESIGNATUREPAD: '',
          SG_NOMSIGNATURE: '',
          SG_TOKENSIGNATURE: this.model_login[1]['valeur'],
          TYPEOPERATION: '1',
          CODECRYPTAGE:  this._toolsService['code_criptage'],
        },
      ],
    };

    this._auth.AppelServeur(body, lien_du_service).subscribe((success: any) => {
      this.retour_connexion = success;

      this._loaderService._hide();

      if (this.retour_connexion['SL_RESULTAT'] == 'FALSE') {
        var message = this.retour_connexion['SL_MESSAGE'].split(':');
        this._alertService.WarningAlert('Information!', message[0].trim());
      }  else {
        sessionStorage.setItem(
          'donnee_de_connexion',
          JSON.stringify(this.retour_connexion[1])
        );

        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = '/auth/Signaturepad';
      }
    });
    (error: any) => {
      this._loaderService._hide();
      this._alertService.ErrorAlert(
        'Erreur!',
        this.retour_connexion['SL_MESSAGE']
      );
    };
  }

  TogglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    if (this.isPasswordVisible) this.flaticon = 'flaticon-key';
    else this.flaticon = 'flaticon-play';
  }

  AllerALaModificationDuMdp() {
    window.location.href = '/auth/modifier_mdp';
  }

  ngAfterViewInit() {
    const menuElement = document.querySelector('#menu');
    if (menuElement) {
      new Mmenu(menuElement);
    }

    setTimeout(() => {
      $("#modallogin").modal("show");
    }, 2000);
  }

  ngOnInit() {
     if(sessionStorage.getItem('isLoggedIn')){
       window.location.href = '/auth/Signaturepad';
     }
    
   }
}
