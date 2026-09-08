export const QUERY_KEYS = {
  classroom: {
    all: ["classroom"] as const,
    byUserId: (userId: string) => ["classroom", "byUserId", userId] as const,
  },

  kid: {
    all: ["kid"] as const,
    list: ["kid", "list"] as const,
    byId: (kidId: string) => ["kid", "byId", kidId] as const,
  },

  book: {
    all: ["book"] as const,
    searchByTitle: (title: string) => ["book", "searchByTitle", title] as const,
  },

  publicChart: (publicId: string) => ["public-chart", publicId] as const,
};
