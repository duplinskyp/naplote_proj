'use client';

import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  center?: number[];
  onClick?: (latlng: [number, number]) => void; // Pridaný onClick prop
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const ClickableMap: React.FC<{ onClick: (latlng: L.LatLng) => void }> = ({ onClick }) => {
  useMapEvents({
    click(event) {
      onClick(event.latlng);
    },
  });

  return null;
};

const Map: React.FC<MapProps> = ({ center, onClick }) => {
  const defaultCenter: L.LatLngExpression = [48.1486, 17.1077]; // Bratislava, Slovakia
  const zoomLevel = center ? 15 : 7; // Use higher zoom level for more detailed view

  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(
    center ? new L.LatLng(center[0], center[1]) : null
  );

  useEffect(() => {
    if (center) {
      setMarkerPosition(new L.LatLng(center[0], center[1]));
    }
  }, [center]);

  const handleMapClick = (latlng: L.LatLng) => {
    console.log('Clicked position:', latlng); // Log latitude and longitude
    setMarkerPosition(latlng);
    if (onClick) {
      onClick([latlng.lat, latlng.lng]); // Odovzdanie súradníc do onClick callback funkcie
    }
  };

  console.log('Map center:', center); // Debugging the center prop

  return (
    <MapContainer
      center={markerPosition || defaultCenter}
      zoom={zoomLevel}
      scrollWheelZoom={true}
      className="h-[35vh] rounded-lg"
    >
      <TileLayer url={url} attribution={attribution} />
      <ClickableMap onClick={handleMapClick} />
      {markerPosition && (
        <Marker position={markerPosition} />
      )}
    </MapContainer>
  );
}

export default Map;
