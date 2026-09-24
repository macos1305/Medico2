import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search by doctor name, specialty, or clinic...' }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Search
        size={20}
        color="var(--slate-400)"
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          paddingLeft: '3rem',
          paddingRight: value ? '2.5rem' : '1rem',
          height: '50px',
          fontSize: '1rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-sm)',
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            color: 'var(--slate-400)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
          }}
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
