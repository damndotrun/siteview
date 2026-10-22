import { useEffect, useState } from 'react';
import { useModuleSettings } from '@/lib/panel/hooks';
import type { ModulePanel } from '@/lib/panel/types';
import { MAX_QUALITY, MIN_QUALITY, TOKENS, clampQuality } from './logic';
import { kepmentes } from './module';

function Settings() {
  const [settings, update] = useModuleSettings(kepmentes);
  const [template, setTemplate] = useState(settings.filenameTemplate);
  useEffect(() => setTemplate(settings.filenameTemplate), [settings.filenameTemplate]);

  return (
    <div className="settings-form">
      <label className="field">
        <span>JPG minőség ({MIN_QUALITY}–{MAX_QUALITY})</span>
        <input
          type="number"
          name="jpegQuality"
          min={MIN_QUALITY}
          max={MAX_QUALITY}
          value={settings.jpegQuality}
          onChange={(event) => update({ jpegQuality: clampQuality(event.currentTarget.valueAsNumber) })}
        />
      </label>
      <label className="field">
        <span>Fájlnév-sablon</span>
        <input
          type="text"
          name="filenameTemplate"
          value={template}
          onChange={(event) => setTemplate(event.currentTarget.value)}
          onBlur={() => update({ filenameTemplate: template.trim() || kepmentes.defaults.filenameTemplate })}
        />
      </label>
      <p className="note">
        Tokenek: {TOKENS.join(', ')}. A kiterjesztést (.jpg, .png) a Siteview teszi hozzá.
      </p>
      <label className="field field-inline">
        <input
          type="checkbox"
          name="saveAs"
          checked={settings.saveAs}
          onChange={(event) => update({ saveAs: event.currentTarget.checked })}
        />
        <span>„Mentés másként” ablak mentés előtt</span>
      </label>
    </div>
  );
}

export const kepmentesPanel: ModulePanel = { Settings };
