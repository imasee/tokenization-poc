import type { BrandConfig } from '@triparc/brand-engine';

import { DEFAULT_BRAND_CONFIG } from './brand-config.mock';

/** Plain in-memory store shared between Angular services editing/previewing brand data. */
let current: BrandConfig = structuredClone(DEFAULT_BRAND_CONFIG);

export function getBrandConfigSnapshot(): BrandConfig {
  return structuredClone(current);
}

export function setBrandConfigSnapshot(config: BrandConfig): BrandConfig {
  current = structuredClone(config);
  return getBrandConfigSnapshot();
}

export function resetBrandConfigSnapshot(): BrandConfig {
  current = structuredClone(DEFAULT_BRAND_CONFIG);
  return getBrandConfigSnapshot();
}
