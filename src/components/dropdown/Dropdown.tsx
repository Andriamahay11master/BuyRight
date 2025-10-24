interface DropdownProps {
  valueBtn: string;
  listItems: string[];
}
export default function Dropdown({ valueBtn, listItems }: DropdownProps) {
  return (
    <div className="dropdown">
      <button className="dropdown-button">{valueBtn}</button>
      <ul className="dropdown-list">
        {listItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
