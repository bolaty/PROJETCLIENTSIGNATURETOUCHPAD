import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LangueService {
  constructor(private http: HttpClient, private translate: TranslateService) {
    if (
      sessionStorage.getItem('langue_en_cours') == 'current_fr' ||
      !sessionStorage.getItem('langue_en_cours')
    ) {
      this.translate.setDefaultLang('fr'); // langue par défaut
    } else if (sessionStorage.getItem('langue_en_cours') == 'current_en') {
      this.translate.setDefaultLang('en'); // langue par défaut
    }
  }

  _changerLaLangue(language: string) {
    this.translate.use(language); // changer la langue
  }
}
