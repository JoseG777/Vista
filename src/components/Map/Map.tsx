import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import styles from "./Map.module.css";

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  pins: { lat: number; lng: number; state: string }[];
}

const states = [
  { name: "Alabama", code: "AL", center: { lat: 32.8067, lng: -86.7911 } },
  { name: "Alaska", code: "AK", center: { lat: 61.385, lng: -152.2683 } },
  { name: "Arizona", code: "AZ", center: { lat: 33.7712, lng: -111.3877 } },
  { name: "Arkansas", code: "AR", center: { lat: 34.9513, lng: -92.3809 } },
  { name: "California", code: "CA", center: { lat: 36.17, lng: -119.7462 } },
  { name: "Colorado", code: "CO", center: { lat: 39.0646, lng: -105.3272 } },
  { name: "Connecticut", code: "CT", center: { lat: 41.5834, lng: -72.7622 } },
  { name: "Delaware", code: "DE", center: { lat: 39.3498, lng: -75.5148 } },
  { name: "Florida", code: "FL", center: { lat: 27.8333, lng: -81.717 } },
  { name: "Georgia", code: "GA", center: { lat: 32.9866, lng: -83.6487 } },
  { name: "Hawaii", code: "HI", center: { lat: 21.1098, lng: -157.5311 } },
  { name: "Idaho", code: "ID", center: { lat: 44.2394, lng: -114.5103 } },
  { name: "Illinois", code: "IL", center: { lat: 40.3363, lng: -89.0022 } },
  { name: "Indiana", code: "IN", center: { lat: 39.8647, lng: -86.2604 } },
  { name: "Iowa", code: "IA", center: { lat: 42.0046, lng: -93.214 } },
  { name: "Kansas", code: "KS", center: { lat: 38.5111, lng: -96.8005 } },
  { name: "Kentucky", code: "KY", center: { lat: 37.669, lng: -84.6514 } },
  { name: "Louisiana", code: "LA", center: { lat: 31.1801, lng: -91.8749 } },
  { name: "Maine", code: "ME", center: { lat: 44.6939, lng: -69.3819 } },
  { name: "Maryland", code: "MD", center: { lat: 39.0724, lng: -76.7902 } },
  { name: "Massachusetts", code: "MA", center: { lat: 42.2373, lng: -71.5314 } },
  { name: "Michigan", code: "MI", center: { lat: 43.3504, lng: -84.5603 } },
  { name: "Minnesota", code: "MN", center: { lat: 45.7326, lng: -93.9196 } },
  { name: "Mississippi", code: "MS", center: { lat: 32.7673, lng: -89.6812 } },
  { name: "Missouri", code: "MO", center: { lat: 38.4623, lng: -92.302 } },
  { name: "Montana", code: "MT", center: { lat: 46.9048, lng: -110.3261 } },
  { name: "Nebraska", code: "NE", center: { lat: 41.1289, lng: -98.2883 } },
  { name: "Nevada", code: "NV", center: { lat: 38.4199, lng: -117.1219 } },
  { name: "New Hampshire", code: "NH", center: { lat: 43.4108, lng: -71.5653 } },
  { name: "New Jersey", code: "NJ", center: { lat: 40.314, lng: -74.5089 } },
  { name: "New Mexico", code: "NM", center: { lat: 34.8375, lng: -106.2371 } },
  { name: "New York", code: "NY", center: { lat: 42.1497, lng: -74.9384 } },
  { name: "North Carolina", code: "NC", center: { lat: 35.6411, lng: -79.8431 } },
  { name: "North Dakota", code: "ND", center: { lat: 47.5362, lng: -99.793 } },
  { name: "Ohio", code: "OH", center: { lat: 40.3736, lng: -82.7755 } },
  { name: "Oklahoma", code: "OK", center: { lat: 35.5376, lng: -96.9247 } },
  { name: "Oregon", code: "OR", center: { lat: 44.5672, lng: -122.1269 } },
  { name: "Pennsylvania", code: "PA", center: { lat: 40.5773, lng: -77.264 } },
  { name: "Rhode Island", code: "RI", center: { lat: 41.6772, lng: -71.5101 } },
  { name: "South Carolina", code: "SC", center: { lat: 33.8191, lng: -80.9066 } },
  { name: "South Dakota", code: "SD", center: { lat: 44.2853, lng: -99.4632 } },
  { name: "Tennessee", code: "TN", center: { lat: 35.7449, lng: -86.7489 } },
  { name: "Texas", code: "TX", center: { lat: 31.106, lng: -97.6475 } },
  { name: "Utah", code: "UT", center: { lat: 40.1135, lng: -111.8535 } },
  { name: "Vermont", code: "VT", center: { lat: 44.0407, lng: -72.7093 } },
  { name: "Virginia", code: "VA", center: { lat: 37.768, lng: -78.2057 } },
  { name: "Washington", code: "WA", center: { lat: 47.3917, lng: -121.5708 } },
  { name: "West Virginia", code: "WV", center: { lat: 38.468, lng: -80.9696 } },
  { name: "Wisconsin", code: "WI", center: { lat: 44.2563, lng: -89.6385 } },
  { name: "Wyoming", code: "WY", center: { lat: 42.7475, lng: -107.2085 } },
];

const MapComponent: React.FC<MapProps> = ({ center, zoom, pins }) => {

  const mapRef = useRef<google.maps.Map | null>(null);

  const searchBoxRef = useRef<HTMLInputElement | null>(null);

  const dataLayerRef = useRef<google.maps.Data | null>(null);

  const markersRef = useRef<google.maps.Marker[]>([]);

  const [selectedState, setSelectedState] = useState<{
    name: string;
    code: string;
    center: google.maps.LatLngLiteral;
  } | null>(null);

  const [mapZoom, setMapZoom] = useState<number>(zoom);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });



  useEffect(() => {
    if (isLoaded && mapRef.current && selectedState) {
      if (dataLayerRef.current) {
        dataLayerRef.current.setMap(null);
      }
  
      const map = mapRef.current;
      const selectedLayer = new google.maps.Data();
      const otherStatesLayer = new google.maps.Data();
  
      const selectedGeoJsonPath = `/data/states/${selectedState.code}.geo.json`;
      selectedLayer.loadGeoJson(selectedGeoJsonPath);
  
      selectedLayer.setStyle({
        fillOpacity: 0,
        strokeOpacity: 1,
        strokeColor: "#000000",
        strokeWeight: 2,
      });
  
      selectedLayer.setMap(map);
  
      states.forEach((state) => {
        if (state.code !== selectedState.code) {
          const otherGeoJsonPath = `/data/states/${state.code}.geo.json`;
  
          otherStatesLayer.loadGeoJson(otherGeoJsonPath);
  
          otherStatesLayer.setStyle({
            fillColor: "#555555", 
            fillOpacity: 0.2, 
            strokeOpacity: 0.5, 
            strokeColor: "#000000",
          });
        }
      });
  
      otherStatesLayer.setMap(map);
  
      dataLayerRef.current = selectedLayer;
  
      return () => {
        selectedLayer.setMap(null);
        otherStatesLayer.setMap(null);
      };
    }
  }, [isLoaded, selectedState]);
  
  
  
  useEffect(() => {
    if (mapRef.current) {
      if (markersRef.current) {
        markersRef.current.forEach((marker) => marker.setMap(null));
      }

      if (selectedState) {
        const filteredPins = pins.filter((pin) => pin.state === selectedState.code);
        const newMarkers = filteredPins.map((pin) => {
          return new google.maps.Marker({
            map: mapRef.current,
            position: pin,
          });
        });

        markersRef.current = newMarkers;
      }
    }
  }, [selectedState, pins]);


  
  useEffect(() => {
    if (mapRef.current && selectedState) {
      mapRef.current.panTo(selectedState.center);
      setMapZoom(7);
    }
  }, [selectedState]);



  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };



  if (loadError) return <div>Error loading Google Maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (

    <div className={styles.mapContainer}>

      <div className={styles.searchContainer}>

        <div className={styles.stateSelector}>
          <select
            value={selectedState?.code || ""}
            onChange={(e) => {
              const state = states.find((s) => s.code === e.target.value);
              if (state) {
                setSelectedState(state);
              }
            }}
          >
            <option value="" disabled>
              Select State
            </option>

            {states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
            
          </select>
        </div>

        <input
          ref={searchBoxRef}
          type="text"
          placeholder="Search for a location in the U.S."
          className={styles.searchInput}
        />

      </div>

      <GoogleMap
        mapContainerClassName={styles.map}
        center={selectedState ? selectedState.center : center}
        zoom={selectedState ? mapZoom : zoom}
        onLoad={handleMapLoad}
      />

    </div>

  );
};

export default MapComponent;