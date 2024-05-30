import React from 'react';
import './Piece.css';
import RedPieceImg from '../assets/red-piece.svg'; // Adjust the path according to your file structure


export const BlackPiece = () => {
  return (
    <img src={RedPieceImg} alt="Red Piece" className="checker-piece" />
  );
};