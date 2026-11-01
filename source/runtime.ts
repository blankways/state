import type { RuntimeState } from '@/types/runtime.types.js'

// State shared by API functions for the lifetime of this module.
export const runtime: RuntimeState = {
    registries: new Map(),
    counters: new Map(),
    families: new Set(),
    familyCount: 0
}