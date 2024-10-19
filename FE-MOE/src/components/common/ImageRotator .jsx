import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import "~/assert/ImageRotator.css";

export const ImageRotator = ({ imageUrl, w, h }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inTransition, setInTransition] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setInTransition(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrl.length);
        setInTransition(false);
      }, 500);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [imageUrl.length]);

  return (
    <div className={`image-container ${inTransition ? "flip" : ""}`}>
      <Image
        src={
          imageUrl[currentImageIndex] ||
          "https://flysunrise.com/wp-content/uploads/2024/03/featured-image-placeholder.jpg"
        }
        rounded
        width={w} 
        height={h}
      />
    </div>
  );
};
