import GlobalError from "@/components/global-error";
import GlobalLoading from "@/components/global-loading";
import PostPasswordModal from "@/components/modal/post-password-modal";
import PostImageCarousel from "@/components/post/image-carousel";
import PublicNotFound from "@/components/Public-not-fount";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePublicPostDetail } from "@/hooks/queries/use-public-post-detail";
import { useOpenAlertModal } from "@/store/alert-modal";
import { ChevronLeft, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

const book_info = {
  authors: ["푸른숲글방"],
  contents:
    "무럭무럭 자라는 꿈과 마음, 영양분이 되는 이야기를 만드는 그린키즈에서 ‘요술지팡이 전래명작동화’ 『소가 된 게으름뱅이』. 아이들이 꼭 알아야할 필수 도서인 전래동화, 명작동화를 골라 알차게 엮지요. 전래동화와 명작동화를 함께 읽으며 다양한 문화를 접하고 습득할 수 있어요. 아이의 눈높이에 맞춘 어휘와 문장으로 가독성과 집중력을 높였지요. 국내 유명 그림 작가들의 다채로운 일러스트를 보며 미적 감수성과 창의력이 무럭무럭 자라나요. 책 말미에 있는 부록",
  datetime: "2017-12-01T00:00:00.000+09:00",
  isbn: "1159483051 9791159483059",
  price: 6000,
  publisher: "그린키즈",
  sale_price: 5400,
  status: "정상판매",
  thumbnail:
    "https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F1591451%3Ftimestamp%3D20230721164314",
  title: "소가 된 게으름뱅이",
  translators: [],
  url: "https://search.daum.net/search?w=bookpage&bookId=1591451&q=%EC%86%8C%EA%B0%80+%EB%90%9C+%EA%B2%8C%EC%9C%BC%EB%A6%84%EB%B1%85%EC%9D%B4",
};

export type ModalActionType = "EDIT" | "DELETE" | null;

export default function PostDetailPage() {
  const { publicId, postId } = useParams();
  const openAlertModal = useOpenAlertModal();
  const navigate = useNavigate();

  const [modalAction, setModalAction] = useState<ModalActionType>(null);

  const { data, isPending, isError } = usePublicPostDetail(publicId, postId);

  if (isPending) return <GlobalLoading />;
  if (isError) return <GlobalError />;
  if (!data) return <PublicNotFound />;

  const { classroom, post } = data;

  if (!post) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>

          <Button asChild variant="outline" className="mt-4">
            <Link to={`/classroom/${classroom.public_id}/posts`}>
              목록으로 돌아가기
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-white px-2 md:h-20">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <ChevronLeft className="size-6" strokeWidth={2} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
            >
              <Ellipsis className="size-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => setModalAction("EDIT")}>
              <Pencil className="size-4" />
              수정
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setModalAction("DELETE")}
              className="text-red-500 hover:text-red-500 focus:text-red-500"
            >
              <Trash2 className="size-4" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* 책 정보 */}
      <div className="mt-4 px-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-sky-400" />
          <h2 className="text-lg font-semibold text-gray-800">책 정보</h2>
        </div>
      </div>
      <div className="flex gap-3 p-4">
        {/* 이미지 */}
        <img
          src={book_info.thumbnail}
          alt={book_info.title}
          className="w-24 self-stretch rounded-sm object-cover"
        />

        {/* 정보 */}
        <div className="min-w-0 flex-1">
          <h2 className="mb-3 text-xl font-bold text-gray-900">
            {book_info.title}
          </h2>

          <div className="grid grid-cols-[56px_1fr] gap-y-1 text-sm">
            <span className="text-gray-400">저자</span>
            <span className="text-gray-700">{book_info.authors ?? "-"}</span>

            <span className="text-gray-400">출판사</span>
            <span className="text-gray-700">{book_info.publisher ?? "-"}</span>

            <span className="text-gray-400">출판일</span>
            <span className="text-gray-700">2022.10.04</span>

            <span className="text-gray-400">ISBN</span>
            <span className="text-gray-700">{post.book.isbn ?? "-"}</span>
          </div>
        </div>
      </div>

      {/* 독후감 */}
      <div className="mt-4 px-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-sky-400" />
          <h2 className="min-w-0 truncate text-lg font-semibold text-gray-800">
            윤태연의 독후감
          </h2>
        </div>
      </div>
      <div className="p-4">
        게으름을 부리던 사람이 소로 변하는 장면이 재미있어서 그려 보았어요.
        아빠와 함께 책을 읽어보고 그림으로 그려보았습니다.
      </div>

      {/* 이미지 캐러셀 */}
      <div className="mb-5 p-4">
        <PostImageCarousel
          images={[
            "https://v1.padlet.pics/3/image.webp?t=c_limit%2Cdpr_2%2Ch_1334%2Cw_1000&url=https%3A%2F%2Fu1.padletusercontent.com%2Fuploads%2Fpadlet-uploads-usc1%2F5808756707%2F720fa44245b3812925eadee431835c77%2F20260614_154608.jpg%3Fexpiry_token%3D5WaHZRdGG3LkUVQGy3SZ-zdRtq89aJeottSBaF_Hii8dmxJqYDvE2-MDbblcM-ZrVekXW99RReKkJFIoMoKio6Auh2fItwDUCmjkIekqk_8sB5pAMRnce1sDH7Fb8dJe3d_JbS_U6CRzGwOWTDxdLoWVyKVRfo5ZsVD530ofH_-AFMiZj8t5X2dSIWj8uvPSp5L0W14fOJ_BkDIjyF3N1JkWTfa0oEVcP9n8ereWsHE%3D",
            "https://v1.padlet.pics/3/image.webp?t=c_limit%2Cdpr_2%2Ch_1112%2Cw_1000&url=https%3A%2F%2Fu1.padletusercontent.com%2Fuploads%2Fpadlet-uploads-usc1%2F5808756707%2F2bb7d2960449870a15e33c2eb4695e87%2F20260614_145109.jpg%3Fexpiry_token%3D5WaHZRdGG3LkUVQGy3SZ-zdRtq89aJeottSBaF_Hii8dmxJqYDvE2-MDbblcM-ZrVekXW99RReKkJFIoMoKio6Auh2fItwDUCmjkIekqk__ph38EukE5LjNogBCBnEI8VFHRc3W9eSrAJsWK23CJwJKZCO00RBnUZK12FXdQ9PXqYS8sIuWZ9TpruEZbTK4XBGHoIcl8SFnYTxJwE1WB6snJkskPNqMbXwUeYVQaK7U%3D",
          ]}
        />
      </div>

      <PostPasswordModal
        open={modalAction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setModalAction(null);
          }
        }}
        postId={post.id}
        onVerified={(password) => {
          if (modalAction === "EDIT") {
            // 수정
            alert("수정페이지 이동 / 비번: " + password);
          }

          if (modalAction === "DELETE") {
            // 삭제
            openAlertModal({
              title: "게시물을 삭제할까요?",
              description: "삭제한 게시물은 다시 복구할 수 없습니다.",
              onAction: () => {
                //대충충삭제 구현
                alert("삭제");
              },
            });
          }
        }}
      />
    </main>
  );
}
