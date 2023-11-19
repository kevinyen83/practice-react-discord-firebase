import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { LoginService } from '../../services/auth/login/login.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
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
    return this._check(redirectUrl);
  }

  /**
   * Can activate child
   *
   * @param childRoute
   * @param state
   */
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    return this._check(redirectUrl);
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
   * @param redirectURL
   * @private
   */
  private _check(redirectURL: string): Observable<boolean> {
    // Check the authentication status
    return this.loginService.isAuthenticated().pipe(
      switchMap((authenticated) => {
        // If the user is not authenticated...
        if (!authenticated.isAuth) {
          // Redirect to the sign-in page
          this._router.navigate(['/auth/login']);

          // Prevent the access
          return of(false);
        }
        // Allow the access
        return of(true);
      })
    );
  }
}
