import { browser } from 'wxt/browser';
import type { ActionData, ActionResult, RunActionMessage } from './types';

/** A panel és a tartalomszkriptek ezzel indítanak műveletet a háttérben. */
export async function sendAction(name: string, data: ActionData = {}): Promise<ActionResult> {
  const message: RunActionMessage = { type: 'runAction', name, data };
  return (await browser.runtime.sendMessage(message)) as ActionResult;
}
