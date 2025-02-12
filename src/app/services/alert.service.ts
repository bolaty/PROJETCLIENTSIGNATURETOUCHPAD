import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  SuccessAlert(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      html: text,
      confirmButtonText: 'OK',
    });
  }

  ErrorAlert(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      html: text,
      confirmButtonText: 'OK',
    });
  }

  WarningAlert(title: string, text: string) {
    Swal.fire({
      icon: 'warning',
      title: title,
      html: text,
      confirmButtonText: 'OK',
    });
  }

  CustomAlert(options: any) {
    Swal.fire(options);
  }
}
