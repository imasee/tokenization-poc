import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { BrandConfig } from '@triparc/brand-engine';

const HEX_COLOR_PATTERN = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

type EditableColorKey =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'secondaryAccent'
  | 'tertiaryAccent'
  | 'backgroundPrimary'
  | 'backgroundSecondary'
  | 'backgroundTertiary';

interface ColorFieldMeta {
  key: EditableColorKey;
  label: string;
  hint: string;
}

const COLOR_FIELDS: ColorFieldMeta[] = [
  { key: 'primary', label: 'Primary', hint: 'Main brand color' },
  { key: 'secondary', label: 'Secondary', hint: 'Supporting brand color' },
  { key: 'tertiary', label: 'Tertiary', hint: 'Additional accent surface' },
  { key: 'accent', label: 'Accent', hint: 'Call-to-action highlight' },
  { key: 'secondaryAccent', label: 'Secondary Accent', hint: 'Secondary highlight' },
  { key: 'tertiaryAccent', label: 'Tertiary Accent', hint: 'Tertiary highlight' },
  { key: 'backgroundPrimary', label: 'Background Primary', hint: 'Main page background' },
  { key: 'backgroundSecondary', label: 'Background Secondary', hint: 'Section background' },
  { key: 'backgroundTertiary', label: 'Background Tertiary', hint: 'Card / surface background' },
];

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

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', Validators.required),
    legalName: this.fb.nonNullable.control('', Validators.required),
    defaultFontFamily: this.fb.nonNullable.control('', Validators.required),
    displayFontFamily: this.fb.nonNullable.control('', Validators.required),
    colors: this.fb.nonNullable.group({
      primary: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      secondary: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      tertiary: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      accent: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      secondaryAccent: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      tertiaryAccent: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      backgroundPrimary: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      backgroundSecondary: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
      backgroundTertiary: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(HEX_COLOR_PATTERN)]),
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
        secondary: hex('secondary'),
        tertiary: hex('tertiary'),
        accent: hex('accent'),
        secondaryAccent: hex('secondaryAccent'),
        tertiaryAccent: hex('tertiaryAccent'),
        backgroundPrimary: hex('backgroundPrimary'),
        backgroundSecondary: hex('backgroundSecondary'),
        backgroundTertiary: hex('backgroundTertiary'),
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
        secondary: { hex: value.colors.secondary },
        tertiary: { hex: value.colors.tertiary },
        accent: { hex: value.colors.accent },
        secondaryAccent: { hex: value.colors.secondaryAccent },
        tertiaryAccent: { hex: value.colors.tertiaryAccent },
        backgroundPrimary: { hex: value.colors.backgroundPrimary },
        backgroundSecondary: { hex: value.colors.backgroundSecondary },
        backgroundTertiary: { hex: value.colors.backgroundTertiary },
      },
      dateModified: new Date().toISOString(),
    };
  }
}

