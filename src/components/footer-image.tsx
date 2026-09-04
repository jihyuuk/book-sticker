import footerTablet from "@/assets/footer-tablet.webp";
import footerPc from "@/assets/footer-pc.webp";

export default function FooterImage() {
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={footerPc} />

      <img src={footerTablet} className="absolute bottom-0 w-full" />
    </picture>
  );
}
