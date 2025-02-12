import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';

declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor(private _alertService: AlertService) {
    this.codeActuel = 'AAA';
    this.datePrecedente = this._avoirLaDateDuJour('');
  }

  unite: string[] = [
    '',
    'un',
    'deux',
    'trois',
    'quatre',
    'cinq',
    'six',
    'sept',
    'huit',
    'neuf',
  ];
  dizaine: string[] = [
    '',
    'dix',
    'vingt',
    'trente',
    'quarante',
    'cinquante',
    'soixante',
    'soixante-dix',
    'quatre-vingt',
    'quatre-vingt-dix',
  ];
  dixTo19: string[] = [
    'dix',
    'onze',
    'douze',
    'treize',
    'quatorze',
    'quinze',
    'seize',
    'dix-sept',
    'dix-huit',
    'dix-neuf',
  ];
  code_criptage: string = 'Y}@128eVIXfoi7';
  champ_a_renseigner: any = [];
  tab_type_de_donnee: any = [];
  statut_champ_obligatoire: any = true;
  statut_type_de_donnee: any = true;
  date_input: any;

  _avoirLaDateDuJour(action_retour: any): string {
    // j retourne le jour
    // m retourne le mois
    // a retourne lannee
    // le vide retourne la date

    const aujourdhui = new Date();
    const jour = aujourdhui.getDate().toString().padStart(2, '0');
    const mois = (aujourdhui.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
    const annee = aujourdhui.getFullYear();

    const joursSemaine = [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ];
    const moisNom = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    const jourSemaine = joursSemaine[aujourdhui.getDay()];
    const nomMois = moisNom[aujourdhui.getMonth()];

    if (action_retour === 'j') {
      // retourne le numero du jour et son nom
      return `${jour}-${jourSemaine}`;
    } else if (action_retour === 'm') {
      // retourne le numero du mois et son nom
      return `${mois}-${nomMois}`;
    } else if (action_retour === 'a') {
      // retourne lannee
      return `${annee}`;
    } else {
      // retourne la date du jour
      return `${jour}-${mois}-${annee}`;
    }
  }

  _anneeBissextile(annee_recu: any) {
    if (
      (annee_recu % 4 == 0 && annee_recu % 100 !== 0) ||
      annee_recu % 400 == 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  // champ obligatoire et type de donnée
  _contrainteChampObligatoire(tableau_recu: any): boolean {
    // initialisation du tableau qui recoit les champs obligatoire vide
    this.champ_a_renseigner = [];
    this.tab_type_de_donnee = [];
    var num = '';

    // les differentes expressions reguliere
    let regex_numerique = /^[\d]+$/;
    let regex_montant = /^\d{1,3}( \d{3})*$/;
    let regex_telephone = /^[\d]{6,15}$/;
    let regex_telephone_extra = /^(\d+\/?)+$/;
    let regex_date =
      /^(0[1-9]|[12][0-9]|3[01])[-\/](0[1-9]|1[0-2])[-\/]([0-9]{4})$/;
    let regex_annee = /^([0-9]{4})$/;
    let regex_email =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // let regex_email = /^([^*/\\._-])([w.-])*(@gmail|@yahoo|@outlook).(com|fr)$/;
    let regex_taux =
      /^(\$(?=[0-9])((\d*\.\d{1,2})|\d+\.?)|((?=[0-9])(\d+\.?)|((?=([0-9]+|\d*\.0*[1-9]+))\d{1,3}\,\d{1,3})))$/;

    let AnneeDateRecu = '';
    let MoisDateRecu = '';
    let JourDateRecu = '';

    // test champ obligatoire
    for (let index = 0; index < tableau_recu.length; index++) {
      if (tableau_recu[index].obligatoire == 'O') {
        if (
          tableau_recu[index]['valeur'] === '' ||
          tableau_recu[index]['valeur'] === undefined ||
          tableau_recu[index]['valeur'] === null
        ) {
          this.statut_champ_obligatoire = false;
          this.champ_a_renseigner.push(tableau_recu[index]);
          this.tab_type_de_donnee = [];
        } else {
          this.statut_champ_obligatoire = true;
          $('#' + tableau_recu[index]['id']).css('background-color', 'white');
          this.tab_type_de_donnee.push(tableau_recu[index]);
        }
      }
    }

    // la liste des champs obligatoire a renseigner
    if (this.champ_a_renseigner.length != 0) {
      this.statut_champ_obligatoire = false;
      this.tab_type_de_donnee = [];
      this._alertService.WarningAlert(
        'Information!',
        'Veuillez renseigner les champs obligatoire'
      );
      for (let index = 0; index < this.champ_a_renseigner.length; index++) {
        $('#' + this.champ_a_renseigner[index]['id']).css(
          'background-color',
          'MistyRose'
        );
      }
    }

    // test type de donnée
    if (this.statut_champ_obligatoire) {
      for (let index = 0; index < this.tab_type_de_donnee.length; index++) {
        // le type email
        if (this.tab_type_de_donnee[index]['type'] == 'email') {
          if (!this.tab_type_de_donnee[index]['valeur'].match(regex_email)) {
            this._alertService.WarningAlert(
              'Information!',
              `Veuillez renseigner correctement le champ<br><strong>${this.tab_type_de_donnee[index]['label']}</strong>`
            );
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            this.tab_type_de_donnee = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'white'
            );
          }
        }
        // le type montant
        if (this.tab_type_de_donnee[index]['type'] == 'montant') {
          this.tab_type_de_donnee[index]['valeur'] =
            this.tab_type_de_donnee[index]['valeur'].toString();
          if (!this.tab_type_de_donnee[index]['valeur'].match(regex_montant)) {
            this._alertService.WarningAlert(
              'Information!',
              `Veuillez renseigner correctement le champ<br><strong>${this.tab_type_de_donnee[index]['label']}</strong>`
            );
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            this.tab_type_de_donnee = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'white'
            );
          }
        }
        // le type numerique
        if (this.tab_type_de_donnee[index]['type'] == 'numerique') {
          this.tab_type_de_donnee[index]['valeur'] =
            this.tab_type_de_donnee[index]['valeur'].toString();
          if (
            !this.tab_type_de_donnee[index]['valeur'].match(regex_numerique)
          ) {
            this._alertService.WarningAlert(
              'Information!',
              `Veuillez renseigner correctement le champ<br><strong>${this.tab_type_de_donnee[index]['label']}</strong>`
            );
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            this.tab_type_de_donnee = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'white'
            );
          }
        }
        // le type date
        if (this.tab_type_de_donnee[index]['type'] == 'date') {
          // decomposition de la date
          AnneeDateRecu = this.tab_type_de_donnee[index]['valeur'].substr(6, 4);
          MoisDateRecu = this.tab_type_de_donnee[index]['valeur'].substr(3, 2);
          JourDateRecu = this.tab_type_de_donnee[index]['valeur'].substr(0, 2);
          // verification du pattern
          if (!this.tab_type_de_donnee[index]['valeur'].match(regex_date)) {
            this._alertService.WarningAlert(
              'Information!',
              `Veuillez renseigner correctement le champ<br><strong>${this.tab_type_de_donnee[index]['label']}</strong>`
            );
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            this.tab_type_de_donnee = [];
            this.statut_type_de_donnee = false;
            break;
          }
          // si l'annee n'est pas bissextile
          else if (
            this._anneeBissextile(AnneeDateRecu) == false &&
            MoisDateRecu == '02' &&
            JourDateRecu > '28'
          ) {
            this._alertService.WarningAlert(
              'Information!',
              `${this.tab_type_de_donnee[index]['label']} n'est pas une date valide`
            );
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            this.tab_type_de_donnee = [];
            this.statut_type_de_donnee = false;
            break;
          }
          // si l'annee est bissextile
          else if (
            this._anneeBissextile(AnneeDateRecu) == true &&
            MoisDateRecu == '02' &&
            JourDateRecu > '29'
          ) {
            this._alertService.WarningAlert(
              'Information!',
              `${this.tab_type_de_donnee[index]['label']} n'est pas une date valide`
            );
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            this.tab_type_de_donnee = [];
            this.statut_type_de_donnee = false;
            break;
          }
          // si l'annee comporte 30 jours
          else if (
            (MoisDateRecu == '04' ||
              MoisDateRecu == '06' ||
              MoisDateRecu == '09' ||
              MoisDateRecu == '11') &&
            JourDateRecu > '30'
          ) {
            this._alertService.WarningAlert(
              'Information!',
              `${this.tab_type_de_donnee[index]['label']} n'est pas une date valide`
            );
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            this.tab_type_de_donnee = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'white'
            );
          }
        }
        // le type annee
        if (this.tab_type_de_donnee[index]['type'] == 'annee') {
          if (!this.tab_type_de_donnee[index]['valeur'].match(regex_annee)) {
            this._alertService.WarningAlert(
              'Information!',
              `Veuillez renseigner correctement le champ <br><strong>${this.tab_type_de_donnee[index]['label']}</strong>`
            );
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            this.tab_type_de_donnee = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'white'
            );
          }
        }
        // le type telephone
        if (this.tab_type_de_donnee[index]['type'] == 'telephone') {
          if (
            !this.tab_type_de_donnee[index]['valeur'].match(regex_telephone)
          ) {
            this._alertService.WarningAlert(
              'Information!',
              `Veuillez renseigner correctement le champ<br><strong>${this.tab_type_de_donnee[index]['label']}</strong>`
            );
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            this.tab_type_de_donnee = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'white'
            );
          }
        }
        // le type telephone extra
        if (this.tab_type_de_donnee[index]['type'] == 'telephone_extra') {
          if (
            !this.tab_type_de_donnee[index]['valeur'].match(
              regex_telephone_extra
            )
          ) {
            this._alertService.WarningAlert(
              'Information!',
              `Veuillez renseigner correctement le champ<br><strong>${this.tab_type_de_donnee[index]['label']}</strong>`
            );
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            this.tab_type_de_donnee = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'white'
            );
          }
        }
        // le type taux
        if (this.tab_type_de_donnee[index]['type'] == 'taux') {
          if (!this.tab_type_de_donnee[index]['valeur'].match(regex_taux)) {
            this._alertService.WarningAlert(
              'Information!',
              `Veuillez renseigner correctement le champ<br><strong>${this.tab_type_de_donnee[index]['label']}</strong>`
            );
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            this.tab_type_de_donnee = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + this.tab_type_de_donnee[index]['id']).css(
              'background-color',
              'white'
            );
          }
        }
      }
    }

    // approbation des tests obligatoire et type de donnees
    if (
      this.statut_champ_obligatoire == true &&
      this.statut_type_de_donnee == true
    ) {
      return true;
    } else {
      return false;
    }
  }

  // tester les types de donnée pour les champs non obligatoire
  _contrainteTypeDeDonneeChampNonObligatoire(tableau_recu: any) {
    var num = '';
    // les differentes expressions reguliere
    let regex_numerique = /^[\d]+$/;
    let regex_telephone = /^[\d]{6,15}$/;
    let regex_telephone_extra = /^(\d+\/?)+$/;
    let regex_date =
      /^(0[1-9]|[12][0-9]|3[01])[-\/](0[1-9]|1[0-2])[-\/]([0-9]{4})$/;
    let regex_annee = /^([0-9]{4})$/;
    // let regex_montant = /^[\d]{1,12}$/;
    let regex_montant = /^\d{1,3}( \d{3})*$/;
    let regex_email =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // let regex_email = /^([^*/\\._-])([w.-])*(@gmail|@yahoo|@outlook).(com|fr)$/;
    let regex_taux =
      /^(\$(?=[0-9])((\d*\.\d{1,2})|\d+\.?)|((?=[0-9])(\d+\.?)|((?=([0-9]+|\d*\.0*[1-9]+))\d{1,3}\,\d{1,3})))$/;

    let AnneeDateRecu = '';
    let MoisDateRecu = '';
    let JourDateRecu = '';

    // test type de donnée pour les champs non obligatoire
    for (let index = 0; index < tableau_recu.length; index++) {
      if (
        tableau_recu[index].obligatoire == 'N' &&
        tableau_recu[index]['valeur'] != ''
      ) {
        // le type email
        if (tableau_recu[index]['type'] == 'email') {
          if (!tableau_recu[index]['valeur'].match(regex_email)) {
            this._alertService.WarningAlert(
              'Informations!',
              `Veuillez renseigner correctement le champ<br><strong>${tableau_recu[index]['label']}</strong>`
            );
            $('#' + tableau_recu[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            tableau_recu = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + tableau_recu[index]['id']).css('background-color', 'white');
          }
        }
        // le type montant
        if (tableau_recu[index]['type'] == 'montant') {
          if (!tableau_recu[index]['valeur'].match(regex_montant)) {
            this._alertService.WarningAlert(
              'Informations!',
              `Veuillez renseigner correctement le champ<br><strong>${tableau_recu[index]['label']}</strong>`
            );
            $('#' + tableau_recu[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            tableau_recu = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + tableau_recu[index]['id']).css('background-color', 'white');
          }
        }
        // le type numerique
        if (tableau_recu[index]['type'] == 'numerique') {
          if (!tableau_recu[index]['valeur'].match(regex_numerique)) {
            this._alertService.WarningAlert(
              'Informations!',
              `Veuillez renseigner correctement le champ<br><strong>${tableau_recu[index]['label']}</strong>`
            );
            $('#' + tableau_recu[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            tableau_recu = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + tableau_recu[index]['id']).css('background-color', 'white');
          }
        }
        // le type date
        if (tableau_recu[index]['type'] == 'date') {
          // decomposition de la date
          AnneeDateRecu = tableau_recu[index]['valeur'].substr(6, 4);
          MoisDateRecu = tableau_recu[index]['valeur'].substr(3, 2);
          JourDateRecu = tableau_recu[index]['valeur'].substr(0, 2);
          // verification du pattern
          if (!tableau_recu[index]['valeur'].match(regex_date)) {
            this._alertService.WarningAlert(
              'Informations!',
              `Veuillez renseigner correctement le champ<br><strong>${tableau_recu[index]['label']}</strong>`
            );
            $('#' + tableau_recu[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            tableau_recu = [];
            this.statut_type_de_donnee = false;
            break;
          }
          // si l'annee n'est pas bissextile
          else if (
            this._anneeBissextile(AnneeDateRecu) == false &&
            MoisDateRecu == '02' &&
            JourDateRecu > '28'
          ) {
            this._alertService.WarningAlert(
              'Information!',
              `${tableau_recu[index]['label']} n'est pas une date valide`
            );
            $('#' + tableau_recu[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            tableau_recu = [];
            this.statut_type_de_donnee = false;
            break;
          }
          // si l'annee est bissextile
          else if (
            this._anneeBissextile(AnneeDateRecu) == true &&
            MoisDateRecu == '02' &&
            JourDateRecu > '29'
          ) {
            this._alertService.WarningAlert(
              'Information!',
              `${tableau_recu[index]['label']} n'est pas une date valide`
            );
            $('#' + tableau_recu[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            tableau_recu = [];
            this.statut_type_de_donnee = false;
            break;
          }
          // si l'annee comporte 30 jours
          else if (
            (MoisDateRecu == '04' ||
              MoisDateRecu == '06' ||
              MoisDateRecu == '09' ||
              MoisDateRecu == '11') &&
            JourDateRecu > '30'
          ) {
            this._alertService.WarningAlert(
              'Information!',
              `${tableau_recu[index]['label']} n'est pas une date valide`
            );
            $('#' + tableau_recu[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            tableau_recu = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + tableau_recu[index]['id']).css('background-color', 'white');
          }
        }
        // le type annee
        if (tableau_recu[index]['type'] == 'annee') {
          if (!tableau_recu[index]['valeur'].match(regex_annee)) {
            this._alertService.WarningAlert(
              'Informations!',
              `Veuillez renseigner correctement le champ<br><strong>${tableau_recu[index]['label']}</strong>`
            );
            $('#' + tableau_recu[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            tableau_recu = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + tableau_recu[index]['id']).css('background-color', 'white');
          }
        }
        // le type telephone
        if (tableau_recu[index]['type'] == 'telephone') {
          if (!tableau_recu[index]['valeur'].match(regex_telephone)) {
            this._alertService.WarningAlert(
              'Informations!',
              `Veuillez renseigner correctement le champ<br><strong>${tableau_recu[index]['label']}</strong>`
            );
            $('#' + tableau_recu[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            tableau_recu = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + tableau_recu[index]['id']).css('background-color', 'white');
          }
        }
        // le type telephone extra
        if (tableau_recu[index]['type'] == 'telephone_extra') {
          if (!tableau_recu[index]['valeur'].match(regex_telephone_extra)) {
            this._alertService.WarningAlert(
              'Informations!',
              `Veuillez renseigner correctement le champ<br><strong>${tableau_recu[index]['label']}</strong>`
            );
            $('#' + tableau_recu[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            tableau_recu = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + tableau_recu[index]['id']).css('background-color', 'white');
          }
        }
        // le type taux
        if (tableau_recu[index]['type'] == 'taux') {
          if (!tableau_recu[index]['valeur'].match(regex_taux)) {
            this._alertService.WarningAlert(
              'Informations!',
              `Veuillez renseigner correctement le champ<br><strong>${tableau_recu[index]['label']}</strong>`
            );
            $('#' + tableau_recu[index]['id']).css(
              'background-color',
              'MistyRose'
            );
            tableau_recu = [];
            this.statut_type_de_donnee = false;
            break;
          } else {
            this.statut_type_de_donnee = true;
            $('#' + tableau_recu[index]['id']).css('background-color', 'white');
          }
        }
      }
      if (
        tableau_recu[index].obligatoire == 'N' &&
        tableau_recu[index]['valeur'] == ''
      ) {
        $('#' + tableau_recu[index]['id']).css('background-color', 'white');
      }
    }

    // approbation des type de donnees  pour les champs non obligatoire
    if (this.statut_type_de_donnee == true) {
      return true;
    } else {
      return false;
    }
  }

  // separateur de date auto
  _saisieAutoDate(id: any) {
    this.date_input = document.getElementById(id);

    this.date_input.addEventListener('keyup', (e: any) => {
      const input = e.target;
      const inputLength = input.value.length;
      const key = e.key;

      // Vérifier si l'utilisateur a appuyé sur une touche de chiffre
      // if (/^\d$/.test(key)) {
      if (!isNaN(key)) {
        if (inputLength === 2 || inputLength === 5) {
          // Ajouter un tiret après avoir saisi deux chiffres ou après avoir saisi cinq chiffres
          input.value += '-';
        }
      } else {
        // Si l'utilisateur a appuyé sur une touche autre qu'un chiffre, le bloquer
        e.preventDefault();
      }
    });
  }

  _formatageMontantAlaSaisie(event: any, index: any, model: any) {
    console.log('event', event);
    // return;
    if (
      event.data == '0' ||
      event.data == '1' ||
      event.data == '2' ||
      event.data == '3' ||
      event.data == '4' ||
      event.data == '5' ||
      event.data == '6' ||
      event.data == '7' ||
      event.data == '8' ||
      event.data == '9' ||
      event.data == null
    ) {
      // Supprimez tous les séparateurs de milliers actuels (espaces)
      var valeur = model[index].valeur.toString().replace(/ /g, '');

      // Vérifiez si l'entrée est un nombre valide
      var montantNumerique = Number(valeur);
      if (!isNaN(montantNumerique)) {
        // Formatez le montant en ajoutant un espace comme séparateur de milliers
        var montantFormate = '';
        var longueur = valeur.length;

        for (var i = 0; i < longueur; i++) {
          montantFormate += valeur[i];
          if ((longueur - i - 1) % 3 === 0 && i !== longueur - 1) {
            montantFormate += ' ';
          }
        }

        // Mettez à jour le champ de saisie avec le montant formaté
        model[index].valeur = montantFormate == '' ? '0' : montantFormate;
      } else {
        this._alertService.WarningAlert(
          'Information!',
          'Veuillez saisir un montant valide.'
        );
      }
    } else {
      model[index].valeur = model[index].valeur.replace(/\D/g, '');

      setTimeout(() => {
        valeur = model[index].valeur;

        // Vérifiez si l'entrée est un nombre valide
        var montantNumerique = Number(valeur);
        if (!isNaN(montantNumerique)) {
          // Formatez le montant en ajoutant un espace comme séparateur de milliers
          var montantFormate = '';
          var longueur = valeur.length;

          for (var i = 0; i < longueur; i++) {
            montantFormate += valeur[i];
            if ((longueur - i - 1) % 3 === 0 && i !== longueur - 1) {
              montantFormate += ' ';
            }
          }

          // Mettez à jour le champ de saisie avec le montant formaté
          model[index].valeur = montantFormate == '' ? '0' : montantFormate;
        }
      }, 1000);
    }
  }

  // -------------------------- pour la generation du code du mandat --------------------------
  private codeActuel: string;
  private datePrecedente: string;

  private _avoirLaDateDuJour2(): string {
    const date = new Date();
    const annee = date.getFullYear().toString();
    const mois = (date.getMonth() + 1).toString().padStart(2, '0');
    const jour = date.getDate().toString().padStart(2, '0');
    return `${annee}${mois}${jour}`;
  }

  private _incrementCode(): void {
    let chars = this.codeActuel.split('');
    for (let i = chars.length - 1; i >= 0; i--) {
      if (chars[i] !== 'Z') {
        chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
        break;
      } else {
        chars[i] = 'A';
      }
    }
    this.codeActuel = chars.join('');
  }

  private _resetCode(): void {
    this.codeActuel = 'AAA';
  }

  public _genererLeCode(): string {
    const dateActuelle = this._avoirLaDateDuJour2();

    // Si la date a changé, réinitialiser le code
    if (dateActuelle !== this.datePrecedente) {
      this._resetCode();
      this.datePrecedente = dateActuelle;
    }

    const code = `${dateActuelle}${this.codeActuel}`;
    this._incrementCode(); // Prépare le code suivant

    return code;
  }
  // -------------------------- pour la generation du code du mandat --------------------------

  // convertir un nombre en chiffre en lettre
  _convertirEnLettre(n: number): string {
    if (n === 0) return 'zéro';

    let result = '';

    if (n >= 1000000) {
      result += this._convertirEnLettre(Math.floor(n / 1000000)) + ' million';
      n %= 1000000;
      if (n > 0) result += ' ';
    }

    if (n >= 1000) {
      if (n >= 2000)
        result += this._convertirEnLettre(Math.floor(n / 1000)) + ' ';
      result += 'mille';
      n %= 1000;
      if (n > 0) result += ' ';
    }

    if (n >= 100) {
      if (n >= 200) result += this.unite[Math.floor(n / 100)] + ' cent';
      else result += 'cent';
      n %= 100;
      if (n > 0) result += ' ';
    }

    if (n >= 20) {
      if (n >= 70 && n < 80) {
        result += this.dizaine[6]; // "soixante"
        n -= 60;
      } else if (n >= 90 && n < 100) {
        result += this.dizaine[8]; // "quatre-vingt"
        n -= 80;
      } else {
        result += this.dizaine[Math.floor(n / 10)];
        n %= 10;
      }

      if (n >= 10 && n < 20) {
        result += '-' + this.dixTo19[n - 10];
        n = 0;
      } else if (
        n === 1 &&
        (result.endsWith('vingt') || result.endsWith('soixante'))
      ) {
        result += ' et un';
        n = 0;
      } else if (n > 0) {
        result += '-' + this.unite[n];
      }
    } else if (n > 0) {
      result += this.unite[n];
    }

    return result.trim();
  }

  // formater le montant reçu
  _formaterMontantRecu(nombre: any): string | undefined {
    // Vérifiez si l'entrée est un nombre valide
    var valeur = nombre.toString();
    var montantNumerique0 = Number(valeur);
    if (!isNaN(montantNumerique0)) {
      // Formatez le montant en ajoutant un espace comme séparateur de milliers
      var montantFormate = '';
      var longueur = valeur.length;

      for (var i = 0; i < longueur; i++) {
        montantFormate += valeur[i];
        if ((longueur - i - 1) % 3 === 0 && i !== longueur - 1) {
          montantFormate += ' ';
        }
      }

      // Mettez à jour le champ de saisie avec le montant formaté
      return montantFormate == '' ? '0' : montantFormate;
    }
    return undefined;
  }

  // Fonction pour comparer deux dates
  _comparerDeuxDates(date1: Date, date2: Date): string {
    if (date1 < date2) {
      return 'date1Infdate2';
    } else if (date1 > date2) {
      return 'date1Supdate2';
    } else {
      return 'date1Egaldate2';
    }
  }

  // Fonction pour convertir une chaîne de date au format 'DD/MM/YYYY' en objet Date
  _convertirUneDate(chaineDate: string): Date {
    const [jour, mois, annee] = chaineDate.split('/').map(Number);
    return new Date(annee, mois - 1, jour); // Mois commence à 0 dans l'objet Date
  }
}
