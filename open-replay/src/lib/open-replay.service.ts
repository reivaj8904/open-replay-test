import { Inject, Injectable, isDevMode, NgZone, PLATFORM_ID, } from '@angular/core';

import Tracker from '@openreplay/tracker';
import trackerAssist from '@openreplay/tracker-assist';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

type ReqRespType = {
  request: HttpRequest<unknown>;
  response: HttpResponse<unknown>;
};

@Injectable({
  providedIn: 'root',
})
export class OpenReplayService {
  public tracker?: Tracker | null;

  constructor(
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        this.tracker = new Tracker({
          projectKey: 'qpgAna7FmgdXyNBRIjcZ',
          __DISABLE_SECURE_MODE: isDevMode(),
          obscureTextNumbers: true,
          obscureInputDates: true,
          obscureInputNumbers: true,
          captureIFrames: false,
          network: {
            failuresOnly: false,
            sessionTokenHeader: false,
            ignoreHeaders: false,
            capturePayload: true,
            captureInIframes: true,
          },
        });

        this.tracker.use(
          trackerAssist({
            confirmText: `tienes una llamada del equipo de SeguroCanguro.com, quieres responder?`,
          })
        );
      });
    }
  }

  public async start() {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        if (this.tracker && window.location.hostname !== 'localhost') {
          return this.tracker.start();
        } else {
          return {
            sessionID: null,
            sessionToken: null,
            userUUID: null,
          };
        }
      });
    }
  }

  isActive() {
    if (isPlatformBrowser(this.platformId)) {
      return this.zone.runOutsideAngular(() => {
        if (this.tracker) {
          return this.tracker.isActive();
        }
        return false;
      });
    }
    return false;
  }

  public setUserData(user: { id: string }): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        if (this.tracker && user.id) {
          this.tracker.setUserID(String(user.id));
        }
      });
    }
  }

  public sendEventToReplaySession(event: string, params: ReqRespType): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        if (this.tracker) {
          const { request, response } = params;

          this.tracker?.event(event + '[request]', {
            method: request.method,
            url: request.url,
            params: request.params,
          });
          this.tracker?.event(event + '[response]', {
            body: response.body,
            status: response.status,
            headers: response.headers,
          });
        }
      });
    }
  }

  identify(key: string, value?: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        if (this.tracker && value) {
          this.tracker.setMetadata(key, value);
        }
      });
    }
  }

  setError(error: Error | ErrorEvent | PromiseRejectionEvent) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        if (this.tracker) {
          this.tracker.handleError(error);
        }
      });
    }
  }
}
