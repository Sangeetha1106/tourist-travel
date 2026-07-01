const ContactUs = () => {
  return (
    <div className="customer-home">
      <section className="hero-banner" style={{ height: '300px', backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=2070&auto=format&fit=crop)' }}>
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>We're here to help you plan your perfect getaway.</p>
        </div>
      </section>

      <section className="home-section">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="auth-card" style={{ maxWidth: '100%', margin: '0 auto' }}>
            <h2>Get In Touch</h2>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="Your Name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Your Email" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows="5" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="btn-primary" style={{ width: '100%' }}>Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
