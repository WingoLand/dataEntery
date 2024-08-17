import { useEffect, useState } from "react";

export default function ImageDisplay() {
  const imageId = "66c0d78a84645b12dee4cc5b";
  const [imageSrc, setImageSrc] = useState("");

  const fetchImage = async () => {
    try {
      const response = await fetch(`http://localhost:8000/image/${imageId}`);

      if (response.ok) {
        console.log(imageId);
        const blob = await response.blob();

        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      } else {
        console.log("Failed to fetch image");
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <div>
      {imageSrc ? (
        <img src={imageSrc} alt="Uploaded" />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
}
