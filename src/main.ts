import { bootstrapApplication } from '@angular/platform-browser';
import { withBranding } from '@triparc/brand-engine';

import { appConfig } from './app/app.config';
import { App } from './app/app';
import { installMockBrandEndpoint } from './app/core/mock-data/mock-brand-fetch';
import { environment } from './environments/environment';

// Must run before withBranding() so its internal fetch() call resolves against mock data.
installMockBrandEndpoint(environment.brandEngineUrl, environment.brandIdentifier);

(async () => {
  try {
    const brandingProviders = await withBranding({
      domain: environment.brandEngineUrl,
      brandCode: environment.brandIdentifier,
    });

    await bootstrapApplication(App, {
      providers: [...appConfig.providers, ...brandingProviders],
    });
  } catch (error) {
    console.error('Error during app bootstrap:', error);
  }
})();
