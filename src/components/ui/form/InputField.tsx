import { forwardRef } from "react";
import { FieldError } from "./Form";

interface InputProps {
  label: string;
  type?: string;
  name: string;
}

const InputField = forwardRef<HTMLInputElement, InputProps>(function InputField(
  { label, type = "text", ...props },
  ref
) {
  return (
    <div className="p-1">
      <label className="block pl-2 mb-2 text-sm font-medium">{label}</label>
      <input
        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
        type={type}
        {...props}
        ref={ref}
      />
      <FieldError name={props.name} />
    </div>
  );
});

export default InputField;
