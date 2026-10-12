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
    <section className="fixed inset-x-0 bottom-0 z-50">
      <div className="px-page-x mx-auto w-full max-w-2xl border-t bg-white pt-2 pb-4">
        <Button
          size="lg"
          onClick={onClick}
          disabled={disabled}
          className="w-full"
        >
          {children}
        </Button>
      </div>
    </section>
  );
}
