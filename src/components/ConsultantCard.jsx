import Image from "next/image";
import AvatarImage from "/public/images/avatar.png";
import { Avatar } from "@material-tailwind/react";
import { IoBagOutline } from "react-icons/io5";
import { GrUserExpert } from "react-icons/gr";


const renderLocation = (props) => {
  if (props.consultant.defaultAddress) {
    if (
      props.consultant.defaultAddress.city &&
      props.consultant.defaultAddress.provinceCode
    ) {
      return (
        <p className="consultant-box__location">
          {props.dict.consultant_card.located_at}{" "}
          {props.consultant.defaultAddress.city},{" "}
          {props.consultant.defaultAddress.provinceCode}
        </p>
      );
    } else if (props.consultant.defaultAddress.city) {
      return (
        <p className="consultant-box__location">
          {props.dict.consultant_card.located_at}{" "}
          {props.consultant.defaultAddress.city}
        </p>
      );
    } else if (props.consultant.defaultAddress.provinceCode) {
      return (
        <p className="consultant-box__location">
          {props.dict.consultant_card.located_at}{" "}
          {props.consultant.defaultAddress.provinceCode}
        </p>
      );
    }
    return null;
  }
};
const ConsultantCard = (props) => {
  return (
    <div
      className="consultant-card flex flex-row gap-2 consultant-card__unselected cursor-default border border-gray-300 rounded-md p-4 w-full min-h-[200px]"
      id={"consultant-card-" + props.consultant.displayName}
      key={props.consultant.email}
    >
      {/* Foto */}
      <div className="flex-shrink-0">
        <Avatar
          src={
            props.consultant.profileImage !== null
              ? props.consultant.profileImage
              : AvatarImage.src
          }
          alt="profile image"
          className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden object-cover"
        />
      </div>

      {/* Contenido derecho */}
      <div className="flex flex-col justify-between flex-grow">
        {/* Nombre y descripción */}
        <div>
          <div className="consultant-box__name text-lg font-bold">
            {props.consultant.displayName}
          </div>
          <p className="text-md font-montserrat">
              {props.consultant.aboutMe ??
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            </p>
        </div>
        {/* Botones */}
        <div className="flex flex-wrap gap-1 mt-6 justify-center md:justify-start">
          <button
            id="consultant-card-view-profile"
            className="text-xs cursor-pointer flex items-center gap-2 bg-gray-200 hover:bg-gray-300 rounded px-4 py-2 w-[125px] flex-shrink-0"
            onClick={(event) =>
              props.viewDetailsHandler(event, props.consultant, props.marker)
            }
          >
            <GrUserExpert />
            {props.dict.consultant_card.view_details}
          </button>
          <a
            id="consultant-card-select-insider"
            className="text-xs cursor-pointer flex items-center gap-2 bg-mine-shaft text-white hover:bg-black rounded px-4 py-2 w-[125px] flex-shrink-0"
            href={`https://jafra.com/${props.consultant.siteName}`} //reemplazar la URL para JAFRA MX
            target="_parent"
          >
            <IoBagOutline />
            {props.dict.consultant_card.select_insider}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConsultantCard;