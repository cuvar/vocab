import { useState } from "react";
import { type FECollection } from "~/server/domain/client/feCollection";

type Props = {
  collections: FECollection[];
  handler: (_collectionData: FECollection) => void;
  preselected?: FECollection;
};

export default function CollectionSelect(props: Props) {
  const [selectedCollection, setSelectedCollection] = useState<FECollection>(
    props.preselected ?? props.collections[0]!
  );

  function handleSwitchChange(_collectionData: FECollection) {
    if (selectedCollection.id === _collectionData.id) {
      props.handler(_collectionData);
      return;
    }
    setSelectedCollection(_collectionData);
    props.handler(_collectionData);
  }

  return (
    <div className="collapse bg-base-200">
      <input type="checkbox" />
      <div className="collapse-title text-lg font-medium">Collections</div>
      <div className="collapse-content">
        {props.collections.map((c) => (
          <label
            key={c.name}
            className="label mr-4 flex cursor-pointer justify-start space-x-2"
          >
            <input
              type="checkbox"
              className="checkbox"
              checked={selectedCollection.id === c.id}
              onChange={() => handleSwitchChange(c)}
            />
            <span className="label-text">{c.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
