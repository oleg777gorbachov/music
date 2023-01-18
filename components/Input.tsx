import { ChangeEvent, HTMLInputTypeAttribute } from "react";

type InputI = {
  text: string;
  type: HTMLInputTypeAttribute;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

function Input({ text, type, onChange, value }: InputI) {
  return (
    <input type={type} placeholder={text} onChange={onChange} value={value} />
  );
}

export default Input;
