// In-memory database for web preview — replaces expo-sqlite (native only)

const mem = new Map<object, any[]>();

function rows(table: object): any[] {
  if (!mem.has(table)) mem.set(table, []);
  return mem.get(table)!;
}

const db = {
  select: (_fields?: any) => ({
    from: (table: any) => ({
      where: (_pred?: any) => ({
        get: () => rows(table)[0] ?? null,
        all: () => rows(table),
        orderBy: (_col?: any) => ({ all: () => rows(table) }),
      }),
      orderBy: (_col?: any) => ({ all: () => rows(table) }),
      all: () => rows(table),
      get: () => rows(table)[0] ?? null,
    }),
  }),
  insert: (table: any) => ({
    values: (rowOrRows: any) => ({
      run: () => {
        const arr = Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows];
        rows(table).push(...arr);
      },
    }),
  }),
  update: (table: any) => ({
    set: (patch: any) => ({
      where: (_pred?: any) => ({
        run: () => {
          const arr = rows(table);
          arr.forEach((r, i) => { arr[i] = { ...r, ...patch }; });
        },
      }),
    }),
  }),
};

export { db };

export async function initDb() {
  // no-op on web
}
