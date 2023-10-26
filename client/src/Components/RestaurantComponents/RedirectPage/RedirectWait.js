// WaitingPage.js

import React, { useEffect, useState } from 'react';
import './RedirectWait.css';

const RedirectWait = () => {
  // Simulate waiting for admin approval with a state
  const [waitingForApproval, setWaitingForApproval] = useState(true);

  // Simulated data for food delivery apps' success, stories, and achievements
  const successData = [
    { title: 'Exclusive Restaurant Partner', description: 'Join us as an exclusive partner and expand your reach.' },
    { title: 'Collaborative Culinary Partner', description: 'Collaborate with us to bring your culinary creations to more customers.' },
    { title: 'Growth-Oriented Partner', description: 'Partner with us to grow your restaurant business and reach new heights.' },
    { title: 'Innovative Kitchen Partner', description: 'Innovate with us and showcase your unique dishes to a wider audience.' },
  ]; 
  
  const achievementsData = [
    { year: 2023, achievement: 'Reached 1 million orders' },
    { year: 2022, achievement: 'Opened 100 new restaurants' },
    
  ]; 

  useEffect(() => {
    // Simulate the waiting process for admin approval
    setTimeout(() => {
      setWaitingForApproval(false);
    }, 3000); // Change the time as needed
  }, []);

  return (
    
    <div className="waiting-page">
        
      {waitingForApproval ? (
        <div className="loading-container">
          <h2><strong>Submitting your Request</strong></h2>
          <p>Please wait while your request is being processed...</p>
        </div>
      ) : (
        <div className="content-container">
          <h2>Please Wait for our Admins to approve your Request</h2>
          <div className="success-stories">
            {successData.map((story, index) => (
              <div key={index} className="card">
                <div className="card-title">

                <h3><strong>{story.title}</strong></h3>
                </div>
                <p>{story.description}</p>
              </div>
            ))}
          </div>
          <h2>Latest Achievements</h2>
          <ul className="achievements-list">
            {achievementsData.map((achievement, index) => (
              <li key={index}>{`${achievement.year}: ${achievement.achievement}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>

  );
};

export default RedirectWait ;
