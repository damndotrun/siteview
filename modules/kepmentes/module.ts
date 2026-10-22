import type { ModuleDef, ModuleSettings } from '@/lib/core/types';

export interface KepmentesSettings extends ModuleSettings {
  /** SI4: JPG minőség (1–100). */
  jpegQuality: number;
  /** SI4: fájlnév-sablon; tokenek: `{cím}`, `{domain}`, `{dátum}`, `{idő}`, `{eredeti}`. */
  filenameTemplate: string;
  /** SI4: „Mentés másként” ablak a mentés előtt. */
  saveAs: boolean;
}

export const kepmentes: ModuleDef<KepmentesSettings> = {
  id: 'kepmentes',
  name: 'Képmentés',
  description: 'Jobb klikk egy képen: mentés JPG-ként vagy PNG-ként, sablon szerinti névvel.',
  defaults: {
    enabled: true,
    jpegQuality: 92,
    filenameTemplate: '{eredeti}',
    saveAs: false,
  },
};
