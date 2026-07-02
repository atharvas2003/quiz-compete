import "../styles/input.css";

function Input({
    type = "text",
    placeholder,
    value,
    onChange,
    name,
    id,
    autoComplete,
    disabled = false,
    className = "",
}) {
    return (
        <input
            type={type}
            name={name}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            disabled={disabled}
            className={`input ${className}`}
        />
    );
}

export default Input;