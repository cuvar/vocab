import { useState } from "react";
import Filter, { type FilterProps, type FilterState } from "./Filter";

type Props = {
  filter: FilterProps[];
  onChange: (text: FilterState) => void;
};

export default function FilterBar(props: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterState>(null);

  function handleFilterClick(newState: FilterState) {
    console.log("newState", newState);
    if (
      (newState === "learned" || newState === "archived") &&
      newState !== activeFilter
    ) {
      props.onChange(newState);
      setActiveFilter(newState);
      return;
    }

    setActiveFilter(null);
    props.onChange(null);
  }

  return (
    <div className="flex space-x-4 overflow-y-scroll">
      {props.filter.map((filter) => (
        <Filter
          key={filter.state}
          state={filter.state}
          text={filter.text}
          onclick={handleFilterClick}
          active={activeFilter === filter.text.toLowerCase()}
        />
      ))}
    </div>
  );
}
