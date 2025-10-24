import { useState } from "react";

interface DropdownProps {
  valueBtn: string;
  listItems: string[];
  onChange: (value: string) => void;
}
export default function Dropdown({
  valueBtn,
  listItems,
  onChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  return (
    <div className={"dropdown" + (isOpen ? " open" : "")}>
      <button className="dropdown-button" onClick={toggleDropdown}>
        {valueBtn}
      </button>
      <ul className="dropdown-list">
        {listItems.map((item, index) => (
          <li key={index} onClick={() => onChange(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
