export type FilterState = "learned" | "archived" | null;

export type FilterProps = {
  state: FilterState;
  text: string;
};

type Props = FilterProps & {
  onclick: (key: FilterState) => void;
  active?: boolean;
};

export default function Filter(props: Props) {
  const activeClass =
    "bg-secondary text-neutral-900 border-neutral-900 border-gray-500";
  return (
    <div>
      <button
        onClick={() => props.onclick(props.state)}
        className={`rounded-lg border border-secondary px-3 py-1 text-white ${
          props.active && activeClass
        }`}
      >
        {props.text}
      </button>
    </div>
  );
}
