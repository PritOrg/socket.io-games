import React from 'react';

const TextInput = ({ label, value, onChange, placeholder, className = '', id = 'text-input' }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-gray-700 ml-1 paper-font">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-2 rounded-lg bg-white/50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all glass"
      />
    </div>
  );
};

export default TextInput;
