import { useState } from "react";
import { type TagData } from "../server/domain/client/tagData";

type Props = {
  tags: TagData[];
  handler: (td: TagData[]) => void;
};

export default function TagSelect(props: Props) {
  const [TagData, setTagData] = useState<TagData[]>(props.tags);

  function handleSwitchChange(_TagData: TagData) {
    const newChecked = !_TagData.checked;

    const editIndex = TagData.findIndex((t) => t.id === _TagData.id);
    if (editIndex !== -1) {
      const updatedTagData = [...TagData]; // Create a copy of the array
      updatedTagData[editIndex]!.checked = newChecked;
      setTagData(updatedTagData); // Update the state with the new array
      props.handler(updatedTagData); // Notify the parent component with the updated data
    }
  }

  return (
    <div className="collapse bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title text-lg font-medium">Tags</div>
      <div className="collapse-content">
        {TagData.map((t) => (
          <label
            key={t.name}
            className="label mr-4 flex cursor-pointer justify-start space-x-2"
          >
            <input
              type="checkbox"
              className="checkbox"
              checked={t.checked}
              onChange={() => handleSwitchChange(t)}
            />
            <span className="label-text">{t.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
