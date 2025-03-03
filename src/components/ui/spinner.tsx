import React from 'react';

const Spinner = () => {
  return (
    <div className="spinner">
      <div className="spinner-circle"></div>
      <style jsx>{`
        .spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        }
        .spinner-circle {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner; 