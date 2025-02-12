import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class guardGuard implements CanActivate {
  constructor(private _auth: AuthService, private _router: Router) {}

  /*canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this._auth.isLoggedinUser()) {
      return true;
    } else {
      this._router.navigate(['/auth']);
      return false;
    }
  }*/

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!!sessionStorage.getItem('isLoggedIn')) {
      return true;
    } else {
      window.location.href = '/auth';
      console.log('dans la guarde', 'canActivate');
      return false;
    }
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!!sessionStorage.getItem('isLoggedIn')) {
      return true;
    } else {
      window.location.href = '/auth/Signaturepad';
      console.log('dans la guarde', 'canActivateChild');
      return false;
    }
  }
 /* canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this._auth.isLoggedinUser()) {
      return true;
    } else {
      this._router.navigate(['/login']);
      return false;
    }
  }*/

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
