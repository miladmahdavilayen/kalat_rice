import React from 'react';
import "../Gallery.css";




function Gallery() {

  const images = [
    { id: 1, src: "/static/media/images/dad_yahya.JPG", alt: "Image 6" },
    { id: 2, src: "/static/media/images/dad_pointing.jpg", alt: "Image 7" },
    { id: 3, src: "/static/media/images/dahat.jpg", alt: "Image 8" },
    { id: 4, src: "/static/media/images/kooh.jpg", alt: "Image 9" },
    { id: 5, src: "/static/media/images/layen.jpg", alt: "Image 10" },
    { id: 6, src: "/static/media/images/rice.jpg", alt: "Image 1" },
    { id: 7, src: "/static/media/images/rice (2).jpg", alt: "Image 2" },
    { id: 8, src: "/static/media/images/rice (3).jpg", alt: "Image 3" },
    { id: 9, src: "/static/media/images/rice (4).jpg", alt: "Image 4" },
    { id: 10, src: "/static/media/images/rice (5).jpg", alt: "Image 5" }
  ];

  return (
    <>
    <h1 className='title'>برنج لاین</h1>
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
