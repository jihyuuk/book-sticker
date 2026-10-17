import { BrowserMultiFormatReader } from "@zxing/browser";
import { ImageIcon } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

type Props = {
  onDetected: (value: string) => void;
};

const codeReader = new BrowserMultiFormatReader();

export default function BookBarcodeImagePicker({ onDetected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    try {
      const result = await codeReader.decodeFromImageUrl(imageUrl);
      const value = result.getText();

      onDetected(value);
    } catch {
      toast.error("이미지에서 바코드를 읽지 못했어요.");
    } finally {
      URL.revokeObjectURL(imageUrl);

      // 같은 사진 다시 선택 가능하게
      event.target.value = "";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-20 flex-col items-center gap-2"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-white/20">
          <ImageIcon className="size-5" />
        </span>

        <span className="text-sm font-medium text-white">사진첩</span>
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
