import TailSpinner from "./pull-to-refresh/tail-spinner";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <TailSpinner />
    </div>
  );
}
