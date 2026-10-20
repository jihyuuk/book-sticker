import { ImageIcon } from "lucide-react";
import { useRef } from "react";

type Props = {
  onImageSelect: (file: File) => void;
};

export default function BookBarcodeImagePicker({ onImageSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onImageSelect(file);

    // 같은 사진 다시 선택 가능
    event.target.value = "";
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="갤러리에서 이미지 선택"
        className="flex size-12 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm"
      >
        <ImageIcon className="size-5" />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
