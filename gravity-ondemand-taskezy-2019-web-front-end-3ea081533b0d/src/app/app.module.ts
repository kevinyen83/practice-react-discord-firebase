import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { LayoutModule } from './layout/layout.module';
import { FuseModule } from '../@fuse/fuse.module';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';
import { ExtraErrorData as ExtraErrorDataIntegration, CaptureConsole as CaptureConsoleIntegration, Dedupe as DedupeIntegration } from '@sentry/integrations';

import { TranslateModule } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';

import { AppComponent } from './app.component';
import { AppInterceptor } from './app.interceptor';
import { FakeDbService } from './fake-db/fake-db.service';
import { IntercomModule } from 'ng-intercom';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { FuseConfigModule } from '../@fuse/services/config';
import { appConfig } from './core/config/app.config';
import { FuseMockApiModule } from '../@fuse/lib/mock-api';
import { mockApiServices } from './mock-api';
import { CoreModule } from './core/core.module';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';

import { appRoutes } from './app.routing';
import { VERSION } from '../environments/version';
import { CalendarModule, DateAdapter as AngularCalendarDateAdapter } from 'angular-calendar';
import { adapterFactory as AngularCalendarDateFnsAdapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxTimeSchedulerModule, DateAdapter as TimeSchedulerDateAdapter } from 'ngx-time-scheduler-extend';
import { adapterFactory as TimeSchedulerDateFnsAdapterFactoy } from 'ngx-time-scheduler-extend/lib/date-adapters/date-fns';
import { NgxStripeModule } from 'ngx-stripe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMomentDatetimeModule } from '@ng-matero/extensions-moment-adapter';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FuseDrawerModule } from '@fuse/components/drawer';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';


const routerConfig: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  preloadingStrategy: PreloadAllModules
  // enableTracing: true
};

if (environment.production || environment.stage || environment.test) {
  Sentry.init({
    dsn: environment['sentryDsn'],
    environment: environment.env,
    debug: false,
    release: `taskezy@${VERSION.version}.${VERSION.hash}`,
    integrations: [
      new Sentry.Integrations.TryCatch({
        XMLHttpRequest: false
      }),
      new Integrations.BrowserTracing({
        tracingOrigins: ['*'],
        routingInstrumentation: Sentry.routingInstrumentation
      }),
      new ExtraErrorDataIntegration({ depth: 8 }),
      new CaptureConsoleIntegration({ levels: [
          'warn',
          'error',
          'debug',
          'assert'
        ] }),
      new DedupeIntegration()

    ],
    tracesSampleRate: 0.3,
    attachStacktrace: true,
    normalizeDepth: 8
  });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot(appRoutes, routerConfig),
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxStripeModule.forRoot('pk_test_51J8a98AUCz4pSoniCwZTGbJzdnkGboG6YDd5AsEtBuaKiBWvwcjhrWY3lbXzh0QrVX1TRPn9tcXeUcc3E87dRtKg00zzQ7DEDG'),
    NgxTimeSchedulerModule.forRoot({
      provide: TimeSchedulerDateAdapter,
      useFactory: TimeSchedulerDateFnsAdapterFactoy
    }),
    TranslateModule.forRoot(),
    HttpClientModule,
    NgApexchartsModule,
    CalendarModule.forRoot({
      provide: AngularCalendarDateAdapter,
      useFactory: AngularCalendarDateFnsAdapterFactory
    }),
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 300,
      passThruUnknownUrl: true,
      post204: false,
      put204: false
    }),
    SharedModule,
    FuseModule,
    FuseConfigModule.forRoot(appConfig),
    FuseMockApiModule.forRoot(mockApiServices),
    LayoutModule,
    MarkdownModule.forRoot({}),
    IntercomModule.forRoot({
      appId: environment.intercomAPIKey,
      updateOnRouterChange: true
    }),
    MatDialogModule,
    MatMomentDatetimeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule,
    FuseDrawerModule,
    MatChipsModule,
    MatFormFieldModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    {
      provide: ErrorHandler,
      // useValue: (environment.dev || environment.e2e)? new ErrorHandler() : Sentry.createErrorHandler({
      //   showDialog: true,
      //   logErrors: true
      // })
      useValue: Sentry.createErrorHandler({
        showDialog: environment.stage || environment.test,
        logErrors: true
      })
    },
    {
      provide: Sentry.TraceService,
      deps: [Router]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: navigator.language }
  ],
  exports: [NgxStripeModule],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {}
}
