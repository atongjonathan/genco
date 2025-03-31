import { Icon } from "@nordhealth/react";
import { CoreHeader, Header, RowData } from "@tanstack/react-table";

const sortIconMap = {
  default: "interface-sort-small",
  asc: "interface-sort-up-small",
  desc: "interface-sort-down-small",
} 
interface SortButtonProp {
    header: Header<any, unknown>
}
export default function SortButton({
  header,
}:SortButtonProp) {
  return (
    <button title="Press to sort" type="button" className="sort-btn">
      <Icon
        size="xs"
        color="currentColor"
        name={sortIconMap[header.column.getIsSorted() || "default"]}
        label="Press to sort"
      ></Icon>
    </button>
  );
}
