import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { BookInfoData } from "@/components/book/book-info";
import { useBookByIsbn } from "@/hooks/mutations/use-book-by-isbn";

type Props = {
  onBack: () => void;
  onFound: (book: BookInfoData) => void;
};

export default function BookIsbnSearchView({ onBack, onFound }: Props) {
  const [isbn, setIsbn] = useState("");

  const { mutate: findBook, isPending } = useBookByIsbn();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = isbn.trim();

    const isValidIsbn =
      /^\d{13}$/.test(value) &&
      (value.startsWith("978") || value.startsWith("979"));

    if (!isValidIsbn) {
      toast.warning("올바른 ISBN을 입력해주세요.", {
        description: "978 또는 979로 시작하는 13자리 숫자를 입력해주세요.",
      });

      return;
    }

    findBook(value, {
      onSuccess: (result) => {
        if (result.status === "BOOK_NOT_FOUND") {
          toast.error("책 정보를 찾을 수 없어요.", {
            description: `ISBN: ${value}`,
          });

          return;
        }

        onFound(result.book);
      },

      onError: () => {
        toast.error("책 정보를 조회하지 못했어요.", {
          description: "잠시 후 다시 시도해주세요.",
        });
      },
    });
  };

  return (
    <section className="flex h-full min-h-0 flex-col bg-white">
      {/* 헤더 */}
      <header className="relative flex h-14 shrink-0 items-center justify-center px-4">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 flex size-10 items-center justify-center rounded-full transition hover:bg-slate-100"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="size-5" />
        </button>
      </header>

      {/* 검색 영역 */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-sm">
          <div>
            <h2 className="text-xl font-semibold">ISBN으로 책 검색</h2>

            <p className="mt-2 text-sm text-slate-500">
              책 뒷면에 있는 ISBN 13자리 숫자를 입력해주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            {/* <label
              htmlFor="isbn"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              ISBN
            </label> */}

            <input
              id="isbn"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="예: 9788928330027"
              value={isbn}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");

                setIsbn(value.slice(0, 13));
              }}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base transition outline-none focus:border-slate-900"
            />

            <button
              type="submit"
              disabled={isPending || !isbn}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 font-medium text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  책 검색 중...
                </>
              ) : (
                <>
                  <Search className="size-4" />
                  검색하기
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
