const Input = ({ label, type = 'text', value, onChange, error, placeholder, required = false, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-bold text-retro-black mb-2 uppercase tracking-wider" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${error ? 'border-red-600 border-2' : ''}`}
        style={{ fontFamily: 'Courier New, Courier, monospace' }}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 font-bold" style={{ fontFamily: 'Courier New, Courier, monospace' }}>{error}</p>}
    </div>
  );
};

export default Input;

