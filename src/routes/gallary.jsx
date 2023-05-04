import React from 'react';
import "../Gallery.css";




function Gallery() {

  const images = [
    { id: 1, src: "/static/media/images/rice.jpg", alt: "Image 1" },
    { id: 2, src: "/static/media/images/rice (2).jpg", alt: "Image 2" },
    { id: 3, src: "/static/media/images/rice (3).jpg", alt: "Image 3" },
    { id: 4, src: "/static/media/images/rice (4).jpg", alt: "Image 4" },
    { id: 5, src: "/static/media/images/rice (5).jpg", alt: "Image 5" }
  ];

  return (
    <>
    <h1>برنج لاین</h1>
    <div className="gallery">
      {images.map((image) => (
        <div key={image.id} className="gallery-item">
          <img
            src={image.src}
            alt={image.alt}
            className="gallery-image"
          />
        </div>
      ))}
    </div>
    </>
  );
}

export default Gallery;
