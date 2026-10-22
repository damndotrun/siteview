import { useCallback, useEffect, useState } from 'react';
import { getSettings, updateSettings, watchSettings } from '@/lib/core/settings';
import type { ModuleDef, ModuleSettings } from '@/lib/core/types';

/** Egy modul szinkronizált beállításai, élő frissítéssel. */
export function useModuleSettings<S extends ModuleSettings>(
  def: ModuleDef<S>,
): [S, (patch: Partial<S>) => void] {
  const [settings, setSettings] = useState<S>(def.defaults);
  useEffect(() => {
    void getSettings(def).then(setSettings);
    return watchSettings(def, setSettings);
  }, [def]);
  const update = useCallback(
    (patch: Partial<S>) => {
      setSettings((current) => ({ ...current, ...patch }));
      void updateSettings(def, patch);
    },
    [def],
  );
  return [settings, update];
}
