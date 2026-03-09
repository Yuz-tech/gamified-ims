import React from 'react';

const Icon = ({ name, size = 24, style = {} }) => {
  return (
    <span 
      className="material-symbols-outlined"
      style={{
        fontSize: `${size}px`,
        verticalAlign: 'middle',
        userSelect: 'none',
        ...style
      }}
    >
      {name}
    </span>
  );
};

export default Icon;