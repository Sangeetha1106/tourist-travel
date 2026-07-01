const AboutUs = () => {
  return (
    <div className="customer-home">
      <section className="hero-banner" style={{ height: '300px', backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop)' }}>
        <div className="hero-content">
          <h1>About GT Holidays</h1>
          <p>Your trusted partner in creating unforgettable memories.</p>
        </div>
      </section>

      <section className="home-section">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title">Our Story</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
            Founded with a passion for exploration, GT Holidays has been curating premium travel experiences for over a decade. We believe that travel is not just about visiting new places; it's about immersing yourself in new cultures, finding adventure, and creating lifelong memories.
          </p>
          <br/>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
            Whether you are looking for a luxurious island retreat, an action-packed mountain trek, or a deep dive into historical European cities, our expert team is here to handle every detail so you can focus on the journey.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
