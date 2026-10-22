import { useEffect, useState } from 'react';
import { browser, type Browser } from 'wxt/browser';
import { sendAction } from '@/lib/core/client';
import { useModuleSettings } from '@/lib/panel/hooks';
import type { ModulePanel, TabExtras } from '@/lib/panel/types';
import { MAX_MINUTES, MIN_MINUTES, clampMinutes, matchesException, parseExceptions } from './logic';
import { altatas } from './module';
import { STATE_KEY, readState } from './state';

function useNeverSet(): Set<number> {
  const [never, setNever] = useState<Set<number>>(new Set());
  useEffect(() => {
    void readState().then((state) => setNever(new Set(state.never)));
    const listener = (changes: Record<string, Browser.storage.StorageChange>, area: string) => {
      if (area === 'session' && STATE_KEY in changes) {
        setNever(new Set((changes[STATE_KEY].newValue as { never?: number[] } | undefined)?.never ?? []));
      }
    };
    browser.storage.onChanged.addListener(listener);
    return () => browser.storage.onChanged.removeListener(listener);
  }, []);
  return never;
}

function useTabExtras(): TabExtras {
  const [settings] = useModuleSettings(altatas);
  const never = useNeverSet();
  const isProtected = (tab: Browser.tabs.Tab) =>
    (tab.id !== undefined && never.has(tab.id)) || matchesException(tab.url, settings.exceptions);

  return {
    status: (tab) =>
      isProtected(tab) ? (
        <span className="status-icon" role="img" aria-label="Altatási kivétel" title="Altatási kivétel">
          🛡
        </span>
      ) : null,
    actions: (tab) => (
      <>
        {!tab.discarded && !tab.active && (
          <button
            type="button"
            className="icon-button"
            aria-label="Altatás"
            title="Altatás"
            onClick={() => void sendAction('altatas.discardTab', { tabId: tab.id })}
          >
            💤
          </button>
        )}
        <button
          type="button"
          className="icon-button"
          aria-label="Ezt a tabot ne altasd"
          aria-pressed={tab.id !== undefined && never.has(tab.id)}
          title="Ezt a tabot ne altasd"
          onClick={() => void sendAction('altatas.toggleNever', { tabId: tab.id })}
        >
          🛡
        </button>
      </>
    ),
    windowActions: (windowId) => (
      <details className="menu">
        <summary>Altatás</summary>
        <div className="menu-items" role="menu">
          {(
            [
              ['altatas.discardOthers', 'Az ablak többi tabját altasd'],
              ['altatas.discardAllInactive', 'Minden inaktív tabot altass'],
              ['altatas.wakeNext', 'Ébreszd a következő tabot'],
              ['altatas.wakePrev', 'Ébreszd az előző tabot'],
              ['altatas.wakeWindow', 'Ébreszd az ablak összes tabját'],
            ] as const
          ).map(([action, label]) => (
            <button
              key={action}
              type="button"
              role="menuitem"
              onClick={(event) => {
                event.currentTarget.closest('details')?.removeAttribute('open');
                void sendAction(action, { windowId });
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </details>
    ),
  };
}

function Settings() {
  const [settings, update] = useModuleSettings(altatas);
  const [exceptionsText, setExceptionsText] = useState(settings.exceptions.join('\n'));
  useEffect(() => setExceptionsText(settings.exceptions.join('\n')), [settings.exceptions]);

  return (
    <div className="settings-form">
      <label className="field">
        <span>Altatás ennyi perc inaktivitás után</span>
        <input
          type="number"
          name="minutes"
          min={MIN_MINUTES}
          max={MAX_MINUTES}
          value={settings.minutes}
          onChange={(event) => update({ minutes: clampMinutes(event.currentTarget.valueAsNumber) })}
        />
      </label>
      <label className="field field-inline">
        <input
          type="checkbox"
          name="discardNewBackgroundTabs"
          checked={settings.discardNewBackgroundTabs}
          onChange={(event) => update({ discardNewBackgroundTabs: event.currentTarget.checked })}
        />
        <span>Háttérben nyitott új tab azonnali altatása</span>
      </label>
      <label className="field">
        <span>Kivételek (soronként egy hostnév, vagy re: előtaggal reguláris kifejezés)</span>
        <textarea
          name="exceptions"
          rows={5}
          value={exceptionsText}
          onChange={(event) => setExceptionsText(event.currentTarget.value)}
          onBlur={() => update({ exceptions: parseExceptions(exceptionsText) })}
        />
      </label>
      <p className="note">
        Soha nem altat: rögzített tabot, hangot játszó tabot, szüneteltetett lejátszót, el nem küldött
        űrlapot, a kivétellistát és az „ezt ne altasd” tabokat.
      </p>
      <p className="warning" role="note">
        A Chrome Memóriakímélője (chrome://settings/performance) a Siteview tudta nélkül is altathat
        tabokat. Kapcsold ki, hogy az altatás előtti lépések (pl. a tartalom kinyerése) ne maradjanak el.
      </p>
    </div>
  );
}

export const altatasPanel: ModulePanel = { useTabExtras, Settings };
