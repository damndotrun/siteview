import type { ModuleDef, ModuleSettings } from '@/lib/core/types';

export interface OldalpanelSettings extends ModuleSettings {
  /** TS1: az aktuális ablak helyett minden ablak tabjai. */
  allWindows: boolean;
}

export const oldalpanel: ModuleDef<OldalpanelSettings> = {
  id: 'oldalpanel',
  name: 'Oldalpanel',
  description: 'Tablista a panelben, a Chrome tabcsoportjaival.',
  defaults: {
    enabled: true,
    allWindows: false,
  },
};
