import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ThemeManagerService, type BrandConfig } from '@triparc/brand-engine';

import { ThemeStateService } from '../../../core/services/theme-state.service';
import { MockBrandApiService } from '../../../core/services/mock-brand-api.service';
import { BrandEditor } from '../brand-editor/brand-editor';
import { BrandPreview } from '../brand-preview/brand-preview';

@Component({
  selector: 'app-brand-theming-page',
  standalone: true,
  imports: [BrandEditor, BrandPreview],
  templateUrl: './brand-theming-page.html',
  styleUrl: './brand-theming-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandThemingPage {
  private readonly mockBrandApi = inject(MockBrandApiService);
  private readonly themeManager = inject(ThemeManagerService);
  private readonly themeState = inject(ThemeStateService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly statusMessage = signal<string | null>(null);
  readonly busy = computed(() => this.loading() || this.saving());

  readonly initialConfig = signal<BrandConfig>(this.mockBrandApi.snapshot());
  readonly liveConfig = signal<BrandConfig>(this.mockBrandApi.snapshot());
  readonly themeApplied = signal(false);

  constructor() {
    this.mockBrandApi.getBrandConfig$().subscribe((config) => {
      this.applyConfig(config);
      this.loading.set(false);
    });
  }

  onConfigChange(config: BrandConfig): void {
    this.liveConfig.set(config);
  }

  onSave(config: BrandConfig): void {
    this.saving.set(true);
    this.statusMessage.set(null);

    this.mockBrandApi.updateBrandConfig$(config).subscribe({
      next: (updated) => {
        this.applyConfig(updated);

        // Keep the live theme in sync with the just-saved colors, if it's currently active.
        if (this.themeApplied()) {
          this.themeState.applyTheme(this.themeManager.createThemeForBrand(updated));
        }

        this.saving.set(false);
        this.statusMessage.set('Brand saved successfully.');
      },
      error: (error: Error) => {
        this.saving.set(false);
        this.statusMessage.set(error.message);
      },
    });
  }

  onReset(): void {
    this.loading.set(true);
    this.statusMessage.set(null);

    this.mockBrandApi.resetBrandConfig$().subscribe((config) => {
      this.applyConfig(config);

      // "Reset to default" always means falling back to the SCSS default tokens, not applying
      // the reset config's colors as a live theme.
      this.themeState.clearTheme();
      this.themeApplied.set(false);

      this.loading.set(false);
      this.statusMessage.set('Brand reset to default.');
    });
  }

  /** Loads the currently edited (not necessarily saved) colors into the live root theme, or
   *  clears it back to the SCSS default-token fallback. Applies instantly — no reload needed. */
  onToggleTheme(): void {
    if (this.themeApplied()) {
      this.themeState.clearTheme();
      this.themeApplied.set(false);
      return;
    }

    this.themeState.applyTheme(this.themeManager.createThemeForBrand(this.liveConfig()));
    this.themeApplied.set(true);
  }

  private applyConfig(config: BrandConfig): void {
    this.initialConfig.set(config);
    this.liveConfig.set(config);
  }
}
