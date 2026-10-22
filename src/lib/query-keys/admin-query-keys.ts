export const ADMIN_QUERY_KEYS = {
  classrooms: {
    all: ["admin", "classrooms"] as const,
    list: ["admin", "classrooms", "list"] as const,
    detail: (classroomId: string) =>
      ["admin", "classrooms", "detail", classroomId] as const,
  },

  posts: {
    all: ["admin", "posts"] as const,
    list: (classroomId: string | null) =>
      ["admin", "posts", "list", classroomId] as const,
  },

  kids: {
    all: ["admin", "kids"] as const,
    byClassroom: (classroomId: string) =>
      ["admin", "kids", "byClassroom", classroomId] as const,
  },

  charts: {
    all: ["admin", "charts"] as const,
    byClassroom: (classroomId: string) =>
      ["admin", "charts", "byClassroom", classroomId] as const,
  },

  settings: {
    all: ["admin", "settings"] as const,
    account: ["admin", "settings", "account"] as const,
  },
} as const;
