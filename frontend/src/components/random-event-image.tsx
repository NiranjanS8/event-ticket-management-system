import { useEffect, useState } from "react";

interface RandomEventImageProperties {
  className?: string;
  alt?: string;
}

const RandomEventImage: React.FC<RandomEventImageProperties> = ({
  className = "h-full w-full object-cover",
  alt = "Event artwork",
}) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 4) + 1;
    setImageSrc(`/event-image-${randomIndex}.webp`);
  }, []);

  return <img src={imageSrc} alt={alt} className={className} loading="lazy" />;
};

export default RandomEventImage;
