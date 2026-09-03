export const QUERY_KEYS = {
  kid: {
    all: ["kid"] as const,
    list: ["kid", "list"] as const,
    byId: (kidId: string) => ["kid", "byId", kidId] as const,
  },
};
