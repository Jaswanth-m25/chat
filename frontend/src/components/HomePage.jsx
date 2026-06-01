import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/chat');
    }
  }, [isSignedIn, navigate]);

  const features = [
    {
      icon: '💬',
      title: 'Real-Time Messaging',
      description: 'Send and receive messages instantly with real-time updates'
    },
    {
      icon: '👥',
      title: 'Connect with Friends',
      description: 'Build your community and stay connected with people who matter'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your conversations are encrypted and your privacy is protected'
    },
    {
      icon: '📱',
      title: 'Smooth Experience',
      description: 'Optimized for all devices with a clean and intuitive interface'
    }
  ];

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="home-navbar">
        <div className="navbar-content">
          <div className="logo">
            <span className="logo-icon">💬</span>
            <span className="logo-text">ChatHub</span>
          </div>
          <button 
            className="nav-cta-btn"
            onClick={() => navigate('/LoginSignup')}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Connect, Share, and <span className="highlight">Communicate</span>
          </h1>
          <p className="hero-subtitle">
            Experience seamless real-time messaging with friends and communities. Stay connected anytime, anywhere.
          </p>
          <div className="hero-buttons">
            <button 
              className="cta-btn primary-btn"
              onClick={() => navigate('/LoginSignup')}
            >
              Get Started Now
            </button>
            <button className="cta-btn secondary-btn">
              Learn More
            </button>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="hero-background">
          <div className="gradient-blob blob-1"></div>
          <div className="gradient-blob blob-2"></div>
          <div className="gradient-blob blob-3"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="section-title">Why Choose ChatHub?</h2>
          <p className="section-subtitle">Powerful features designed for modern communication</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1M+</div>
            <div className="stat-label">Messages Daily</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Chatting?</h2>
          <p className="cta-description">Join thousands of users and start connecting with your network today</p>
          <button 
            className="cta-btn primary-btn large"
            onClick={() => navigate('/LoginSignup')}
          >
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>ChatHub</h4>
            <p>Connecting people through real-time messaging</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Real-Time Chat</li>
              <li>User Profiles</li>
              <li>Message History</li>
              <li>Mobile Friendly</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 ChatHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
