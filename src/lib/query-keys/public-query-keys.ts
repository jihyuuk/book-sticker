export const PUBLIC_QUERY_KEYS = {
  posts: {
    all: ["public", "posts"] as const,
    list: (publicId: string) => ["public", "posts", "list", publicId] as const,
  },

  chart: {
    all: ["public", "chart"] as const,
    detail: (publicId: string) => ["public", "chart", publicId] as const,
  },

  postCreateData: {
    all: ["public", "post-create-data"] as const,
    detail: (publicId: string) =>
      ["public", "post-create-data", publicId] as const,
  },
};
