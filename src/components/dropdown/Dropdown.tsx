import { useEffect, useRef } from "react";

interface DropdownProps {
  valueBtn: string;
  listItems: string[];
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}
export default function Dropdown({
  valueBtn,
  listItems,
  onChange,
  isOpen,
  onToggle,
  onClose,
}: DropdownProps) {
  const handleItemClick = (item: string) => {
    onChange(item); // Call the parent's function
    onClose();
  };
  const dropdownRef = useRef<HTMLDivElement>(null); // Added for click-outside

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, dropdownRef]);
  // ---------------------------------------------------------------
  return (
    <div className={"dropdown" + (isOpen ? " open" : "")}>
      <button className="dropdown-button" onClick={onToggle}>
        {valueBtn}
      </button>
      <ul className="dropdown-list">
        {listItems.map((item, index) => (
          <li key={index} onClick={() => handleItemClick(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
