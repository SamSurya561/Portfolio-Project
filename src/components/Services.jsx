import React from 'react';

// Removed image imports as the files were not provided
// import webIcon from '../assets/web.svg';
// import appIcon from '../assets/app.svg';
// import dmIcon from '../assets/dm.svg';
// import seoIcon from '../assets/seo.svg'; 

// Data for the service cards, now using placeholder images
const servicesData = [
  {
    imgSrc: "https://placehold.co/100x100/f0f0f0/333?text=web.svg",
    alt: "Web Development",
    title: "Web Development",
    description: "Modern responsive web apps and landing pages."
  },
  {
    imgSrc: "https://placehold.co/100x100/f0f0f0/333?text=app.svg",
    alt: "App Development",
    title: "App Development",
    description: "Cross-platform mobile and web application development."
  },
  {
    imgSrc: "https://placehold.co/100x100/f0f0f0/333?text=dm.svg",
    alt: "Digital Marketing",
    title: "Digital Marketing",
    description: "Strategy, ads, content and conversion optimization."
  },
  {
    imgSrc: "https://placehold.co/100x100/f0f0f0/333?text=seo.svg",
    alt: "Email Marketing",
    title: "Email Marketing",
    description: "Campaigns, automation and growth funnels."
  }
];

const Services = () => {
  return (
    <section className="services reveal" id="services">
      <p>SERVICES</p>
      <h1>Our Features & Services</h1>
      <hr style={{ width: '10%' }} />
      
      <div className="services-container">
        {/* Map over the data array to render each service card */}
        {servicesData.map((service, index) => (
          <div className="service-card" key={index}>
            <img src={service.imgSrc} alt={service.alt} />
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;