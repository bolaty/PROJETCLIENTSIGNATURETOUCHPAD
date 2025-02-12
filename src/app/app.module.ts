import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfigService } from './AppConfigService.service';

export function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.loadConfig();
}
// Remplacez par l'adresse de votre serveur Flask
var config: SocketIoConfig = { url: '', options: { transports: ['websocket']} }
@NgModule({
  declarations: [AppComponent, AuthComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, // requis pour ngx-toastr
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      preventDuplicates: true,
      newestOnTop: true,
      toastClass: 'ngx-toastr toast-container',
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
      tapToDismiss: false,
      extendedTimeOut: 1000,
    }),
    SocketIoModule.forRoot(config)
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
