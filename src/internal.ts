// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

// @ts-nocheck: For internal use

export function initInternal(): void {
    if (!globalThis.__dhscript) {
        globalThis.__dhscript = {};
    }
}

// deno-lint-ignore no-explicit-any
export function setInternal(key: string, value: any): void {
    initInternal();
    globalThis.__dhscript[key] = value;
}

export function getInternal(key: string): unknown {
    initInternal();
    return globalThis.__dhscript[key];
}

export function hasInternal(key: string): boolean {
    initInternal();
    return key in globalThis.__dhscript;
}

export function deleteInternal(key: string): void {
    initInternal();
    delete globalThis.__dhscript[key];
}

export function assignInternal(obj: Record<string, unknown>): void {
    initInternal();
    globalThis.__dhscript = Object.assign(globalThis.__dhscript, obj);
}
