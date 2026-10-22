import type { ModulePanel } from '@/lib/panel/types';
import { altatasPanel } from './altatas/panel';

/** A modulok panel-részei modulazonosító szerint. */
export const PANEL_PARTS: Record<string, ModulePanel> = {
  altatas: altatasPanel,
};
