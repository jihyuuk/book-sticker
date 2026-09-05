import { useEffect, useRef, useState } from "react";

//동적으로 변하는 차트의 높이를 감지하는 커스텀 훅
export function useChartHeight() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(0);

  useEffect(() => {
    const element = chartRef.current;

    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setChartHeight(entry.contentRect.height);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { chartRef, chartHeight };
}
