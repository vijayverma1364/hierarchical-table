import React from "react";
import "./button.css";

const Button = ({
  bgColor = "#BEF5EC",
  borderColor = "#BEF5EC",
  color = "#053149",
  disabled = false,
  label = "",
  onClick = () => {},
  size = "small",
  width = "fit-content",
  borderRadius = "100px",
  borderWidth = "1px",
  loading = false,
  ...buttonProps
}) => {
  return (
    <div className={`button-wrapper ${buttonProps.className}`}>
      <div className="flex flex-1 items-center gap-6px justify-center h-full">
        {label && (
          <button disabled={disabled} onClick={onClick}>
            {label}
          </button>
        )}
      </div>
    </div>
  );
};

export default Button;
