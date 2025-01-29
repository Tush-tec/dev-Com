import React, { forwardRef } from "react";

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      {...props}
      aria-label={props["aria-label"] || props.placeholder || "input field"}
      className={`block w-full rounded-xl outline outline-[1px] outline-zinc-400 border-0 py-4 px-5 bg-secondary text-dark-800 font-light placeholder:text-dark-100 ${className ?? ""}`}
    />
  );
});

export default Input;
