import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";

type Props = {
  color?: string;
  size?: number;
  speed?: number;
  stroke?: number;
};

export default function TailSpinner({
  color = "#9ca3af",
  size = 25,
  speed = 0.9,
  stroke = 3,
}: Props) {
  return <Tailspin color={color} size={size} speed={speed} stroke={stroke} />;
}
