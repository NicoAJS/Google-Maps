import React, { useEffect, useRef, useState } from "react";
import ChainVenuesMap from "components/Chains/ChainVenuesMap";
import { useLoadScript, Libraries } from "@react-google-maps/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { VenueLocation } from "./types";

const libraries: Libraries = ["places", "geometry"];

function App() {
  const [locations, setLocations] = useState<VenueLocation[] | null>(null);
  const [isMapVisible, setMapVisible] = useState(false);
  const experienceRef = useRef<HTMLButtonElement | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB8gxj6UUp1NyIL3sEAFFyuN5C-CjtLGXY", 
    libraries,
  });

  function parseNumberOrNull(value: string | null) {
    const num = value ? Number(value) : NaN;
    return Number.isNaN(num) ? null : num;
  }

  useEffect(() => {
    const list: VenueLocation[] = [];
    let i = 1;
    let venueName = getVenueValue(i, "venue_name");

    while (venueName != null) {
      const name = venueName;
      const link = getVenueValue(i, "venue_link") || null;
      const latitude = parseNumberOrNull(getVenueValue(i, "venue_latitude"));
      const longitude = parseNumberOrNull(getVenueValue(i, "venue_longitude"));
      const thumbnail = getVenueValue(i, "venue_thumbnail") || null;

      if (name != null && link != null && latitude != null && longitude != null && thumbnail != null) {
        list.push({
          id: i,
          name,
          link,
          location: {
            lat: latitude,
            lng: longitude,
          },
          thumbnail,
        });
      }

      i++;
      venueName = getVenueValue(i, "venue_name");
    }

    setLocations(list);
  }, []);

  function getVenueValue(i: number, name: string): string | null {
    const element = document.querySelector<HTMLInputElement>(`input[name="${name}[${i}]"]`);
    return element ? element.value : null;
  }

  useEffect(() => {
    const experienceEventHandler = () => setMapVisible(true);
    if (experienceRef.current) {
      experienceRef.current.addEventListener("experience", experienceEventHandler);
    }
    return () => {
      if (experienceRef.current) {
        experienceRef.current.removeEventListener("experience", experienceEventHandler);
      }
    };
  }, []);

  const toggleSearch = () => {
    setMapVisible(!isMapVisible);
  };

  return (
    <div className="app-container">
      <div className="search-product">
        <button className="title" onClick={toggleSearch}>
          Experience product here
        </button>
        <button ref={experienceRef} className="main-icon" id="experienceId" onClick={toggleSearch}>
          {isMapVisible ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}
        </button>
      </div>

      {/* Display the ChainVenuesMap component */}
      {isMapVisible && isLoaded && locations && <ChainVenuesMap venues={locations} />}
      {!isLoaded && <div>Loading map...</div>}
    </div>
  );
}

export default App;
