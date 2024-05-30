import React from 'react';
import './Checkerboard.css';

const Checkerboard = () => {
  const rows = 8;
  const columns = 8;
  const squares = Array(rows * columns).fill(null);

  return (
    <div className="checkerboard">
      {squares.map((_, index) => (
        <div
          key={index}
          className={`square ${((Math.floor(index / columns) + index) % 2 === 0) ? 'light' : 'dark'}`}
        ></div>
      ))}
    </div>
  );
};

export default Checkerboard;