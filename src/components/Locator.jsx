import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import Radar from "radar-sdk-js";
import "radar-sdk-js/dist/radar.css";
import { renderToString } from "react-dom/server";

import ConsultantCard from "./ConsultantCard";
import ZipForm from "./ZipForm";
import {
  BackIcon,
  EmailIcon,
  LocationPinIcon,
  NumberedListIcon,
  PhoneIcon,
  WebIcon,
} from "./Icons";
import { ConsultantSelectedContext } from "./ConsultantFinder";
import { LocationIcon } from "./Icons";
import MapAccordion from "./MapAccordion";
import ConsultantViewDetails from "./ConsultantViewDetails";
import Image from "next/image";
import MapPlaceholder from "/public/images/mapPlaceholder.png";
import { AsYouType } from "libphonenumber-js";
import { Scrollbars } from "react-custom-scrollbars";

export const UserContext = React.createContext(null);

export default function Locator(props) {
  const mapRef = useRef(null);
  const mobileMapRef = useRef(null);

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
  const [mapCenter, setMapCenter] = useState(null);
  const { consultantSelected, setConsultantSelected, setModalState } =
    useContext(ConsultantSelectedContext);

  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  const findConsultantByEmail = async (email) => {
    // validate searchQuery

    let url = `https://qaysz0xhkj.execute-api.us-west-2.amazonaws.com/Prod/partners/partner-search?searchType=EMAIL&email=${email}`;

    let options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    return fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        if (json.partners.length > 0) {
          return json.partners[0].siteName;
        }
        return null;
      })
      .catch((err) => console.error("error:" + err));
  };

  const setPrefPartner = (consultant) => {
    console.log("setting pref partner");
    console.log(consultant);

    // get site name
    findConsultantByEmail(consultant.email).then((siteName) => {
      console.log(siteName);
      consultant.siteName = siteName;
      let data = {
        type: "setPrefPartner",
        data: consultant,
      };
      parent.postMessage(data, "*"); //  `*` on any domain

      setModalState("confirmation");
    });
  };

  useEffect(() => {
    console.log("getting locations");
    const getLocations = async () => {
      let url = "";
      if (currentZip) {
        url = `https://qaysz0xhkj.execute-api.us-west-2.amazonaws.com/Prod/locator?zip=${currentZip}`;
      } else if (currentLocation) {
        console.log(currentLocation);
        url = `https://qaysz0xhkj.execute-api.us-west-2.amazonaws.com/Prod/locator?lat=${currentLocation.lat}&lng=${currentLocation.lng}`;
      }

      if (url !== "") {
        let options = { method: "GET" };

        fetch(url, options)
          .then((res) => res.json())
          .then((data) => {
            // console.log(json);
            sortAndSetConsultantList(data);
            setMapCenter(data.origin);
            setLocationsLoaded(true);
          })
          .catch((err) => console.error("error:" + err));
        // console.log(data);
      }
    };
    getLocations();
  }, [currentLocation, currentZip]);

  const sortAndSetConsultantList = (consultants) => {
    console.log(consultants);
    if (consultants.locations !== null) {
      setConsultantList(consultants.locations);
    } else {
      setConsultantList([]);
    }
  };

  const consultantCardClickHandler = (event, marker) => {
    event.preventDefault();

    if (event.target === event.currentTarget) {
      // do nothing
    }
    marker.click();
  };

  useEffect(() => {
    console.log("selected info window: ", selectedInfoWindow);
    const card = document.getElementById(
      `consultant-card-${selectedInfoWindow}`
    );
    if (card) {
      card.scrollIntoView();
    }
  }, [selectedInfoWindow]);

  useEffect(() => {
    console.log("Initializing Radar");
    Radar.initialize("prj_test_pk_0b79af5a794b925ef785389c54340b431be92e05");
  }, []);

  useEffect(() => {
    const viewDetailsHandler = (event, consultant, marker) => {
      if (windowSize.current[0] >= 1024) {
        consultantCardClickHandler(event, marker);
      } else {
        setSelectedConsultant(consultant);
      }
    };

    const consultantCardList = new Array();

    console.log(consultantList);
    let i = 0;
    if (mapCenter !== null) {
      console.log("origin:", [mapCenter.lng, mapCenter.lat]);

      if (mapRef.current) {
        const radarMap = Radar.ui.map({
          container: "map",
          style: "radar-default-v1",
          center: [mapCenter.lng, mapCenter.lat],
          zoom: 10,
        });

        mobileMapRef.current = Radar.ui.map({
          container: "map-mobile",
          style: "radar-default-v1",
          center: [mapCenter.lng, mapCenter.lat],
          zoom: 10,
        });
        console.log("radarMap: ", radarMap);

        mapRef.current = radarMap;
      } else {
        const radarMap = Radar.ui.map({
          container: "map",
          style: "radar-default-v1",
          center: [mapCenter.lng, mapCenter.lat],
          zoom: 10,
        });
        mobileMapRef.current = Radar.ui.map({
          container: "map-mobile",
          style: "radar-default-v1",
          center: [mapCenter.lng, mapCenter.lat],
          zoom: 9,
        });

        mapRef.current = radarMap;
      }

      console.log("mapRef: ", mapRef);

      for (let consultant of consultantList) {
        // console.log("consultant: " + consultant.latitude, consultant.longitude);

        const infoWindow = (
          // <div className="map-marker grid grid-cols-20-80 py-4 px-2">
          //   <div>
          //     <NumberedListIcon height="2em" width="2em" number={i + 1} />
          //   </div>
          <div>
            {/* <Image
              name={consultant.displayName}
              className="mb-3 h-12 w-12 rounded object-contain"
              src={consultant.profileImage ?? AvatarImage}
              alt="profile image"
              fill={false}
            /> */}

            <div className="mb-3">
              <h2>{consultant.displayName}</h2>
              <p>
                {consultant.distance} {props.dict.consultant_card.distance}
              </p>
            </div>

            <div className="flex gap-1 items-center mb-2">
              <WebIcon />{" "}
              <a
                href={"https://693176-75.myshopify.com/" + consultant.siteName}
                target="_parent"
              >
                jafraqa.myshopify.com/{consultant.siteName}
              </a>
            </div>

            {/* {consultant.phone ? (
              consultant.hidePhone === null ||
              consultant.hidePhone === false ? (
                <div className="flex gap-1 items-center mb-2">
                  <PhoneIcon />{" "}
                  <a
                    href={"tel:" + new AsYouType("US").input(consultant.phone)}
                    target="_parent"
                  >
                    {new AsYouType("US").input(consultant.phone)}
                  </a>
                </div>
              ) : null
            ) : null}

            {consultant.email ? (
              consultant.hideEmail === null ||
              consultant.hideEmail === false ? (
                <div className="flex gap-1 items-center mb-2">
                  <EmailIcon />{" "}
                  <a href={"mailto:" + consultant.email} target="_parent">
                    {consultant.email}
                  </a>
                </div>
              ) : null
            ) : null} */}

            {/* 
              <button
                className="h-8 bg-mine-shaft text-white hover:bg-black rounded"
              >
                Select
              </button> */}
          </div>
          // </div>
        );

        const marker = Radar.ui
          .marker({
            popup: {
              html: renderToString(infoWindow),
              maxWidth: 300,
            },
          })
          .setLngLat([consultant.longitude, consultant.latitude])
          .addTo(mapRef.current);

        marker._element.onclick = () => {
          setSelectedInfoWindow(consultant.displayName);
        };

        const mobileMarker = Radar.ui
          .marker({
            popup: {
              html: renderToString(infoWindow),
              maxWidth: 300,
            },
          })
          .setLngLat([consultant.longitude, consultant.latitude])
          .addTo(mobileMapRef.current);

        mobileMarker._element.onclick = () => {
          setSelectedInfoWindow(consultant.displayName);
        };

        consultantCardList.push(
          <ConsultantSelectedContext.Provider
            value={{ consultantSelected, setConsultantSelected }}
            key={consultant.email}
          >
            <ConsultantCard
              consultant={consultant}
              marker={marker._element}
              number={i + 1}
              key={consultant.displayName}
              selectConsultantHandler={() => setPrefPartner(consultant)}
              viewDetailsHandler={viewDetailsHandler}
              distance={true}
              dict={props.dict}
            />
          </ConsultantSelectedContext.Provider>
        );

        i++;
      }

      // render consultants list
      if (consultantCardList.length > 0) {
        setConsultantCards(
          <div style={{ width: "95%" }} className="flex flex-col gap-2">
            {consultantCardList}
          </div>
        );
      } else {
        setConsultantCards(
          <div className="flex flex-col justify-center items-center gap-2 h-full mt-16">
            <div>{props.dict.match_insider.no_insiders_found}</div>
          </div>
        );
      }
    }
  }, [consultantList]);

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
    const mapDiv = document.getElementById("map");
    if (mapDiv !== null) mapDiv.innerHTML = "";
    let zipCode = event.target.elements.zip.value;
    setCurrentZip(zipCode);
    setSelectedConsultant(null);
    setSelectedInfoWindow("");
  };

  const renderResultsMessage = useMemo(() => {
    console.log(consultantList);
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
  }, [consultantList, currentZip, props.dict]);

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
            fill="#8f4899"
          />
        </svg>
        <span className="sr-only"> {props.dict.match_insider.loading}</span>
      </div>
    );
  }, [props.dict]);

  return locationsLoaded ? (
    selectedConsultant ? (
      <div className="modal-container h-full lg:h-860">
        <div className="modal p-4 w-full flex lg:grid lg:p-8 modal-container-grid">
          <ConsultantViewDetails
            consultant={selectedConsultant}
            goBackHandler={() => setSelectedConsultant(null)}
            selectConsultantHandler={() => setPrefPartner(selectedConsultant)}
            dict={props.dict}
          />
        </div>
      </div>
    ) : (
      <div className="modal-container ">
        <div className="modal flex p-4 lg:p-8 justify-between w-full">
          <div className="modal__left overflow-hidden">
            <>
              <div
                // data-close-modal
                data-micromodal-close
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
                <p className="hidden lg:block">
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
            </>
            <div className="lg:hidden">
              <MapAccordion />
            </div>

            <div className="mt-3">
              <p className="px-6 mb-6">{renderResultsMessage}</p>
              {consultantList.length > 0 ? (
                <Scrollbars autoHide style={{ width: 370, height: 325 }}>
                  {consultantCards}
                </Scrollbars>
              ) : (
                <div>{consultantCards}</div>
              )}
            </div>
          </div>
          <div
            id="map"
            style={{ height: "100%", width: "100%", maxWidth: "600px" }}
            className="hidden lg:block modal-container__right map-container rounded-r-lg"
          ></div>
        </div>
      </div>
    )
  ) : (
    <>
      <div className="modal-container">
        <div className="modal flex flex-col p-4 lg:p-8  w-full justify-between  lg:grid lg:modal-container-grid">
          <div className="modal__left">
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

            <p className="hidden lg:block mb-6">
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
              <LocationPinIcon />
              <a className="underline" onClick={getCurrentLocation}>
                {props.dict.match_insider.use_location}
              </a>
            </div>
            {gettingCurrentLocation == false && currentZip == null ? null : (
              <div className="h-full lg:hidden">
                <div className="flex flex-col justify-center items-center gap-2 h-full">
                  <p>{props.dict.match_insider.loading_insiders}</p>
                  {renderLoadingMessage}
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block max-w-730">
            <div className="map-loading flex flex-col gap-5 justify-center items-center h-full relative xl:w-730">
              <Image
                className="lg:w-full lg:h-full object-cover	"
                src={MapPlaceholder}
                alt="map loading image"
                fill={true}
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
