import { Button } from "../ui/button";

type Props = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export default function PostSubmitButton({
  onClick,
  disabled,
  children,
}: Props) {
  return (
    <section className="px-4 pt-5 pb-2">
      <Button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="h-12 w-full bg-sky-500 text-base hover:bg-sky-600"
      >
        {children}
      </Button>
    </section>
  );
}
