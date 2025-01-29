import React from 'react';

export function ImageModal({ src, alt, onClose }) {
  const handleClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClick}>
      <div className="modal-content image-modal">
        <img src={src} alt={alt} />
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}
