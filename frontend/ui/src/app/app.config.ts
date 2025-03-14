import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ApplicationConfig, ErrorHandler, provideZoneChangeDetection} from '@angular/core';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideRouter, Router} from '@angular/router';
import {routes} from './app.routes';
import {tokenInterceptor} from './services/auth.service';
import {errorToastInterceptor} from './services/error-toast.interceptor';
import {provideToastr} from 'ngx-toastr';
import * as Sentry from '@sentry/angular';
import {MARKED_OPTIONS, provideMarkdown} from 'ngx-markdown';
import {markedOptionsFactory} from './services/markdown-options.factory';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor, errorToastInterceptor])),
    provideAnimationsAsync(),
    provideToastr(),
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory,
      },
    }),
  ],
};
