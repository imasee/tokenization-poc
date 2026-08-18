import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { BrandConfig } from '@triparc/brand-engine';

const HEX_COLOR_PATTERN = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

type EditableColorKey =
  | 'primary'
  | 'accent'
  | 'warn'
  | 'success'
  | 'alert'
  | 'attention'
  | 'neutral'
  | 'color1'
  | 'color2'
  | 'color3'
  | 'color4';

interface ColorFieldMeta {
  key: EditableColorKey;
  label: string;
  hint: string;
}

/** Colors `ThemeManagerService`/brand-engine already maps and themes out of the box. */
const ENGINE_COLOR_FIELDS: ColorFieldMeta[] = [
  { key: 'primary', label: 'Primary', hint: 'Main brand color' },
  { key: 'accent', label: 'Accent', hint: 'Call-to-action highlight' },
];

/** Extra roles our palette supports that brand-engine doesn't map yet. */
const PENDING_COLOR_FIELDS: ColorFieldMeta[] = [
  { key: 'warn', label: 'Warn', hint: 'Error / destructive actions' },
  { key: 'success', label: 'Success', hint: 'Positive / confirmation states' },
  { key: 'alert', label: 'Alert', hint: 'Warning states' },
  { key: 'attention', label: 'Attention', hint: 'Informational highlight' },
  { key: 'neutral', label: 'Neutral', hint: 'Neutral UI surfaces' },
  { key: 'color1', label: 'Color 1', hint: 'Brand-specific slot' },
  { key: 'color2', label: 'Color 2', hint: 'Brand-specific slot' },
  { key: 'color3', label: 'Color 3', hint: 'Brand-specific slot' },
  { key: 'color4', label: 'Color 4', hint: 'Brand-specific slot' },
];

const COLOR_FIELDS: ColorFieldMeta[] = [...ENGINE_COLOR_FIELDS, ...PENDING_COLOR_FIELDS];

const FALLBACK_HEX = '#000000';

@Component({
  selector: 'app-brand-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './brand-editor.html',
  styleUrl: './brand-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandEditor {
  private readonly fb = inject(FormBuilder);

  readonly brandConfig = input.required<BrandConfig>();
  readonly saving = input<boolean>(false);

  readonly configChange = output<BrandConfig>();
  readonly save = output<BrandConfig>();
  readonly resetRequested = output<void>();

  readonly colorFields = COLOR_FIELDS;
  readonly engineColorFields = ENGINE_COLOR_FIELDS;
  readonly pendingColorFields = PENDING_COLOR_FIELDS;

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', Validators.required),
    legalName: this.fb.nonNullable.control('', Validators.required),
    defaultFontFamily: this.fb.nonNullable.control('', Validators.required),
    displayFontFamily: this.fb.nonNullable.control('', Validators.required),
    colors: this.fb.nonNullable.group({
      primary: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      accent: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      warn: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      success: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      alert: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      attention: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      neutral: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      color1: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      color2: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      color3: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      color4: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
    }),
  });

  constructor() {
    // Seed the form once brand data first arrives; further pushes only happen via patchForm().
    effect(() => this.patchForm(this.brandConfig()));

    this.form.valueChanges.subscribe(() => {
      if (this.form.valid) {
        this.configChange.emit(this.toBrandConfig());
      }
    });
  }

  /** Repopulates the form — used on initial load and on "Reset to default". */
  patchForm(config: BrandConfig): void {
    const hex = (key: EditableColorKey): string => config.colors[key]?.hex ?? FALLBACK_HEX;

    this.form.reset({
      name: config.name,
      legalName: config.legalName ?? '',
      defaultFontFamily: config.fonts.default.fontFamily,
      displayFontFamily: config.fonts.display.fontFamily,
      colors: {
        primary: hex('primary'),
        accent: hex('accent'),
        warn: hex('warn'),
        success: hex('success'),
        alert: hex('alert'),
        attention: hex('attention'),
        neutral: hex('neutral'),
        color1: hex('color1'),
        color2: hex('color2'),
        color3: hex('color3'),
        color4: hex('color4'),
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.toBrandConfig());
  }

  onReset(): void {
    this.resetRequested.emit();
  }

  /** Native `<input type="color">` only reflects lowercase 6-digit hex values. */
  colorSwatchValue(key: EditableColorKey): string {
    const value = this.form.controls.colors.controls[key].value;
    return HEX_COLOR_PATTERN.test(value) ? value.toLowerCase() : FALLBACK_HEX;
  }

  onColorPicked(key: EditableColorKey, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.form.controls.colors.controls[key].setValue(value.toUpperCase());
  }

  /** Merges the edited fields back into the original config, leaving everything else untouched. */
  private toBrandConfig(): BrandConfig {
    const value = this.form.getRawValue();
    const original = this.brandConfig();

    return {
      ...original,
      name: value.name,
      legalName: value.legalName,
      fonts: {
        default: { fontFamily: value.defaultFontFamily },
        display: { fontFamily: value.displayFontFamily },
      },
      colors: {
        ...original.colors,
        primary: { hex: value.colors.primary },
        accent: { hex: value.colors.accent },
        warn: { hex: value.colors.warn },
        success: { hex: value.colors.success },
        alert: { hex: value.colors.alert },
        attention: { hex: value.colors.attention },
        neutral: { hex: value.colors.neutral },
        color1: { hex: value.colors.color1 },
        color2: { hex: value.colors.color2 },
        color3: { hex: value.colors.color3 },
        color4: { hex: value.colors.color4 },
      },
      dateModified: new Date().toISOString(),
    };
  }
}

