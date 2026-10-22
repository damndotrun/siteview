import type { ModuleDef, ModuleSettings } from '@/lib/core/types';

export interface AltatasSettings extends ModuleSettings {
  /** Ennyi perc inaktivitás után altat (1–1440). */
  minutes: number;
  /** Kivétellista: hostnév (aldomainekkel együtt) vagy `re:` előtagú reguláris kifejezés a teljes URL-re. */
  exceptions: string[];
  /** ATD9: háttérben nyitott új tab azonnali altatása. */
  discardNewBackgroundTabs: boolean;
}

export const altatas: ModuleDef<AltatasSettings> = {
  id: 'altatas',
  name: 'Altatás',
  description: 'Altatja a régóta nem használt tabokat, hogy kevesebb memóriát foglaljanak.',
  defaults: {
    enabled: true,
    minutes: 30,
    exceptions: [],
    discardNewBackgroundTabs: true,
  },
};
