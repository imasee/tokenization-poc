import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import type { BrandConfig } from '@triparc/brand-engine';

import {
  getBrandConfigSnapshot,
  resetBrandConfigSnapshot,
  setBrandConfigSnapshot,
} from '../mock-data/brand-store';

/** Simulated network latency (ms) so loading/saving states are visible in the UI. */
const SIMULATED_LATENCY_MS = 500;

/**
 * Stands in for the real Branding API (`GET/PUT /Brand/{brandCode}`).
 * Reads/writes the same in-memory store the bootstrap-time fetch interceptor uses,
 * so edits saved here are reflected on the next app load too.
 */
@Injectable({ providedIn: 'root' })
export class MockBrandApiService {
  /** Synchronous snapshot — used to seed component state before the simulated GET resolves. */
  snapshot(): BrandConfig {
    return getBrandConfigSnapshot();
  }

  /** Simulates `GET /Brand/{brandCode}`. */
  getBrandConfig$(): Observable<BrandConfig> {
    return of(getBrandConfigSnapshot()).pipe(delay(SIMULATED_LATENCY_MS));
  }

  /** Simulates `PUT /Brand/{brandCode}`, persisting the change in memory. */
  updateBrandConfig$(next: BrandConfig): Observable<BrandConfig> {
    if (!next.name?.trim()) {
      return throwError(() => new Error('Brand name is required.')).pipe(delay(SIMULATED_LATENCY_MS));
    }

    return of(setBrandConfigSnapshot(next)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  /** Simulates a `DELETE /Brand/{brandCode}/reset` style endpoint. */
  resetBrandConfig$(): Observable<BrandConfig> {
    return of(resetBrandConfigSnapshot()).pipe(delay(SIMULATED_LATENCY_MS));
  }
}
