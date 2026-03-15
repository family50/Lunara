import React from 'react';
import './PageLoader.css'; // سننقل الـ CSS هنا

const PageLoader = () => {
  return (
    <div id="component-loader">
      <div className="loader-content">
        <div className="icon-wrapper">
          <i className="fa-solid fa-seedling loader-icon"></i>
          <div className="icon-ring"></div>
        </div>
        <h2 id="loading-text">LUNARA</h2>
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;