import type { RegisteredModule } from '@/lib/core/core';
import { altatasBackground } from './altatas/background';
import { altatas } from './altatas/module';
import { oldalpanel } from './oldalpanel/module';

/** A modulok háttér-részei; csak a háttér importálja. */
export const BACKGROUND_MODULES: RegisteredModule[] = [
  { def: oldalpanel, background: {} },
  { def: altatas, background: altatasBackground },
];
