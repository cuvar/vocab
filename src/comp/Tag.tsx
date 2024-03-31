type Props = {
  text: string;
  onclick: () => void;
  active?: boolean;
};

export default function Tag(props: Props) {
  const activeClass =
    "bg-secondary text-neutral-900 border-neutral-900 border-gray-500";
  return (
    <div>
      <button
        onClick={props.onclick}
        className={`rounded-lg border border-secondary px-3 py-1 text-white ${
          props.active && activeClass
        }`}
      >
        {props.text}
      </button>
    </div>
  );
}
