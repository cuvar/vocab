import { useRef } from "react";

type Props = {
  max: number;
  current: number;
};
export default function ProgressBar(props: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const progress = (props.current / props.max) * 100;

  if (barRef.current) {
    barRef.current.style.width = `${progress}%`;
  }

  return (
    <div className="flex w-full flex-col items-center space-y-2">
      <div className="relative h-2 w-full">
        <div className="absolute h-full w-full rounded-full bg-white"></div>
        <div
          ref={barRef}
          className={`absolute left-0 h-full rounded-full bg-primary`}
        ></div>
      </div>
      <div className="w-full text-center">
        {props.current} / {props.max}
      </div>
    </div>
  );
}
