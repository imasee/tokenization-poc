import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { BrandConfig } from '@triparc/brand-engine';

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

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly statusMessage = signal<string | null>(null);
  readonly busy = computed(() => this.loading() || this.saving());

  readonly initialConfig = signal<BrandConfig>(this.mockBrandApi.snapshot());
  readonly liveConfig = signal<BrandConfig>(this.mockBrandApi.snapshot());

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
      this.loading.set(false);
      this.statusMessage.set('Brand reset to default.');
    });
  }

  private applyConfig(config: BrandConfig): void {
    this.initialConfig.set(config);
    this.liveConfig.set(config);
  }
}
