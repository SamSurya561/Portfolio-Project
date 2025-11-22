import React, { useState } from 'react';

const Contact = () => {
  // Use React state to manage form inputs
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: ''
  });

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a service
    // like EmailJS, Formspree, or your own backend.
    console.log("Form data submitted:", formData);

    // Simple confirmation without using alert()
    const btn = e.target.querySelector('.btn-send');
    const originalText = btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.style.backgroundColor = '#0b7b49'; // Success color
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = ''; // Revert to original color
    }, 3000);


    // Reset form
    setFormData({
      user_name: '',
      user_email: '',
      message: ''
    });
  };

  return (
    <section className="contact reveal" id="contact">
      <h1>CONTACT</h1>
      <p><h1>Get in Touch with Me</h1></p>

      <div className="contact-content">
        <div className="contact-info">
          <p><h3>I'm always open to discuss exciting projects and new opportunities. Let's collaborate!</h3><br></br></p>

          <div className="contact-details">
            <div className="contact-item"><i className="fa-solid fa-envelope"></i><span>Sharmilasharmi2128@gmail.com</span></div>
            <div className="contact-item"><i className="fa-solid fa-phone"></i><span>+919600176371</span></div>
            <div className="contact-item"><i className="fa-solid fa-location-dot"></i><span>Chennai, Tamilnadu, India.</span></div>
          </div>

          <div className="social-links">
            <a href="https://www.linkedin.com/in/sharmila-sharmi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fa-brands fa-linkedin"></i></a>
            <a href="https://www.instagram.com/sharms__21/" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://wa.me/919600176371" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>

        <div className="contact-form">
          {/* Use the handleSubmit function for the form's onSubmit event */}
          <form id="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                required
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Your Email"
                required
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="btn-send">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;