interface Props {
  children: React.ReactNode;
}
export default function Drawer(props: Props) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content w-full">{props.children}</div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
          <li>
            <a>All words</a>
          </li>
          <li>
            <a>Learn mode</a>
          </li>
          <li>
            <a>Generator</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
