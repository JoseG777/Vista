import React from "react";
import MapComponent from "../../components/Map/Map";

const Home: React.FC = () => {
  const center = { lat: 39.8283, lng: -98.5795 }; 

  const zoom = 13;

  const pins = [
    { lat: 34.0522, lng: -118.2437, state: "California"}, 
    { lat: 40.7128, lng: -74.006, state: "New York" }, 
    { lat: 37.7749, lng: -122.4194, state: "California" }, 
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapComponent center={center} zoom={zoom} pins={pins} />
    </div>
  );
};

export default Home;
