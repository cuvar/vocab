export type MutatorProps = {
  id: string;
  text: string;
  onclick: () => void;
  active?: boolean;
};

export default function Mutator(props: MutatorProps) {
  const activeClass =
    "bg-accent text-neutral-900 border-neutral-900 border-gray-500";
  return (
    <div>
      <button
        onClick={() => props.onclick()}
        className={`rounded-lg border border-accent px-3 py-1 text-white ${
          props.active && activeClass
        }`}
      >
        {props.text}
      </button>
    </div>
  );
}
