type Props = {
  msg: string;
};

export default function Error(props: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-12 px-4">
      <div className="">{props.msg}</div>
    </div>
  );
}
