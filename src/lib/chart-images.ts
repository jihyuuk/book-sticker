// chart-images.ts
import redBook from "@/assets/book/red-book.webp";
import yellowBook from "@/assets/book/yellow-book.webp";
import greenBook from "@/assets/book/green-book.webp";
import blueBook from "@/assets/book/blue-book.webp";

import footerTablet from "@/assets/footer/footer-tablet.webp";
import footerPc from "@/assets/footer/footer-pc.webp";

import star from "@/assets/star.webp";

export const bookImages = [redBook, yellowBook, greenBook, blueBook];

export { footerTablet, footerPc, star };

export const preloadImages = [
  footerTablet,
  footerPc,
  star,
  // ...bookImages,
];
