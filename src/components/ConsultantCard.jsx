import Image from "next/image";
import { Avatar } from "@material-tailwind/react";
import { IoBagOutline } from "react-icons/io5";
import { GrUserExpert } from "react-icons/gr";
import ConsultantViewDetails from "./ConsultantViewDetails";



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
      className="consultant-card flex flex-row gap-2 consultant-card__unselected cursor-default border border-border-gray rounded-xl p-4 w-full min-h-[200px]"
      id={"consultant-card-" + props.consultant.displayName}
      key={props.consultant.email}
    >
      {/* Foto */}
      <div className="flex-shrink-0">
        <Avatar
          src={
            props.consultant.profileImage !== null
              ? props.consultant.profileImage
              : "/images/avatar.png"
          }
          alt="profile image"
          className="w-32 h-32 border-border-gray rounded-full overflow-hidden object-cover"
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
            {props.consultant.aboutYou ??
            "Mi pasión es ayudar a las personas a sentirse y verse bien. Me encanta compartir mis conocimientos sobre el cuidado de la piel y el maquillaje, y estoy aquí para ayudarte a encontrar los productos perfectos para ti."}
            </p>
        </div>
        {/* Botones */}
        <div className="flex flex-wrap gap-1 mt-6 justify-center md:justify-start">
          <button
            id="consultant-card-view-profile"
            className="text-xs cursor-pointer flex items-center gap-2 border-border-gray hover:bg-gray-300 rounded px-4 py-2 w-[125px] flex-shrink-0"
            onClick={(event) =>
              props.viewDetailsHandler(event, props.consultant)
            }

          >
            <GrUserExpert />
            {props.dict.consultant_card.view_details}
          </button>
          <a
            id="consultant-card-select-insider"
            className="text-xs cursor-pointer flex items-center gap-2 bg-mine-shaft text-white hover:bg-black rounded px-4 py-2 w-[125px] flex-shrink-0"
            href={`https://jafra-mx.myshopify.com/?pws=${props.consultant.siteName}`} //reemplazar la URL para JAFRA MX
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