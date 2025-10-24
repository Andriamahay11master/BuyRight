import { useEffect, useRef, useState } from "react";

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

  const handleItemClick = (item: string) => {
    onChange(item); // Call the parent's function
    setIsOpen(false); // **This is the fix: close the dropdown**
  };
  const dropdownRef = useRef<HTMLDivElement>(null); // Added for click-outside

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  // ---------------------------------------------------------------
  return (
    <div className={"dropdown" + (isOpen ? " open" : "")}>
      <button className="dropdown-button" onClick={toggleDropdown}>
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
