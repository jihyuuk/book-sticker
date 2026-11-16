import type { PublicSearchSort } from "@/api/public-search-api";

export const PUBLIC_QUERY_KEYS = {
  posts: {
    all: ["public", "posts"] as const,
    list: (publicId: string) => ["public", "posts", "list", publicId] as const,
    createData: (publicId: string) =>
      ["public", "posts", "createData", publicId] as const,
    search: (publicId: string, keyword: string, sort: PublicSearchSort) =>
      ["public", "posts", "search", publicId, keyword, sort] as const,
  },

  chart: (publicId: string) => ["public", "chart", publicId] as const,
} as const;
