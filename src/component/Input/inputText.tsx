import React, { useState, ChangeEvent } from "react";

interface InputTextProps {
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
}

const InputText: React.FC<InputTextProps> = ({
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
    <div className="form-group">
      <label className="label">
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
        </span>
      </label>
      <input
        id={labelTitle}
        type={type || "text"}
        value={value || ""}
        readOnly={readonly || false}
        placeholder={placeholder || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          updateInputValue(e.target.value)
        }
        className="form-control form-control-lg"
      />
      {errorMessage && errorMessage.includes(value!) ? (
        <label className="label">
          <span className="invalid-feedback">{errorMessage}</span>
        </label>
      ) : null}
    </div>
  );
};

export default InputText;
