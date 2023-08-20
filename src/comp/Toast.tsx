import { checkedIcon, crossIcon, infoIcon } from "../utils/icons";

interface Props {
  msg: string;
  mode: ToastType;
  visible?: boolean;
}
export default function Toast(props: Props) {
  const icon = props.mode == "success" ? checkedIcon : crossIcon;
  const visibleClass = props.visible ? "visible" : "invisible";
  return (
    <div
      className={`alert alert-${props.mode} sticky bottom-5 flex w-full ${visibleClass}`}
    >
      <span>{icon}</span>
      <span>{props.msg}</span>
    </div>
  );
}
