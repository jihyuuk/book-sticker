export const PUBLIC_QUERY_KEYS = {
  posts: {
    all: ["public", "posts"] as const,
    list: (publicId: string) => ["public", "posts", "list", publicId] as const,
    createData: (publicId: string) =>
      ["public", "posts", "createData", publicId] as const,
  },

  charts: {
    all: ["public", "charts"] as const,
    byPublicId: (publicId: string) =>
      ["public", "charts", "byPublicId", publicId] as const,
  },

  // 내 코드
  chart: (publicId: string) => ["public", "chart", publicId] as const,
} as const;
