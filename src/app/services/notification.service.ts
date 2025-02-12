import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _toastr: ToastrService) {}

  ShowNotification(
    message: string,
    type: string = 'info',
    from: string = 'top',
    align: string = 'right',
    delay: number = 3000
  ) {
    $.notify(
      {
        message: message,
      },
      {
        type: type,
        delay: delay,
        placement: {
          from: from,
          align: align,
        },
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp',
        },
        template: `
          <div data-notify="container" class="col-11 col-sm-4 alert alert-{0}" role="alert">
            <button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>
            <span data-notify="message">{2}</span>
          </div>
        `,
      }
    );
  }

  NotifyError(msg: string) {
    $.notify(
      {
        title: 'Alerte!',
        message: msg,
      },
      {
        type: 'danger',
        allow_dismiss: true,
        newest_on_top: true,
        mouse_over: true,
        showProgressbar: true,
        spacing: 11,
        timer: 2000,
        placement: {
          from: 'top',
          align: 'center',
        },
        offset: {
          x: 30,
          y: 30,
        },
        delay: 1000,
        z_index: 10000,
        animate: {
          enter: 'animated rubberBand',
          exit: 'animated rubberBand',
        },
      }
    );
  }

  ShowSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  ShowError(message: string, title: string) {
    this._toastr.error(message, title);
  }

  ShowInfo(message: string, title: string) {
    this._toastr.info(message, title);
  }

  ShowWarning(message: string, title: string) {
    this._toastr.warning(message, title);
  }
}
