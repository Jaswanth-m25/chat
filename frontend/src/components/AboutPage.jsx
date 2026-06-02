import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiShield, FiHeart, FiSmile, FiArrowLeft, FiCoffee } from 'react-icons/fi';
import './About.css';

export const AboutPage = ({ onBackToChat }) => {
  const navigate = useNavigate();
  return (
    <div className="about-container">
      {/* Top Navigation / Header area */}
      <header className="about-header">
        <button className="back-btn" onClick={onBackToChat} title="Back to Chats">
          <FiArrowLeft /> <span onClick={() => navigate('/')}>Back to Chat</span>
        </button>
        <div className="about-logo">ChatFlow</div>
      </header>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <span className="hero-badge">
            <FiCoffee style={{ marginRight: '6px' }} /> Communication, Reimagined
          </span>
          <h1>Connecting People, Naturally.</h1>
          <p>
            In a world full of noisy notifications and crowded digital spaces, we’ve built a room that brings back the simple warmth of a real conversation—like sharing a quiet coffee with a friend at your favorite local spot.
          </p>
        </div>
      </section>

      {/* Core Values / Features Grid */}
      <section className="about-grid">
        <div className="value-card">
          <div className="card-icon">
            <FiSmile />
          </div>
          <h3>Human-Centric Design</h3>
          <p>
            We prioritize clean, clutter-free interfaces. No sensory overload—just a beautifully balanced layout that lets you focus entirely on the person behind the text.
          </p>
        </div>

        <div className="value-card">
          <div className="card-icon">
            <FiHeart />
          </div>
          <h3>Calm & Grounded Vibe</h3>
          <p>
            Embracing deep dark blues and soothing organic elements, our ecosystem is tailored to reduce digital fatigue and make your daily messaging feel peaceful.
          </p>
        </div>

        <div className="value-card">
          <div className="card-icon">
            <FiMessageSquare />
          </div>
          <h3>Effortless Rhythm</h3>
          <p>
            Our smart instant delivery pipelines copy the seamless pace and organic movement of everyday, real-world spoken interactions.
          </p>
        </div>

        <div className="value-card">
          <div className="card-icon">
            <FiShield />
          </div>
          <h3>Privacy You Can Trust</h3>
          <p>
            Your words belong strictly to you. With industry-grade secure routing layers protecting every chat node, you can speak freely and without worry.
          </p>
        </div>
      </section>

      {/* Philosophy Callout Quote */}
      <section className="about-quote-section">
        <blockquote className="about-blockquote">
          <p>
            "We don't just engineer technology to keep mobile devices busy. We craft deliberate pipelines to keep individuals genuinely and deeply connected."
          </p>
          <cite>— The ChatFlow Philosophy</cite>
        </blockquote>
      </section>

      {/* Footer / CTA Section */}
      <footer className="about-footer">
        <p>Ready to experience chatting the way it was meant to be?</p>
        <button className="cta-btn" onClick={() => navigate('/LoginSignup')}>
          Start Texting Now
        </button>
      </footer>
    </div>
  );
};
export default AboutPage;