import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/brand-theming/brand-theming-page/brand-theming-page').then(
        (m) => m.BrandThemingPage
      ),
  },
];
