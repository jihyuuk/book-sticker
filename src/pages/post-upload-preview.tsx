import PostUploadModal, {
  type UploadingFile,
} from "@/components/modal/post-upload-modal";
import { useState } from "react";

type Phase = "PREPARING" | "MEDIA" | "SAVING" | "COMPLETED";
type Mode = "CREATE" | "UPDATE";

const MAX_MEDIA = 5;

const sampleProgress = [100, 75, 40, 15, 0, 0];

const buttonClass = (active: boolean) =>
  `rounded-lg border px-4 py-2 text-sm transition-colors ${
    active
      ? "bg-primary text-primary-foreground"
      : "bg-background hover:bg-muted"
  }`;

export default function PostUploadPreview() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("MEDIA");
  const [failed, setFailed] = useState(false);

  // 테스트 옵션
  const [mode, setMode] = useState<Mode>("CREATE");
  const [hasCover, setHasCover] = useState(true);
  const [imageCount, setImageCount] = useState(2);
  const [videoCount, setVideoCount] = useState(1);

  // 수정 시에는 책 표지 업로드 없음
  const includeCover = mode === "CREATE" && hasCover;

  // 첨부 목록 생성
  const files: UploadingFile[] = [];

  if (includeCover) {
    files.push({
      id: "book-cover",
      label: `${files.length + 1}. 책 표지`,
    });
  }

  for (let i = 0; i < imageCount; i++) {
    files.push({
      id: `image-${i}`,
      label: `${files.length + 1}. 사진`,
    });
  }

  for (let i = 0; i < videoCount; i++) {
    files.push({
      id: `video-${i}`,
      label: `${files.length + 1}. 동영상`,
    });
  }

  // 파일별 가짜 진행률
  const progress: Record<string, number> = Object.fromEntries(
    files.map((file, index) => [file.id, sampleProgress[index] ?? 0]),
  );

  const showModal = (nextPhase: Phase, isFailed = false) => {
    setPhase(nextPhase);
    setFailed(isFailed);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 p-5">
      {/* 생성 / 수정 선택 */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">게시글 작업</p>

        <div className="flex gap-2">
          <button
            type="button"
            className={buttonClass(mode === "CREATE")}
            onClick={() => setMode("CREATE")}
          >
            생성
          </button>

          <button
            type="button"
            className={buttonClass(mode === "UPDATE")}
            onClick={() => setMode("UPDATE")}
          >
            수정
          </button>
        </div>
      </div>

      {/* 첨부파일 설정 */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">첨부파일 설정</p>

        <div className="grid grid-cols-2 gap-3">
          {/* 책 표지 */}
          <div className="col-span-2 space-y-2">
            <p className="text-sm">책 표지</p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={mode === "UPDATE"}
                className={buttonClass(includeCover)}
                onClick={() => setHasCover(true)}
              >
                있음
              </button>

              <button
                type="button"
                disabled={mode === "UPDATE"}
                className={buttonClass(!includeCover)}
                onClick={() => setHasCover(false)}
              >
                없음
              </button>
            </div>

            {mode === "UPDATE" && (
              <p className="text-muted-foreground text-xs">
                게시글 수정에서는 책 표지를 업로드하지 않습니다.
              </p>
            )}
          </div>

          {/* 사진 개수 */}
          <div className="space-y-2">
            <p className="text-sm">사진 개수</p>

            <select
              value={imageCount}
              onChange={(e) => setImageCount(Number(e.target.value))}
              className="bg-background w-full rounded-lg border px-3 py-2 text-sm"
            >
              {Array.from(
                { length: MAX_MEDIA - videoCount + 1 },
                (_, i) => i,
              ).map((count) => (
                <option key={count} value={count}>
                  {count}개
                </option>
              ))}
            </select>
          </div>

          {/* 동영상 개수 */}
          <div className="space-y-2">
            <p className="text-sm">동영상 개수</p>

            <select
              value={videoCount}
              onChange={(e) => setVideoCount(Number(e.target.value))}
              className="bg-background w-full rounded-lg border px-3 py-2 text-sm"
            >
              {Array.from(
                { length: MAX_MEDIA - imageCount + 1 },
                (_, i) => i,
              ).map((count) => (
                <option key={count} value={count}>
                  {count}개
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-muted-foreground text-xs">
          사진 + 동영상 {imageCount + videoCount}/{MAX_MEDIA}개 (책 표지 별도)
        </p>
      </div>

      {/* 업로드 단계 선택 */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">테스트 단계</p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={buttonClass(false)}
            onClick={() => showModal("PREPARING")}
          >
            준비 중
          </button>

          <button
            type="button"
            className={buttonClass(false)}
            onClick={() => showModal("MEDIA")}
          >
            업로드 중
          </button>

          <button
            type="button"
            className={buttonClass(false)}
            onClick={() => showModal("SAVING")}
          >
            저장 중
          </button>

          <button
            type="button"
            className={buttonClass(false)}
            onClick={() => showModal("COMPLETED")}
          >
            완료
          </button>

          <button
            type="button"
            className={buttonClass(false)}
            onClick={() => showModal("MEDIA", true)}
          >
            업로드 실패
          </button>

          <button
            type="button"
            className={buttonClass(false)}
            onClick={() => showModal("SAVING", true)}
          >
            저장 실패
          </button>
        </div>
      </div>

      {/* 현재 설정 */}
      <div className="bg-muted rounded-lg p-3 text-sm">
        <p>작업: {mode === "CREATE" ? "생성" : "수정"}</p>
        <p>책 표지: {includeCover ? "있음" : "없음"}</p>
        <p>사진: {imageCount}개</p>
        <p>동영상: {videoCount}개</p>
        <p className="mt-1 font-semibold">총 업로드 파일: {files.length}개</p>
      </div>

      {/* 실제 업로드 모달 */}
      <PostUploadModal
        open={open}
        phase={phase}
        files={files}
        progress={progress}
        failed={failed}
        mode={mode}
        onDismissError={closeModal}
      />
    </div>
  );
}
