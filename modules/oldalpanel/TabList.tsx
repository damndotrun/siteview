import { useEffect, useState } from 'react';
import { browser, type Browser } from 'wxt/browser';
import { useModuleSettings } from '@/lib/panel/hooks';
import type { TabExtras } from '@/lib/panel/types';
import { removeSleepPrefix } from '@/modules/altatas/logic';
import { buildSections, displayDomain, type GroupInfo } from './groups';
import { oldalpanel } from './module';

type Tab = Browser.tabs.Tab;

interface TabsSnapshot {
  tabs: Tab[];
  groups: GroupInfo[];
  currentWindowId?: number;
}

/** Az ablak(ok) tabjai és tabcsoportjai, a böngésző eseményeire frissítve. */
function useTabs(allWindows: boolean): TabsSnapshot {
  const [snapshot, setSnapshot] = useState<TabsSnapshot>({ tabs: [], groups: [] });
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = async () => {
      const current = await browser.windows.getCurrent();
      const [tabs, groups] = await Promise.all([
        browser.tabs.query(allWindows ? {} : { windowId: current.id }),
        browser.tabGroups.query(allWindows ? {} : { windowId: current.id }),
      ]);
      if (!cancelled) setSnapshot({ tabs, groups, currentWindowId: current.id });
    };
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => void load(), 50);
    };
    const events = [
      browser.tabs.onCreated,
      browser.tabs.onUpdated,
      browser.tabs.onRemoved,
      browser.tabs.onMoved,
      browser.tabs.onActivated,
      browser.tabs.onAttached,
      browser.tabs.onDetached,
      browser.tabs.onReplaced,
      browser.tabGroups.onCreated,
      browser.tabGroups.onUpdated,
      browser.tabGroups.onRemoved,
    ] as { addListener: (cb: () => void) => void; removeListener: (cb: () => void) => void }[];
    for (const event of events) event.addListener(refresh);
    void load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      for (const event of events) event.removeListener(refresh);
    };
  }, [allWindows]);
  return snapshot;
}

function Favicon({ url }: { url?: string }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed || !/^(https?|data):/.test(url)) return <span className="favicon favicon-empty" />;
  return <img className="favicon" src={url} alt="" width={16} height={16} onError={() => setFailed(true)} />;
}

function TabRow({ tab, extras }: { tab: Tab; extras: TabExtras[] }) {
  const activate = () => {
    if (tab.id === undefined) return;
    void browser.tabs.update(tab.id, { active: true });
    void browser.windows.update(tab.windowId, { focused: true });
  };
  const classes = ['tab-row', tab.discarded && 'is-discarded', tab.active && 'is-active']
    .filter(Boolean)
    .join(' ');
  return (
    <li className={classes} data-tab-id={tab.id} data-discarded={tab.discarded ? 'true' : 'false'}>
      <button type="button" className="tab-main" onClick={activate} title={tab.url}>
        <Favicon url={tab.favIconUrl} />
        <span className="tab-title">{removeSleepPrefix(tab.title || tab.url || '')}</span>
        <span className="tab-domain">{displayDomain(tab.url)}</span>
      </button>
      <span className="tab-status">
        {tab.audible && (
          <span className="status-icon" role="img" aria-label="Hangot játszik" title="Hangot játszik">
            🔊
          </span>
        )}
        {tab.discarded && (
          <span className="status-icon" role="img" aria-label="Altatva" title="Altatva">
            💤
          </span>
        )}
        {extras.map((extra, index) => (
          <span key={index}>{extra.status?.(tab)}</span>
        ))}
      </span>
      <span className="tab-actions">
        {extras.map((extra, index) => (
          <span key={index}>{extra.actions?.(tab)}</span>
        ))}
      </span>
    </li>
  );
}

function GroupBlock({ group, tabs, extras }: { group: GroupInfo; tabs: Tab[]; extras: TabExtras[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const title = group.title || 'Névtelen csoport';
  return (
    <li className="group" data-group-id={group.id}>
      <button
        type="button"
        className="group-header"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed(!collapsed)}
        style={{ '--group-color': `var(--group-${group.color})` } as React.CSSProperties}
      >
        <span className="group-chevron" aria-hidden>
          {collapsed ? '▸' : '▾'}
        </span>
        <span className="group-dot" aria-hidden />
        <span className="group-title">{title}</span>
        <span className="group-count" aria-label={`${tabs.length} tab`}>
          {tabs.length}
        </span>
      </button>
      {!collapsed && (
        <ul className="tab-list">
          {tabs.map((tab) => (
            <TabRow key={tab.id} tab={tab} extras={extras} />
          ))}
        </ul>
      )}
    </li>
  );
}

/** TS1: a tablista csoportfejlécekkel; az `extras` a bekapcsolt modulok hozzájárulása. */
export function TabList({ extras }: { extras: TabExtras[] }) {
  const [settings, update] = useModuleSettings(oldalpanel);
  const { tabs, groups, currentWindowId } = useTabs(settings.allWindows);
  const sections = buildSections(tabs, groups, currentWindowId);

  return (
    <section className="tabs-view" aria-label="Tabok">
      <div className="toolbar">
        <label className="field-inline">
          <input
            type="checkbox"
            name="allWindows"
            checked={settings.allWindows}
            onChange={(event) => update({ allWindows: event.currentTarget.checked })}
          />
          <span>Minden ablak</span>
        </label>
        <span className="toolbar-spacer" />
        {currentWindowId !== undefined && extras.map((extra, index) => (
          <span key={index}>{extra.windowActions?.(currentWindowId)}</span>
        ))}
      </div>
      {sections.length === 0 && <p className="empty">Nincs nyitott tab.</p>}
      {sections.map((section, index) => (
        <div className="window-section" key={section.windowId} data-window-id={section.windowId}>
          {sections.length > 1 && (
            <h2 className="window-title">
              {section.windowId === currentWindowId ? 'Ez az ablak' : `${index + 1}. ablak`}
              <span className="group-count">{section.tabCount}</span>
            </h2>
          )}
          <ul className="tab-list">
            {section.items.map((item) =>
              item.kind === 'tab' ? (
                <TabRow key={item.tab.id} tab={item.tab} extras={extras} />
              ) : (
                <GroupBlock key={`g${item.group.id}-${item.tabs[0]?.id}`} group={item.group} tabs={item.tabs} extras={extras} />
              ),
            )}
          </ul>
        </div>
      ))}
    </section>
  );
}
