import { useState } from 'react';
import { SettingsView } from '@/lib/panel/Settings';
import { useModuleSettings } from '@/lib/panel/hooks';
import type { TabExtras } from '@/lib/panel/types';
import { MODULES } from '@/modules';
import { TabList } from '@/modules/oldalpanel/TabList';
import { oldalpanel } from '@/modules/oldalpanel/module';
import { PANEL_PARTS } from '@/modules/panel';

const noExtras = (): TabExtras => ({});

/** A modulok tablista-hozzájárulása; minden modul hookja fut, de csak a bekapcsoltaké látszik. */
function useEnabledExtras(): TabExtras[] {
  return MODULES.map((def) => {
    // A MODULES sorrend rögzített, így a hookok sorrendje renderről renderre azonos.
    const [settings] = useModuleSettings(def);
    const extras = (PANEL_PARTS[def.id]?.useTabExtras ?? noExtras)();
    return settings.enabled ? extras : null;
  }).filter((extras): extras is TabExtras => extras !== null);
}

export function App() {
  const [view, setView] = useState<'tabs' | 'settings'>('tabs');
  const [panelSettings] = useModuleSettings(oldalpanel);
  const extras = useEnabledExtras();

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Siteview</h1>
        <nav className="app-nav">
          <button type="button" aria-pressed={view === 'tabs'} onClick={() => setView('tabs')}>
            Tabok
          </button>
          <button type="button" aria-pressed={view === 'settings'} onClick={() => setView('settings')}>
            Beállítások
          </button>
        </nav>
      </header>
      <main className="app-main">
        {view === 'settings' ? (
          <SettingsView />
        ) : panelSettings.enabled ? (
          <TabList extras={extras} />
        ) : (
          <p className="empty">Az Oldalpanel modul ki van kapcsolva. A Beállításokban bekapcsolhatod.</p>
        )}
      </main>
    </div>
  );
}
