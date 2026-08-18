import { Injectable, inject } from '@angular/core';
import { StyleManagerService, ThemeManagerService, type ThemeConfig } from '@triparc/brand-engine';

/** Must match `$theme-prefix` in styles/theming/core/_settings.scss. */
const THEME_PREFIX = 'dtheme';

/** Fixed id so `clearTheme()` can reliably find and remove the injected `<style>` tag. */
const STYLE_ID = 'app-brand-theme';

/**
 * Applies/removes the live brand color CSS variables directly via brand-engine's own
 * `ThemeManagerService`/`StyleManagerService`, bypassing `<be-theme-provider>` — its
 * `applyTheme()` silently no-ops on an empty theme instead of removing the previous
 * `<style>` tag, which would leave stale brand colors behind after "reset to default".
 */
@Injectable({ providedIn: 'root' })
export class ThemeStateService {
  private readonly themeManager = inject(ThemeManagerService);
  private readonly styleManager = inject(StyleManagerService);

  applyTheme(theme: ThemeConfig): void {
    const styles = this.themeManager.generateStylesFromObject(theme, THEME_PREFIX);

    if (styles.length === 0) {
      this.clearTheme();
      return;
    }

    this.styleManager.applyRulesToDOM(STYLE_ID, styles.join(';'));
  }

  /** Removes the live brand colors entirely, so the SCSS default-token fallback renders. */
  clearTheme(): void {
    this.styleManager.removeStyleRules(STYLE_ID);
  }
}
