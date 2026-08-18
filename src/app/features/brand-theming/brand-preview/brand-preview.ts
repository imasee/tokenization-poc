import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { BrandConfig } from '@triparc/brand-engine';

interface ColorSwatchMeta {
  key: string;
  label: string;
}

const COLOR_SWATCHES: ColorSwatchMeta[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'accent', label: 'Accent' },
  { key: 'warn', label: 'Warn' },
  { key: 'success', label: 'Success' },
  { key: 'alert', label: 'Alert' },
  { key: 'attention', label: 'Attention' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'color1', label: 'Color 1' },
  { key: 'color2', label: 'Color 2' },
  { key: 'color3', label: 'Color 3' },
  { key: 'color4', label: 'Color 4' },
];

interface StatusMessageMeta {
  key: string;
  label: string;
  message: string;
}

const STATUS_MESSAGES: StatusMessageMeta[] = [
  { key: 'success', label: 'Success', message: 'Your changes saved successfully.' },
  { key: 'warn', label: 'Warn', message: 'This action can\u2019t be undone.' },
  { key: 'alert', label: 'Alert', message: 'Double-check these values before continuing.' },
  { key: 'attention', label: 'Attention', message: 'New brand guidelines are available.' },
];

@Component({
  selector: 'app-brand-preview',
  standalone: true,
  imports: [],
  templateUrl: './brand-preview.html',
  styleUrl: './brand-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandPreview {
  readonly brandConfig = input.required<BrandConfig>();

  readonly colorSwatches = COLOR_SWATCHES;
  readonly statusMessages = STATUS_MESSAGES;
}


