import { type ToastType } from "@vocab/validators/src/types";
import { checkedIcon, crossRoundIcon } from "../utils/icons";

type Props = {
  msg: string;
  mode: ToastType;
  visible?: boolean;
}
export default function Toast(props: Props) {
  const icon = props.mode == "success" ? checkedIcon : crossRoundIcon;
  const visibleClass = props.visible ? "visible" : "invisible";
  return (
    <div
      className={`alert alert-${props.mode} sticky bottom-5 flex w-5/6 ${visibleClass}`}
    >
      <span>{icon}</span>
      <span>{props.msg}</span>
    </div>
  );
}
