import footerTablet from "@/assets/footer-tablet.png";
import footerPc from "@/assets/footer-pc.png";

export default function FooterImage() {
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={footerPc} />

      <img src={footerTablet} className="w-full" />
    </picture>
  );
}
