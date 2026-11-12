export type PostMedia =
  | {
      id: string;
      type: "IMAGE";
      url: string;
    }
  | {
      id: string;
      type: "VIDEO";
      url: string;
      posterUrl?: string;
    };
