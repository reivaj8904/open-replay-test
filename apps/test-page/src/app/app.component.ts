import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OpenReplayService } from '@test-project/open-replay';

@Component({
  selector: 'test-project-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'test-page';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private openReplay: OpenReplayService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.openReplay.start();
    }
  }
}
