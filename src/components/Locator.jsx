import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { fromAddress, setKey } from "react-geocode";

import MapMarker from "./MapMarker";
import ConsultantCard from "./ConsultantCard";
import ZipForm from "./ZipForm";
import { BackIcon } from "./Icons";
import { ConsultantSelectedContext } from "./ConsultantFinder";
import { LocationIcon } from "./Icons";
import MapAccordion from "./MapAccordion";
import ConsultantViewDetails from "./ConsultantViewDetails";

export const UserContext = React.createContext(null);

export default function Locator(props) {
  const mapRef = useRef(null);
  const [locationsLoaded, setLocationsLoaded] = useState(false);
  const [markerList, setMarkerList] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedInfoWindow, setSelectedInfoWindow] = useState("");
  const [consultantList, setConsultantList] = useState([]);
  const [consultantCards, setConsultantCards] = useState("");
  const [currentZip, setCurrentZip] = useState(null);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [map, setMap] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const {
    consultantSelected,
    setConsultantSelected,
    modalState,
    setModalState,
  } = useContext(ConsultantSelectedContext);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDUDxPArJiIDwhBu0BYMQtZhfLDxvpJII4",
  });
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  const setPrefPartner = async (consultant) => {
    // get consultant data from shopify
    const shopifyConsultant = await getShopifyConsultant(consultant.email);

    // let prefPartner = consultantList.filter(
    //   (el) => el.email === consultant.email,
    // );

    let data = {
      type: "setPrefPartner",
      data: { ...consultant, siteName: consultant.siteName },
    };
    parent.postMessage(data, "*"); //  `*` on any domain

    setModalState("confirmation");
  };

  const getShopifyConsultant = (email) => {
    let url = `https://1rhheoj6db.execute-api.us-west-2.amazonaws.com/Prod/partners/partner-search?searchType=EMAIL&email=${email}`;

    let options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    return fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        return json.partners ? json.partners[0] : null;
      })
      .catch((err) => console.error("error:" + err));
  };

  // Place Markers on Map for consultants
  const findAllStoresAndPlaceOnMap = (data) => {
    return data.map((consultant, index) => {
      return (
        <UserContext.Provider
          value={{ selectedInfoWindow, setSelectedInfoWindow }}
        >
          <MapMarker
            key={consultant.email}
            consultant={consultant}
            number={index + 1}
            selectConsultantHandler={() => setPrefPartner(consultant)}
          />
        </UserContext.Provider>
      );
    });
  };

  useMemo(() => {
    return consultantList.map((consultant, index) => {
      return (
        <UserContext.Provider
          value={{ selectedInfoWindow, setSelectedInfoWindow }}
        >
          <MapMarker
            key={consultant.email}
            consultant={consultant}
            number={index + 1}
            selectConsultantHandler={() => setPrefPartner(consultant)}
          />
        </UserContext.Provider>
      );
    });
  }, [consultantList]);

  const getLocations = async () => {
    if (currentLocation) {
      let url = `https://1rhheoj6db.execute-api.us-west-2.amazonaws.com/Prod/locatorDB?lat=${currentLocation.lat}&lng=${currentLocation.lng}&zip=${currentZip}`;

      console.log(url);
      let options = { method: "GET" };

      let data = await fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          return json;
        })
        .catch((err) => console.error("error:" + err));
      console.log(data);
      sortAndSetConsultantList(data);
      setLocationsLoaded(true);
    }
  };

  useEffect(() => {
    getLocations();
  }, [currentLocation]);

  const sortAndSetConsultantList = (consultants) => {
    consultants.sort(function (a, b) {
      let aDistance = parseInt(a.distance);
      let bDistance = parseInt(b.distance);
      if (aDistance < bDistance) return -1;
      if (aDistance > bDistance) return 1;
      return 0;
    });
    consultants.length = Math.min(consultants.length, 250);
    setConsultantList(consultants);
  };

  const consultantCardClickHandler = (event, consultant) => {
    event.preventDefault();

    if (event.target === event.currentTarget) {
      // do nothing
    }

    // find marker and click
    let marker = document.querySelectorAll(`[title="${consultant.email}"]`);
    marker[0].click();
  };

  const viewDetailsHandler = (event, consultant) => {
    if (windowSize.current[0] >= 768) {
      consultantCardClickHandler(event, consultant);
    } else {
      setSelectedConsultant(consultant);
    }
  };

  const renderConsultantList = () => {
    const list = consultantList.map((consultant, i) => {
      return (
        <ConsultantSelectedContext.Provider
          value={{ consultantSelected, setConsultantSelected }}
        >
          <ConsultantCard
            consultant={consultant}
            number={i + 1}
            key={consultant.displayName}
            radioClickHandler={consultantCardClickHandler}
            selectConsultantHandler={() => setPrefPartner(consultant)}
            viewDetailsHandler={viewDetailsHandler}
            distance={true}
            dict={props.dict}
          />
        </ConsultantSelectedContext.Provider>
      );
    });

    // render consultants list
    if (list.length > 0) {
      setConsultantCards(<div className="flex flex-col gap-2">{list}</div>);
    } else {
      setConsultantCards(
        <div className="flex flex-col justify-center items-center gap-2 h-full mt-16">
          <div>{props.dict.match_insider.no_insiders_found}</div>
        </div>
      );
    }
  };

  useEffect(() => {
    renderConsultantList();
    // render location markers
    let res = findAllStoresAndPlaceOnMap(consultantList);
    setMarkerList(res);
  }, [consultantList, selectedInfoWindow]);

  useEffect(() => {
    const card = document.getElementById(
      `consultant-card-${selectedInfoWindow}`
    );
    if (card) {
      card.scrollIntoView();
    }
  }, [selectedInfoWindow]);

  useEffect(() => {
    setKey("AIzaSyDUDxPArJiIDwhBu0BYMQtZhfLDxvpJII4");
  }, []);

  const getCurrentLocation = () => {
    setGettingCurrentLocation(true);
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        const pos = { lat, lng };
        setCurrentLocation(pos);
      }
    );
  };

  const updateOrigin = async (event) => {
    event.preventDefault();
    setLocationsLoaded(false);
    let zipCode = event.target.elements.zip.value;
    setCurrentZip(zipCode);
    setSelectedConsultant(null);
    setSelectedInfoWindow("");
    let res = await fromAddress(zipCode)
      .then((response) => {
        return response.results[0];
      })
      .catch((error) => {
        console.error(error);
        setLocationsLoaded(false);
        setCurrentZip(null);
        setShowWarning(true);
        return null;
      });

    let newOrigin = res.geometry.location;
    setCurrentLocation(newOrigin);
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    let containerStyle = {
      width: "100%",
      height: "200px",
      borderRadius: "0px 8px 8px 0px",
    };
    const defaultMapOptions = {
      disableDefaultUI: true,
      maxZoom: 12,
    };
    if (windowSize.current[0] >= 768) {
      containerStyle = {
        width: "720px",
        height: "720px",
        borderRadius: "0px 8px 8px 0px",
      };
    }
    setMap(
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        center={currentLocation}
        onLoad={handleMapLoad}
        options={defaultMapOptions}
      >
        {markerList}
      </GoogleMap>
    );
  }, [markerList]);

  const renderResultsMessage = useMemo(() => {
    if (currentZip) {
      return (
        <>
          {consultantList.length}{" "}
          {props.dict.match_insider.results_found_within} {currentZip}
        </>
      );
    } else {
      return (
        <>
          {consultantList.length}{" "}
          {props.dict.match_insider.results_found_within}
        </>
      );
    }
  }, [consultantList]);

  const renderLoadingMessage = useMemo(() => {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#EEEEEE"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#fe6e9c"
          />
        </svg>
        <span className="sr-only"> {props.dict.match_insider.loading}</span>
      </div>
    );
  });

  return isLoaded && locationsLoaded ? (
    selectedConsultant ? (
      <ConsultantViewDetails
        consultant={selectedConsultant}
        goBackHandler={() => setSelectedConsultant(null)}
        selectConsultantHandler={() => setPrefPartner(selectedConsultant)}
        dict={props.dict}
      />
    ) : (
      <div className="modal-container md:h-720 md:max-h-720 md:grid md:grid-cols-2-3">
        <div className="modal-container__left overflow-hidden py-6 w-full md:w-unset">
          <div className="px-6">
            <div
              data-close-modal
              className="close-modal flex items-center gap-4 mb-9"
              onClick={props.returnToStartHandler}
            >
              <BackIcon color="#272727" />
              <p>{props.dict.find_your_insider.go_back}</p>
            </div>
            <div className="modal-info-body mb-6">
              <div className="modal-heading mb-3">
                {props.dict.match_insider.header}
              </div>
              <p className="hidden md:block">
                {props.dict.match_insider.body} <br />
                <br />
                <a className="cursor-pointer" onClick={props.goToKnowHandler}>
                  {props.dict.match_insider.help_link}
                </a>
              </p>
            </div>
            <UserContext.Provider value={{ showWarning, setShowWarning }}>
              <ZipForm updateOrigin={updateOrigin} dict={props.dict} />
            </UserContext.Provider>
          </div>
          <div className="md:hidden">
            <MapAccordion body={map} />
          </div>

          <div className="mt-3">
            <p className="px-6 mb-6">{renderResultsMessage}</p>
            {consultantList.length > 0 ? (
              <div className="overflow-y-scroll max-h-500 h-screen md:max-h-320">
                {consultantCards}
              </div>
            ) : (
              <div>{consultantCards}</div>
            )}
          </div>
        </div>
        <div className="hidden md:block modal-container__right rounded-r-lg">
          {map}
        </div>
      </div>
    )
  ) : (
    <>
      <div className="modal-container h-screen md:h-720">
        <div className="modal flex flex-col md:grid md:grid-cols-2-3 w-full md:w-unset">
          <div className="p-6">
            <div
              className="close-modal flex items-center gap-2 mb-10"
              onClick={props.returnToStartHandler}
            >
              <BackIcon color="#272727" />
              <p>{props.dict.find_your_insider.go_back}</p>
            </div>

            <div className="modal-heading mt-6 mb-3">
              {props.dict.match_insider.header}
            </div>

            <p className="hidden md:block mb-6">
              {props.dict.match_insider.body}
              <br />
              <br />
              <a className="cursor-pointer" onClick={props.goToKnowHandler}>
                {props.dict.match_insider.help_link}
              </a>
            </p>
            <UserContext.Provider value={{ showWarning, setShowWarning }}>
              <ZipForm updateOrigin={updateOrigin} dict={props.dict} />
            </UserContext.Provider>
            <div className="flex items-center gap-2 mt-4">
              <LocationIcon />
              <a className="underline" onClick={getCurrentLocation}>
                {props.dict.match_insider.use_location}
              </a>
            </div>
            {gettingCurrentLocation == false && currentZip == null ? null : (
              <div className="h-full md:hidden">
                <div className="flex flex-col justify-center items-center gap-2 h-full">
                  <p>{props.dict.match_insider.loading_insiders}</p>
                  {renderLoadingMessage}
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <div className="map-loading flex flex-col gap-5 justify-center items-center h-full relative">
              <img
                className="h-720 object-cover	"
                src="/images/mapPlaceholder.png"
                alt="map loading image"
              />
              {gettingCurrentLocation == false && currentZip == null ? (
                <p> {props.dict.match_insider.map_text}</p>
              ) : (
                <>
                  <p>{props.dict.match_insider.loading_insiders}</p>
                  {renderLoadingMessage}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
