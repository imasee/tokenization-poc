import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ThemeManagerService, ThemeProviderComponent, type BrandConfig, type ThemeConfig } from '@triparc/brand-engine';


@Component({
  selector: 'app-brand-preview',
  standalone: true,
  imports: [ThemeProviderComponent],
  templateUrl: './brand-preview.html',
  styleUrl: './brand-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandPreview {
  private readonly themeManager = inject(ThemeManagerService);

  readonly brandConfig = input.required<BrandConfig>();

}

