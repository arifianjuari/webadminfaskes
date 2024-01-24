import React, { useState, ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import ItemValueData from "../../interface/item_value";

interface InputSelectProps {
  labelTitle: string;
  labelStyle?: string;
  type?: string;
  containerStyle?: string;
  defaultValue?: string;
  placeholder?: string;
  readonly?: boolean;
  errorMessage?: string;
  updateFormValue: (arg: { updateType: string; value: string }) => void;
  updateType: string;
  options?: ItemValueData[];
}

const InputSelect: React.FC<InputSelectProps> = ({
  labelTitle,
  labelStyle,
  type,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
  readonly,
  errorMessage,
  options = [],
}) => {
  const [value, setValue] = useState<string | undefined>(defaultValue);

  const updateInputValue = (val: string) => {
    setValue(val);
    updateFormValue({
      updateType,
      value: val,
    });
  };

  return (
    <Form.Group className={`mb-3 ${containerStyle}`}>
      <Form.Label
        className={`text-base-content text-xs font-bold ${labelStyle}`}
      >
        {labelTitle}
      </Form.Label>
      <Form.Control
        id={labelTitle}
        type={type || "text"}
        as="select"
        value={value || ""}
        className="text-base-content form-select-md"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateInputValue(e.target.value)
        }
        style={{ width: "210px" }}
      >
        <option value="" disabled>
          {placeholder || "Silahkan Pilih"}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            selected={value === option.value}
          >
            {option.label}
          </option>
        ))}
      </Form.Control>
      {errorMessage && errorMessage.includes(value!) ? (
        <Form.Text className="invalid-feedback">{errorMessage}</Form.Text>
      ) : null}
    </Form.Group>
  );
};

export default InputSelect;
