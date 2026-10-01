export const QUERY_KEYS = {
  classroom: {
    all: ["classroom"] as const,
    list: ["classroom", "list"] as const,

    //리팩토링 - 레거시
    byUserId: (userId: string) => ["classroom", "byUserId", userId] as const,
  },

  setting: ["setting"] as const,
  settingClassroom: (classroomId: string) =>
    ["setting-classroom", classroomId] as const,

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

  publicKids: (publicId: string) => ["public-kids", publicId] as const,

  publicPosts: (publicId: string) => ["public-posts", publicId] as const,

  publicPostDetail: (publicId: string, postId: string) =>
    ["public-post-detail", publicId, postId] as const,

  adminPosts: {
    all: ["admin-posts"] as const,

    list: (classroomId: string | null) =>
      ["admin-posts", classroomId ?? "all"] as const,
  },
};
