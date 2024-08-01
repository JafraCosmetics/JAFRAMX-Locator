import {
  BackIcon,
  EmailIcon,
  LocationPinIcon,
  PhoneIcon,
  WebIcon,
} from "./Icons";
import { useEffect, useState } from "react";
import { AsYouType } from "libphonenumber-js";
import { useTranslation } from "react-i18next";

const ConsultantViewDetails = (props) => {
  const [profileImage, setProfileImage] = useState();
  let { t } = useTranslation();

  const getShopifyConsultant = async (email) => {
    let url = `https://1rhheoj6db.execute-api.us-west-2.amazonaws.com/Prod/partners/partner-search?searchType=EMAIL&email=${email}`;

    let options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    try {
      const res = await fetch(url, options);
      const json = await res.json();
      return json.partners ? json.partners[0] : null;
    } catch (err) {
      return console.error("error:" + err);
    }
  };
  const capitalizeFirstLowercaseRest = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const renderLocation = (props) => {
    if (props.consultant.city && props.consultant.provinceCode) {
      return (
        <>
          <LocationPinIcon />
          <p className="consultant-box__location">
            {props.dict.view_details.located_at}{" "}
            {capitalizeFirstLowercaseRest(props.consultant.city)},{" "}
            {capitalizeFirstLowercaseRest(props.consultant.provinceCode)}
          </p>
        </>
      );
    } else if (props.consultant.city) {
      return (
        <>
          <LocationPinIcon />
          <p className="consultant-box__location">
            {props.dict.view_details.located_at}{" "}
            {capitalizeFirstLowercaseRest(props.consultant.city)}
          </p>
        </>
      );
    } else if (props.consultant.provinceCode) {
      return (
        <>
          <LocationPinIcon />
          <p className="consultant-box__location">
            {props.dict.view_details.located_at}{" "}
            {capitalizeFirstLowercaseRest(props.consultant.provinceCode)}
          </p>
        </>
      );
    }
    return null;
  };

  useEffect(() => {
    if (!props.consultant.profileImage) {
      let shopifyConsultant = getShopifyConsultant(props.consultant.email);
      setProfileImage(shopifyConsultant.profileImage);
    } else {
      setProfileImage(props.consultant.profileImage);
    }
  }, [props]);

  return (
    <div className="modal-container h-screen md:h-full">
      <div className="modal flex flex-col gap-9 py-6 px-4 w-full ">
        <div
          className="close-modal flex items-center gap-2 md:hidden"
          onClick={props.goBackHandler}
        >
          <BackIcon color="#272727" />
          <p>{props.dict.find_your_insider.go_back}</p>
        </div>
        <div className="view-details h-full" key={props.consultant.email}>
          <div className="flex flex-col h-full">
            <div className="flex flex-col gap-2 justify-center items-center md:h-full">
              <img
                name={props.consultant.displayName}
                className="h-32 w-32 md:h-40 md:w-40 rounded object-contain"
                src={profileImage ?? "/images/avatar.png"}
              />
              <div className="view-details__name">
                {props.consultant.displayName}
              </div>

              {props.consultant.phone ? (
                props.consultant.hidePhone === null ||
                props.consultant.hidePhone === "false" ? (
                  <div className="flex gap-1 items-center">
                    <PhoneIcon />
                    <p className="view-details__contact ">
                      <a
                        href={
                          "tel:" +
                          new AsYouType("US").input(props.consultant.phone)
                        }
                        target="_parent"
                      >
                        {new AsYouType("US").input(props.consultant.phone)}
                      </a>
                    </p>
                  </div>
                ) : null
              ) : null}

              {props.consultant.email ? (
                props.consultant.hideEmail === null ||
                props.consultant.hideEmail === "false" ? (
                  <div className="flex gap-1 items-center">
                    <EmailIcon />
                    <p className="view-details__contact">
                      <a
                        href={"mailto:" + props.consultant.email}
                        target="_parent"
                      >
                        {props.consultant.email}
                      </a>
                    </p>
                  </div>
                ) : null
              ) : null}

              <div className="flex gap-1 items-center">
                <WebIcon />

                <p className="view-details__contact">
                  <a
                    href={
                      "https://jafraadmin.myshopify.com/" +
                      props.consultant.siteName
                    }
                    target="_parent"
                  >
                    jafra.com/{props.consultant.siteName}
                  </a>
                </p>
              </div>
              <div className="flex gap-1 items-center">
                {renderLocation(props)}
              </div>
            </div>
            <button
              className="bg-mine-shaft text-white hover:bg-black capitalize w-full py-4 rounded mt-auto"
              onClick={props.selectConsultantHandler}
            >
              {props.dict.view_details.select_btn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantViewDetails;
