import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { VenueLocation } from "types";

interface ChainVenuesMapProps {
  venues: VenueLocation[];
}

function ChainVenuesMap({ venues }: ChainVenuesMapProps) {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (venues.length > 0) {
      const latitudes = venues.map((venue) => venue.location.lat);
      const longitudes = venues.map((venue) => venue.location.lng);

      const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
      const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

      setMapCenter({ lat: avgLat, lng: avgLng });

      if (mapRef.current) {
        const bounds = new window.google.maps.LatLngBounds();
        venues.forEach((venue) => {
          bounds.extend(new window.google.maps.LatLng(venue.location.lat, venue.location.lng));
        });
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [venues]);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={10}
        onLoad={onLoad}
        options={{ streetViewControl: false, mapTypeControl: false }}
      >
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            position={{ lat: venue.location.lat, lng: venue.location.lng }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

export default ChainVenuesMap;
