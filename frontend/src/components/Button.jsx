import "../styles/button.css";

function Button({
    children,
    type = "button",
    variant = "primary",
    className = "",
    disabled = false,
    onClick,
}) {
    return (
        <button
            type={type}
            className={`btn btn-${variant} ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;