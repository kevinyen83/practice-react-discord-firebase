import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { LoginService } from '../../services/auth/login/login.service';
import { Observable, of, skip } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthAccountGuard implements CanActivate, CanActivateChild, CanLoad {
  /**
   * Constructor
   */
  constructor(private loginService: LoginService, private _router: Router) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Can activate
   *
   * @param route
   * @param state
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    return this._check(redirectUrl, state);
  }

  /**
   * Can activate child
   *
   * @param childRoute
   * @param state
   */
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    return this._check(redirectUrl, state);
  }

  /**
   * Can load
   *
   * @param route
   * @param segments
   */
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this._check('/');
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Check the authenticated status
   *
   * @private
   */
  private _check(redirectURL: string, state?: RouterStateSnapshot): Observable<boolean> {
    // Check the authentication status
    return this.loginService.isAuthenticated().pipe(
      switchMap((authenticated) => {
        console.log(authenticated);
        // If the user is not authenticated...
        if (!authenticated.isAuth) {
          this._router.navigate(['/auth/login']);
          // Prevent the access
          return of(false);
        } else if (!authenticated.emailVerified) {
          this._router.navigate(['/auth/verify-email']);
          // Prevent the access
          return of(false);
        } else if (!authenticated.mobileVerified) {
          this._router.navigate(['/auth/verify-mobile']);
          // Prevent the access
          return of(false);
        } else if (authenticated.profileVerified === 0 || authenticated.profileVerified === 1) {
          this._router.navigate(['/auth/id-check']);
          // Prevent the access
          return of(false);
        } else if (authenticated.accountCount === 0) {
          if (state.url === '/welcome') {
            return of(true);
          }
          // Prevent the access
          return of(false);
        }
        // Allow the access
        if (state.url === '/welcome') {
          this._router.navigate(['/pages/home']);
          return of(false);
        }
        return of(true);
      })
    );
  }
}
