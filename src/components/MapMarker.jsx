import React, { useContext, useEffect, useRef, useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import {
  NumberedListIcon,
  PhoneIcon,
  EmailIcon,
  WebIcon,
} from "../components/Icons";
import { UserContext } from "./Locator";
import { AsYouType } from "libphonenumber-js";
import Image from "next/image";
import AvatarImage from "/public/images/avatar.png";
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'


const MapMarker = (props) => {
  const { selectedInfoWindow, setSelectedInfoWindow } = useContext(UserContext);
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  // console.log(props.consultant);

  const onMarkerClick = () => {
    // set selectedConsultant
    setSelectedInfoWindow(props.consultant.email);
  };

  const onCloseClick = () => {
    // set all consultatnt card buttons to false
    var radioButtons = document.getElementsByClassName(
      "consultant-card__radio"
    );

    for (let i = 0; i < radioButtons.length; i++) {
      delete radioButtons[i].dataset.checked;
    }
    setSelectedInfoWindow("");
  };

  return (
    <Marker
      position={{
        lat: props.consultant.latitude,
        lng: props.consultant.longitude,
      }}
      className="map-mark"
      title={props.consultant.email}
      onClick={() => onMarkerClick()}
      icon={{
        path: faLocationDot.icon[4],
        fillColor: "#5A52B9",
        fillOpacity: 1,
        anchor: new google.maps.Point(
          faLocationDot.icon[0] / 2, // width
          faLocationDot.icon[1] // height
        ),
        strokeWeight: 1,
        strokeColor: "#5A52B9",
        scale: 0.075,
      }}
      key={props.consultant.siteName}
    >
      {selectedInfoWindow === props.consultant.email &&
        windowSize.current[0] >= 768 ? (
        <InfoWindow
          position={{
            lat: props.consultant.latitude,
            lng: props.consultant.longitude,
          }}
          onCloseClick={() => onCloseClick()}
        >
          <div className="map-marker grid grid-cols-20-80 py-4 px-2">
            <div>
              <NumberedListIcon
                height="2em"
                width="2em"
                number={props.number}
              />
            </div>
            <div>
              <Image
                name={props.consultant.displayName}
                className="mb-3 h-12 w-12 rounded object-contain"
                src={props.consultant.profileImage ?? AvatarImage}
                alt="profile image"
                fill={false}
              />

              <div className="mb-3">
                <h2>{props.consultant.displayName}</h2>
                <p>
                  {props.consultant.distance}{" "}
                  {props.dict.consultant_card.distance}
                </p>
              </div>

              <div className="flex gap-1 items-center mb-2">
                <WebIcon />{" "}
                <a
                  href={
                    "https://jafraadmin.myshopify.com/" +
                    props.consultant.siteName
                  }
                  target="_parent"
                >
                  tlc.com/{props.consultant.siteName}
                </a>
              </div>

              {props.consultant.phone ? (
                props.consultant.hidePhone === null ||
                  props.consultant.hidePhone === "false" ? (
                  <div className="flex gap-1 items-center mb-2">
                    <PhoneIcon />{" "}
                    <a
                      href={
                        "tel:" +
                        new AsYouType("US").input(props.consultant.phone)
                      }
                      target="_parent"
                    >
                      {new AsYouType("US").input(props.consultant.phone)}
                    </a>
                  </div>
                ) : null
              ) : null}

              {props.consultant.email ? (
                props.consultant.hideEmail === null ||
                  props.consultant.hideEmail === "false" ? (
                  <div className="flex gap-1 items-center mb-2">
                    <EmailIcon />{" "}
                    <a
                      href={"mailto:" + props.consultant.email}
                      target="_parent"
                    >
                      {props.consultant.email}
                    </a>
                  </div>
                ) : null
              ) : null}

              <button
                className="h-8 bg-mine-shaft text-white hover:bg-black rounded"
                onClick={props.selectConsultantHandler}
              >
                Select
              </button>
            </div>
          </div>
        </InfoWindow>
      ) : null}
      ;
    </Marker >
  );
};

export default MapMarker;
