export default function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  Object.keys(obj).forEach((k) => {
    const v = (obj as any)[k];
    if (v === undefined) return;
    if (v === null) return;
    if (typeof v === 'string' && v.trim() === '') return;
    out[k as keyof T] = v;
  });
  return out;
}
