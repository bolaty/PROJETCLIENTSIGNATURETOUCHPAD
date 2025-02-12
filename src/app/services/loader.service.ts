import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  isLoading_service = false;

  constructor() {}

  _show() {
    this.isLoading_service = true;
  }

  _hide() {
    this.isLoading_service = false;
  }
}
