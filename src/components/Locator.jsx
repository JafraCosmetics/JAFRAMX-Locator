import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import Radar from "radar-sdk-js";
import "radar-sdk-js/dist/radar.css";
import { renderToString } from "react-dom/server";
import { GrUserExpert } from "react-icons/gr";
import { IoBagOutline } from "react-icons/io5";
import ConsultantCard from "./ConsultantCard";
import ZipForm from "./ZipForm";
import { BackIcon} from "./Icons";
import { ConsultantSelectedContext } from "./ConsultantFinder";
import MapAccordion from "./MapAccordion";
import ConsultantViewDetails from "./ConsultantViewDetails";
import Image from "next/image";

import { Scrollbars } from "react-custom-scrollbars"; 
import { SubmitIcon } from "./Icons";

import { UserContext } from "./ConsultantFinder";
export default function Locator(props) {
  const { zipcode, dict, returnToStartHandler } = props;
  const mapRef = useRef(null);
  const mobileMapRef = useRef(null);

  const [locationsLoaded, setLocationsLoaded] = useState(false);
  const [markerList, setMarkerList] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedInfoWindow, setSelectedInfoWindow] = useState("");
  const [consultantList, setConsultantList] = useState([]);
  const [consultantCards, setConsultantCards] = useState("");
  const [currentZip, setCurrentZip] = useState(zipcode);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [map, setMap] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const { consultantSelected, setConsultantSelected, setModalState } =
    useContext(ConsultantSelectedContext);

  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  const findConsultantByEmail = async (email) => {
  const url = `https://ona4umtl22.execute-api.us-west-2.amazonaws.com/Prod/partners/partner-search?searchType=EMAIL&email=${email}`;

  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  return fetch(url, options)
    .then((res) => res.json()) // ← ESTA LÍNEA FALTABA
    .then((json) => {
      if (json.partners.length > 0) {
        return json.partners[0]; // regresa el objeto completo
      }
      return null;
    })
    .catch((err) => {
      console.error("error:", err);
      return null;
    });
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
      url = `https://ona4umtl22.execute-api.us-west-2.amazonaws.com/Prod/locator?zip=${currentZip}`;
    } else if (currentLocation) {
      url = `https://ona4umtl22.execute-api.us-west-2.amazonaws.com/Prod/locator?lat=${currentLocation.lat}&lng=${currentLocation.lng}`;
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
    Radar.initialize("prj_test_pk_122e9796a1788eae8a3a87106f7815ecf703afdb");
  }, []);

      const viewDetailsHandler = async (event, consultant) => {
      event.preventDefault();

      try {
        const response = await fetch(`https://ona4umtl22.execute-api.us-west-2.amazonaws.com/Prod/partners/partner-search?searchType=EMAIL&email=${consultant.email}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        const enrichedData = data?.partners?.[0];

        if (enrichedData) {
          setSelectedConsultant({ ...consultant, ...enrichedData });
        } else {
          setSelectedConsultant(consultant);
        }
      } catch (error) {
        console.error("Error fetching consultant by email:", error);
        setSelectedConsultant(consultant); // fallback
      }
    };


 useEffect(() => {
  const consultantCardList = new Array();
  console.log(consultantList);

  let i = 0;

  // Asegúrate de que el contenedor del mapa ya existe en el DOM
  const mapContainer = document.getElementById("map");
  const mobileMapContainer = document.getElementById("map-mobile");

  if (!mapCenter || !mapContainer || !mobileMapContainer) return;

  console.log("origin:", [mapCenter.lng, mapCenter.lat]);

  // Solo crear mapas si aún no existen
  if (!mapRef.current) {
    mapRef.current = Radar.ui.map({
      container: "map",
      style: "radar-default-v1",
      center: [mapCenter.lng, mapCenter.lat],
      zoom: 10,
    });
  }

  if (!mobileMapRef.current) {
    mobileMapRef.current = Radar.ui.map({
      container: "map-mobile",
      style: "radar-default-v1",
      center: [mapCenter.lng, mapCenter.lat],
      zoom: 9,
    });
  }

  for (let consultant of consultantList) {
    const infoWindow = (
      <div className="map-marker flex flex-col gap-4 py-4 px-4 w-[300px] mx-auto max-w-[300px] mx-4 border border-black rounded-lg">
        <div className="relative w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 mx-auto">
          <Image
            src={consultant.profileImage ?? "/images/avatar.png"}
            alt="profile image"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold">{consultant.displayName}</h2>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-4 w-full">
            <button
              id="consultant-card-view-profile"
              className="text-xs cursor-pointer flex items-center gap-2 bg-gray-200 hover:bg-gray-300 rounded px-4 py-2"
              onClick={(event) => viewDetailsHandler(event, consultant)}
            >
              <GrUserExpert />
              {props.dict.consultant_card.view_details}
            </button>
            <button
              id="consultant-card-select-insider"
              className="text-xs cursor-pointer flex items-center gap-2 bg-mine-shaft text-white hover:bg-black rounded px-4 py-2"
              onClick={props.selectConsultantHandler}
            >
              <IoBagOutline />
              {props.dict.consultant_card.select_insider}
            </button>
          </div>
        </div>
      </div>
    );

    const marker = Radar.ui
      .marker({
        popup: {
          html: renderToString(infoWindow),
          maxWidth: 400,
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
          maxWidth: 400,
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
          number={i + 1}
          key={i}
          selectConsultantHandler={() => setSelectedConsultant(consultant)}
          viewDetailsHandler={(e) => viewDetailsHandler(e, consultant)}
          distance={false}
          dict={props.dict}
        />
      </ConsultantSelectedContext.Provider>
    );

    i++;
  }

  setConsultantCards(
    consultantCardList.length > 0 ? (
      <div style={{ width: "100%" }} className="flex flex-col gap-2">
        {consultantCardList}
      </div>
    ) : (
      <div className="flex flex-col justify-center items-center gap-2 h-full mt-16">
        <div>{props.dict.match_insider.no_insiders_found}</div>
      </div>
    )
  );
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


  useEffect(() => {
    if (zipcode) {
      setCurrentZip(zipcode); // Actualiza el estado si cambia el código postal
    }
  }, [zipcode]);

    const updateOrigin = (zip) => {
      setLocationsLoaded(false);
      const mapDiv = document.getElementById("map");
      if (mapDiv !== null) mapDiv.innerHTML = "";
      setCurrentZip(zip); 
      setSelectedConsultant(null);
      setSelectedInfoWindow("");
    };

  const renderResultsMessage = useMemo(() => {;
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
    <div className="modal-container min-h-screen lg:h-full">
      <div className="modal modal-container-grid w-full flex flex-col lg:grid p-4 lg:p-8 gap-6">
        <div className="modal__left w-full flex flex-col">
          <div className="flex flex-col gap-2 overflow-auto max-h-[450px]">
            <div
              className="close-modal flex items-center gap-2 mb-10 cursor-pointer"
              onClick={props.returnToStartHandler}
            >
              <BackIcon color="#272727" />
              <p>{props.dict.find_your_insider.go_back}</p>
            </div>
            <div className="flex justify-center items-center mb-6">
              <Image
                src="/images/avatar.png"
                alt="Default Avatar"
                width={100}
                height={100}
              />
            </div>
            <div className="modal-heading jafra-purple font-bold">
              {props.dict.match_insider.h1}
            </div>
            <p className="hidden lg:block mb-6">
              {props.dict.match_insider.body}
            </p>
             <UserContext.Provider value={{ showWarning, setShowWarning }}>
                <ZipForm
                  dict={dict}
                  setSearchQuery={props.setSearchQuery} 
                  setSearchType={props.setSearchType}
                  updateOrigin={updateOrigin}
                  showWarning={showWarning}
                  setShowWarning={setShowWarning}
                />
              </UserContext.Provider>
          </div>

          <div className="flex flex-col gap-4 w-full mt-6">{consultantCards}</div>
        </div>

        <ConsultantViewDetails
          consultant={selectedConsultant}
          goBackHandler={() => setSelectedConsultant(null)}
          selectConsultantHandler={setPrefPartner}
          dict={props.dict}
        />
      </div>
    </div>
  ) : (
    <div className="modal-container min-h-screen lg:h-full">
      <div className="modal modal-container-grid w-full flex flex-col lg:grid p-4 lg:p-8 gap-6">
        <div className="modal__left w-full flex flex-col">
          <div
            className="close-modal flex items-center gap-4 mb-9 cursor-pointer"
            onClick={props.returnToStartHandler}
          >
            <BackIcon color="#272727" />
            <p>{props.dict.find_your_insider.go_back}</p>
          </div>
          <div className="flex justify-center items-center mb-6">
            <Image
              src="/images/avatar.png"
              alt="Default Avatar"
              width={100}
              height={100}
            />
          </div>
          <div className="modal-heading jafra-purple font-bold">
            {props.dict.match_insider.h1}
          </div>
          <p className="hidden lg:block mb-6">
            {props.dict.match_insider.body}
          </p>

          <UserContext.Provider value={{ showWarning, setShowWarning }}>
            <ZipForm
              dict={props.dict}
              setSearchQuery={props.setSearchQuery}
              setSearchType={props.setSearchType}
              updateOrigin={updateOrigin}
              showWarning={showWarning}
              setShowWarning={setShowWarning}
            />
          </UserContext.Provider>

          <div className="lg:hidden">
            <MapAccordion />
          </div>

          <div className="mt-3">
            <p className="px-6 mb-6">{renderResultsMessage}</p>
            {consultantList.length > 0 ? (
              <Scrollbars autoHide style={{ width: "100%", height: 400 }}>
                {consultantCards}
              </Scrollbars>
            ) : (
              <div className="flex flex-col gap-4 w-full">{consultantCards}</div>
            )}
          </div>
        </div>

        <div
          id="map"
          className="hidden lg:block modal-container__right map-container rounded-r-lg"
          style={{ height: "100%", width: "100%", maxWidth: "600px" }}
        ></div>
      </div>
    </div>
  )
) : (
  <div className="modal-container min-h-screen">
    <div className="modal flex flex-col lg:grid lg:modal-container-grid p-4 lg:p-8 w-full">
      <div className="modal__left w-full">
        <div
          className="close-modal flex items-center gap-2 mb-10 cursor-pointer"
          onClick={props.returnToStartHandler}
        >
          <BackIcon color="#272727" />
          <p>{props.dict.find_your_insider.go_back}</p>
        </div>
        <div className="flex justify-center items-center mb-6">
          <Image
            src="/images/avatar.png"
            alt="Default Avatar"
            width={100}
            height={100}
          />
        </div>
        <div className="modal-heading jafra-purple font-bold">
          {props.dict.match_insider.h1}
        </div>
        <p className="hidden lg:block mb-6">
          {props.dict.match_insider.body}
        </p>

        <UserContext.Provider value={{ showWarning, setShowWarning }}>
          <ZipForm
            dict={props.dict}
            setSearchQuery={props.setSearchQuery}
            setSearchType={props.setSearchType}
            updateOrigin={updateOrigin}
            showWarning={showWarning}
            setShowWarning={setShowWarning}
          />
        </UserContext.Provider>

        {gettingCurrentLocation || currentZip ? (
          <div className="h-full lg:hidden flex flex-col justify-center items-center gap-2">
            <p>{props.dict.match_insider.loading_insiders}</p>
            {renderLoadingMessage}
          </div>
        ) : null}
      </div>

      <div className="hidden lg:block max-w-730">
        <div className="map-loading flex flex-col justify-center items-center h-full relative xl:w-730">
          <Image
            src="/images/mapPlaceholder.png"
            alt="map loading image"
            fill={true}
            className="object-cover w-full h-full"
          />
          <p>
            {gettingCurrentLocation || currentZip
              ? props.dict.match_insider.loading_insiders
              : props.dict.match_insider.map_text}
          </p>
          {renderLoadingMessage}
        </div>
      </div>
    </div>
  </div>
);
}