import { footerPc, footerTablet } from "@/lib/chart-images";

export default function FooterImage() {
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={footerPc} />

      <img src={footerTablet} className="absolute bottom-0 w-full" />
    </picture>
  );
}
