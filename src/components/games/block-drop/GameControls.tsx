import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronsDown,
  RotateCw
} from "lucide-react";

type GameControlsProps = {
  onLeft: () => void;
  onRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
};

export function GameControls({
  onLeft,
  onRight,
  onRotate,
  onSoftDrop,
  onHardDrop
}: GameControlsProps) {
  const buttonClass =
    "liquid-button flex min-h-14 items-center justify-center rounded-xl text-white";

  return (
    <div className="mt-4 grid grid-cols-5 gap-2 lg:hidden">
      <button
        aria-label="Move left"
        className={buttonClass}
        onClick={onLeft}
        title="Move left"
        type="button"
      >
        <ArrowLeft size={22} />
      </button>
      <button
        aria-label="Move right"
        className={buttonClass}
        onClick={onRight}
        title="Move right"
        type="button"
      >
        <ArrowRight size={22} />
      </button>
      <button
        aria-label="Rotate"
        className={buttonClass}
        onClick={onRotate}
        title="Rotate"
        type="button"
      >
        <RotateCw size={22} />
      </button>
      <button
        aria-label="Soft drop"
        className={buttonClass}
        onClick={onSoftDrop}
        title="Soft drop"
        type="button"
      >
        <ArrowDown size={22} />
      </button>
      <button
        aria-label="Hard drop"
        className={buttonClass}
        onClick={onHardDrop}
        title="Hard drop"
        type="button"
      >
        <ChevronsDown size={22} />
      </button>
    </div>
  );
}
