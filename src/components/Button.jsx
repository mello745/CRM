const Button = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', className = '', ...props }) => {
  const baseClasses = 'font-bold py-2 px-4 border-2 border-retro-black transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  const baseStyle = { fontFamily: 'Courier New, Courier, monospace', letterSpacing: '0.5px' };
  
  const variants = {
    primary: 'bg-retro-darkBlue hover:bg-retro-navy text-retro-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]',
    secondary: 'bg-retro-gray-200 hover:bg-retro-gray-300 text-retro-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]',
    danger: 'bg-red-600 hover:bg-red-700 text-retro-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]',
    success: 'bg-green-600 hover:bg-green-700 text-retro-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={baseStyle}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

