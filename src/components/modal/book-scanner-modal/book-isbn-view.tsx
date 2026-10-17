import { ArrowLeft, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { BookInfoData } from "@/components/book/book-info";
import { useBookByIsbn } from "@/hooks/mutations/book/use-book-by-isbn";
import PostSubmitButton from "@/components/post-field/post-submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SubHeader from "@/components/header/sub-header";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

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
      <header className="px-page-x flex h-14 items-center justify-start">
        <button type="button" onClick={onBack} aria-label="이전">
          <ArrowLeft className="size-6" strokeWidth={1.5} />
        </button>
      </header>

      {/* 검색 영역 */}
      <div className="px-page-x">
        <form onSubmit={handleSubmit}>
          {/* <input
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
            /> */}

          <Field className="gap-1">
            <FieldLabel className="text-headline-5">
              ISBN 번호로 책 조회
            </FieldLabel>

            <FieldDescription className="text-body-2 mb-3 text-gray-400">
              책 뒷면에 있는 ISBN 13자리 숫자를 입력해주세요.
            </FieldDescription>

            <Input
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
            />

            <Button
              type="submit"
              disabled={isPending || !isbn}
              className="mt-3 w-full"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Search className="size-4" />
                  조회하기
                </div>
              )}
            </Button>
          </Field>
        </form>
      </div>
    </section>
  );
}
