export type BookSearchResult = {
  isbn: string | null;
  title: string;
  author: string | null;
  publisher: string | null;
  coverUrl: string | null;
};

export const MOCK_BOOKS: BookSearchResult[] = [
  {
    isbn: "9788994368035",
    title: "구름빵",
    author: "백희나",
    publisher: "한솔수북",
    coverUrl: null,
  },
  {
    isbn: "9788952788015",
    title: "알사탕",
    author: "백희나",
    publisher: "책읽는곰",
    coverUrl: null,
  },
];

export async function searchBooksByTitle(
  title: string,
): Promise<BookSearchResult[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const keyword = title.trim();

  if (!keyword) return [];

  return MOCK_BOOKS.filter((book) => book.title.includes(keyword));
}
