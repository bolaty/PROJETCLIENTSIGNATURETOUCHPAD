import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Network } from '@capacitor/network';
import { catchError, switchMap } from 'rxjs/operators';
import { from, throwError } from 'rxjs';
import { AppConfigService } from '../AppConfigService.service'; // Importez le service correctement
declare var feather: any;
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // lien_serveur: any = 'https://appwebroyalimmo_test.app.mgdigitalplus.com/api/'; // lien test royal immobilier
 // lien_serveur: any = 'https://appwebroyalimmo_prod.app.mgdigitalplus.com/api/'; // lien prod royal immobilier
 lien_serveur: any = this.AppConfigService.getConfig('ApiSignaturePad')//'http://192.168.1.12:6001/api/';


  statusConnect: boolean = false;
  libelleConnexion: any = '';

  constructor(private http: HttpClient,private AppConfigService: AppConfigService) {
    Network.addListener(
      'networkStatusChange',
      this.checkNetworkStatus.bind(this)
    );
  }

  async checkNetworkStatus() {
    const status = await Network.getStatus();

    if (status.connected) {
      this.statusConnect = true;
      this.libelleConnexion = 'Connexion internet retablie';
      console.log('Connexion internet retablie');
      this.appSet();
      // this.demarrerCompteur()
    } else {
      this.statusConnect = true;
      this.libelleConnexion = 'Connexion internet perdue';
      console.log('Connexion internet perdue');
      this.appSetn();
      // this.demarrerCompteur()
    }
  }

  appSet() {
    'use strict';
    var notify = $.notify(
      '<i class="fa fa-bell-o"></i><strong>Notification</strong> connexion internet......',
      {
        type: 'theme',
        allow_dismiss: true,
        delay: 8000,
        showProgressbar: true,
        timer: 300,
      }
    );

    setTimeout(function () {
      notify.update(
        'message',
        '<i class="fa fa-bell-o"></i><strong>Connexion internet retablie</strong>.'
      );
    }, 1000);

    feather.replace();
  }

  appSetn() {
    'use strict';
    var notify = $.notify(
      '<i class="fa fa-bell-o"></i><strong>Notification</strong> connexion internet...',
      {
        type: 'theme',
        allow_dismiss: true,
        delay: 8000,
        showProgressbar: true,
        timer: 300,
      }
    );

    setTimeout(function () {
      notify.update(
        'message',
        '<i class="fa fa-bell-o"></i><strong>Connexion internet perdue</strong>.'
      );
    }, 1000);

    feather.replace();
  }

  AppelServeur(body: any, chemin_service: any) {
    return from(Network.getStatus()).pipe(
      switchMap((status) => {
        // Configuration des options HTTP
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Authorization: '', // Vous devrez peut-être fournir un jeton d'autorisation ici
          }),
        };

        // Vérification de la connexion Internet
        if (status.connected) {
          // Envoi de la requête HTTP si la connexion est active
          return this.http
            .post(
              this.lien_serveur + chemin_service, //'Service/wsCoupure.svc/pvgChargerDansDataSet',
              body,
              httpOptions
            )
            .pipe(
              catchError((error) => {
                return throwError(error);
              })
            );
        } else {
          // Si la connexion Internet est perdue, renvoyer une erreur
          $('*').LoadingOverlay('hide');
          this.appSetn();
          return throwError('Connexion internet perdue');
        }
      })
    );
  }

  isLoggedinUser() {
    return !!sessionStorage.getItem('isLoggedIn');
  }
}
