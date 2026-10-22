export const ADMIN_QUERY_KEYS = {
  classrooms: {
    all: ["admin", "classrooms"] as const,
    list: ["admin", "classrooms", "list"] as const,
    detail: (id: string) => ["admin", "classrooms", "detail", id] as const,
  },

  kids: {
    all: ["admin", "kids"] as const,
    list: (classroomId: string) =>
      ["admin", "kids", "list", classroomId] as const,
  },

  posts: {
    all: ["admin", "posts"] as const,
    list: (classroomId: string | null) =>
      ["admin", "posts", "list", classroomId] as const,
  },

  chart: {
    all: ["admin", "chart"] as const,
    detail: (classroomId: string) => ["admin", "chart", classroomId] as const,
  },

  setting: ["admin", "setting"] as const,
};
