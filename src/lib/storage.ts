/** How a value is turned into / read back from a localStorage string. */
export interface StorageCodec<T> {
  parse(raw: string | null): T;
  stringify(value: T): string;
}

/** Plain strings, stored as-is. A missing key reads as ''. */
export const stringCodec: StorageCodec<string> = {
  parse: (raw) => raw ?? '',
  stringify: (value) => value,
};

/** JSON arrays. A missing or corrupt key reads as []. */
export function jsonArrayCodec<T>(): StorageCodec<T[]> {
  return {
    parse(raw) {
      if (!raw) {
        return [];
      }

      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    },
    stringify: (value) => JSON.stringify(value),
  };
}

/** Integers; a missing key reads as 0. */
export const numberCodec: StorageCodec<number> = {
  parse: (raw) => Number(raw) || 0,
  stringify: (value) => String(value),
};

/** Integers or null; a missing key reads as null. */
export const nullableNumberCodec: StorageCodec<number | null> = {
  parse: (raw) => (raw ? Number(raw) : null),
  stringify: (value) => (value === null ? '' : String(value)),
};
