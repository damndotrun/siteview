import { useState } from 'react';
import { useModuleSettings } from '@/lib/panel/hooks';
import type { ModuleDef } from '@/lib/core/types';
import { MODULES } from '@/modules';
import { PANEL_PARTS } from '@/modules/panel';

function ModuleRow({ def, onOpen }: { def: ModuleDef; onOpen?: () => void }) {
  const [settings, update] = useModuleSettings(def);
  return (
    <li className="module-row" data-module={def.id}>
      <button type="button" className="module-main" onClick={onOpen} disabled={!onOpen}>
        <span className="module-name">{def.name}</span>
        <span className="module-description">{def.description}</span>
      </button>
      <input
        type="checkbox"
        role="switch"
        className="switch"
        aria-label={`${def.name} bekapcsolva`}
        checked={settings.enabled}
        onChange={(event) => update({ enabled: event.currentTarget.checked })}
      />
    </li>
  );
}

/** Beállítások nézet: modulonként egy sor kapcsolóval; a sorra kattintva a modul beállításai. */
export function SettingsView() {
  const [openId, setOpenId] = useState<string>();
  const open = MODULES.find((def) => def.id === openId);
  const ModuleSettings = open && PANEL_PARTS[open.id]?.Settings;

  if (open && ModuleSettings) {
    return (
      <section className="settings-view" aria-label={`${open.name} beállításai`}>
        <button type="button" className="back-button" onClick={() => setOpenId(undefined)}>
          ‹ Beállítások
        </button>
        <h2 className="view-title">{open.name}</h2>
        <ModuleSettings />
      </section>
    );
  }

  return (
    <section className="settings-view" aria-label="Beállítások">
      <ul className="module-list">
        {MODULES.map((def) => (
          <ModuleRow
            key={def.id}
            def={def}
            onOpen={PANEL_PARTS[def.id]?.Settings ? () => setOpenId(def.id) : undefined}
          />
        ))}
      </ul>
    </section>
  );
}
