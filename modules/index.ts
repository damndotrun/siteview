import type { ModuleDef } from '@/lib/core/types';
import { altatas } from './altatas/module';
import { kepmentes } from './kepmentes/module';
import { oldalpanel } from './oldalpanel/module';

/** A modulok listája abban a sorrendben, ahogy a beállítások nézetben megjelennek. */
export const MODULES: ModuleDef[] = [oldalpanel, altatas, kepmentes];
