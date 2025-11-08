import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = "large",
  color = "#17cf17",
}) => {
  const sizeMap = {
    small: "1rem",
    medium: "1.5rem",
    large: "2rem",
  };

  return (
    <div className="loader">
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        style={{
          fontSize: sizeMap[size],
          color: color,
        }}
      />
    </div>
  );
};

export default Loader;
