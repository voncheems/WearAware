import React, { useEffect, useState } from 'react';
import './ContactPage.css';

function ContactPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: '📍',
      label: 'Our Office',
      value: 'San Fernando, La Union, Philippines',
      sub: 'Visit us anytime during business hours',
    },
    {
      icon: '📧',
      label: 'Email Us',
      value: 'hello@wearaware.ph',
      sub: 'We respond within 24 hours',
    },
    {
      icon: '📞',
      label: 'Call Us',
      value: '+63 912 345 6789',
      sub: 'Mon–Fri, 8:00 AM – 5:00 PM PHT',
    },
    {
      icon: '⏰',
      label: 'Support Hours',
      value: '24/7 System Monitoring',
      sub: 'Technical support always available',
    },
  ];

  return (
    <div className="contact-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo" onClick={() => setCurrentPage('landing')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">🦺</div>
          <span>WearAware</span>
        </div>

      <ul className="nav-links">
          <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }}>ABOUT US</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('projects'); }}>OUR PROJECTS</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('expertise'); }}>EXPERTISE</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('contact'); }}>GET IN TOUCH</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="cp-hero">
        <div className="cp-hero-overlay" />
        <div className="cp-hero-content">
          <div className="hero-subtitle">WE'D LOVE TO HEAR FROM YOU</div>
          <h1 className="hero-title">GET IN<br />TOUCH</h1>
          <p className="hero-description">
            Whether you're ready to deploy WearAware at your facility or just want to learn more,
            our team is here to help. Reach out and let's talk safety.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="cp-info-section fade-in">
        <div className="section-header">
          <div className="section-subtitle">REACH US</div>
          <h2 className="section-title">How to Contact Us</h2>
          <p className="section-description">
            Multiple ways to get in touch — choose whatever works best for you.
          </p>
        </div>
        <div className="cp-info-grid">
          {contactInfo.map((item, i) => (
            <div className="cp-info-card" key={i}>
              <div className="cp-info-icon">{item.icon}</div>
              <div className="cp-info-label">{item.label}</div>
              <div className="cp-info-value">{item.value}</div>
              <div className="cp-info-sub">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="cp-form-section fade-in">
        <div className="cp-form-wrapper">

          {/* Left — Form */}
          <div className="cp-form-left">
            <div className="section-subtitle">SEND A MESSAGE</div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
              Let's Start a Conversation
            </h2>
            <p className="section-description" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
              Fill out the form and our team will get back to you within one business day.
            </p>

            {submitted ? (
              <div className="cp-success">
                <div className="cp-success-icon">✅</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
                  Send Another
                </button>
              </div>
            ) : (
              <form className="cp-form" onSubmit={handleSubmit}>
                <div className="cp-form-row">
                  <div className="cp-field">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Juan dela Cruz"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="cp-field">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="juan@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="cp-form-row">
                  <div className="cp-field">
                    <label htmlFor="company">Company / Organization</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="ABC Construction Corp."
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="cp-field">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select a topic</option>
                      <option value="demo">Request a Demo</option>
                      <option value="pricing">Pricing Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="cp-field">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="Tell us about your facility, your safety challenges, or anything else you'd like to discuss..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary cp-submit-btn">
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* Right — Side panel */}
          <div className="cp-form-right">
            <div className="cp-side-card">
              <div className="cp-side-title">Why Teams Choose WearAware</div>
              <ul className="cp-side-list">
                {[
                  '99.7% detection accuracy',
                  'Under 2-second response time',
                  'No hardware replacement needed',
                  'OSHA & ISO 45001 aligned',
                  'Scales from 1 to 100+ sites',
                  'Dedicated onboarding support',
                ].map((item, i) => (
                  <li key={i} className="cp-side-item">
                    <span className="cp-side-dot" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="cp-side-card cp-side-card--dark">
              <div className="cp-side-title" style={{ color: '#fff' }}>Request a Free Demo</div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                See WearAware in action with a live walkthrough tailored to your industry and site size.
              </p>
              <button className="btn btn-primary" onClick={() => setCurrentPage('login')}>
                Book a Demo
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="stats fade-in">
        <div className="stats-grid">
          <StatCard number="99.7%" label="Detection Accuracy" />
          <StatCard number="24/7" label="Monitoring Available" />
          <StatCard number="<2s" label="Processing Time" />
          <StatCard number="100+" label="Sites Protected" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <div className="footer-brand">🦺 WearAware</div>
            <p className="footer-description">
              Advanced AI-powered PPE detection system for modern workplace safety management.
              Built by safety professionals, for safety professionals.
            </p>
          </div>
          <div>
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }}>About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Solutions</h4>
            <ul className="footer-links">
              <li><a href="#">Construction</a></li>
              <li><a href="#">Manufacturing</a></li>
              <li><a href="#">Warehousing</a></li>
              <li><a href="#">Enterprise</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 WearAware. All rights reserved. | Built by Group 4 - BSIT2-07
        </div>
      </footer>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="stat">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default ContactPage;
