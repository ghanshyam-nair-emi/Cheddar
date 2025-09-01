import './HomePage.css';

import React from "react";

const HomePage = ({onStartChat,OnNewsTab}) => {
  return (
    <div className="home-page">
        <button className="about-page-btn" >Cheddar</button>
        <div className="toggle-container">
            <button className="factcheck-toggle-btn" onClick={onStartChat}>
                <i className="fa-solid fa-earth"></i>
            </button>
            <button className="news-toggle-btn" onClick={OnNewsTab}>
                <i className="fa-solid fa-water"></i>
            </button>
        </div>
    </div>
  );
}

export default HomePage;