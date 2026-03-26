
const Button = ({ children, type = 'button', className = '', ...props }) => {
    const baseStyles = 'font-semibold rounded-xl shadow';
    const combinedClassName = `${baseStyles} ${className}`;

    return (
        <button
            type={type}
            className={combinedClassName}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button