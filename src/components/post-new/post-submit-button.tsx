import { Button } from "../ui/button";

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export default function PostSubmitButton({ onClick, disabled }: Props) {
  return (
    <section className="px-4 pt-5 pb-2">
      <Button
        onClick={onClick}
        disabled={disabled}
        className="h-12 w-full bg-sky-500 text-base hover:bg-sky-600"
      >
        {disabled ? "작성 중..." : "작성하기"}
      </Button>
    </section>
  );
}
