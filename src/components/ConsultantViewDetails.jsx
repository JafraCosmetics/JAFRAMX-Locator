//viewdetails
import {
  BackIcon,
  LocationPinIcon,
} from "./Icons";
import { useEffect, useState } from "react";
import Image from "next/image";

import AvatarImage from "/public/images/avatar.png";
import { FaAward } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { TfiCup } from "react-icons/tfi";
import { RiWhatsappFill } from "react-icons/ri";
import { IoBagOutline } from "react-icons/io5";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";



const ConsultantViewDetails = (props) => {
  const [profileImage, setProfileImage] = useState(AvatarImage);

  useEffect(() => {
    if (props.consultant.profileImage) {
      setProfileImage(props.consultant.profileImage);
    }
  }, [props.consultant.profileImage]);

  const capitalizeFirstLowercaseRest = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const renderLocation = () => {
    const { city, provinceCode } = props.consultant;
    if (city && provinceCode) {
      return (
        <>
          <LocationPinIcon />
          <p className="consultant-box__location">
            {props.dict.view_details.located_at}{" "}
            {capitalizeFirstLowercaseRest(city)},{" "}
            {capitalizeFirstLowercaseRest(provinceCode)}
          </p>
        </>
      );
    } else if (city) {
      return (
        <>
          <LocationPinIcon />
          <p className="consultant-box__location">
            {props.dict.view_details.located_at}{" "}
            {capitalizeFirstLowercaseRest(city)}
          </p>
        </>
      );
    } else if (provinceCode) {
      return (
        <>
          <LocationPinIcon />
          <p className="consultant-box__location">
            {props.dict.view_details.located_at}{" "}
            {capitalizeFirstLowercaseRest(provinceCode)}
          </p>
        </>
      );
    }
    return null;
  };

  return (
    <div className="consultant-view-details flex flex-col gap-4 py-4 px-4 w-full max-w-md lg:max-w-[600px] mx-auto border border-black rounded-lg overflow-y-auto max-h-[90vh]">
      <div className="flex flex-col gap-9 w-full">
        {/* Botón para regresar */}
        <div
          className="close-modal flex items-center gap-2 lg:hidden"
          onClick={props.goBackHandler}
        >
          <BackIcon color="#272727" />
          <p>{props.dict.find_your_insider.go_back}</p>
        </div>
        {/* Detalles del consultor */}
        <div className="view-details w-full flex justify-center h-full">
          <div className="flex flex-col gap-2 py-4 px-4 w-full mx-auto rounded-lg">
            {/* Foto */}
            <div className="flex justify-center">
              <Image
                name={props.consultant.displayName}
                className="h-22 w-22 lg:h-30 lg:w-30 bg-white rounded-full object-contain"
                src={profileImage}
                alt="profile image"
                height={75}
                width={75}
              />
            </div>
            {/* Nombre */}
            <div className="text-center">
              <h1 className="text-lg font-bold">{props.consultant.displayName}</h1>
            </div>
            <div className="text-center">
              <h3 className="text-md mb-2">
                Líder en productos de belleza
              </h3>
            </div>
          {/* Descripción */}
          <div className="text-left p-4 modal-container-grid-purple">
            <p className="text-md font-montserrat">
              {props.consultant.aboutYou ??
                "Mi pasión es ayudar a las personas a sentirse y verse bien. Me encanta compartir mis conocimientos sobre el cuidado de la piel y el maquillaje, y estoy aquí para ayudarte a encontrar los productos perfectos para ti."}
            </p>
          </div>
            {/* Contáctame */}
            <div>
              <h2 className="text-md font-semibold mb-2">Contáctame por:</h2>
              <div className="flex gap-4 justify-center">
                {/* WhatsApp */}
                {props.consultant.phone && (
                  <a
                    href={`https://wa.me/${props.consultant.phone.replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <RiWhatsappFill className="text-3xl icon-green" />
                    <p className="text-sm ">WhatsApp</p>
                  </a>
                )}
                {/* Facebook */}
                {props.consultant.facebook && (
                  <a
                    href={
                      props.consultant.facebook.startsWith("http")
                        ? props.consultant.facebook
                        : `https://www.facebook.com/${props.consultant.facebook}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <FaFacebookSquare className="text-3xl icon-blue" />
                    <p className="text-sm">Facebook</p>
                  </a>
                )}
                {/* Instagram */}
                {props.consultant.instagram && (
                  <a
                    href={
                      props.consultant.instagram.startsWith("http")
                        ? props.consultant.instagram
                        : `https://www.instagram.com/${props.consultant.instagram}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <FaInstagram className="text-3xl" />
                    <p className="text-sm">Instagram</p>
                  </a>
                )}
              </div>
            </div>
                   {/* Experiencia, certificados y ventas */}
              <div>
                <h2 className="text-md font-semibold mb-2">Sobre mí</h2>
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
                {/* Experiencia */}
                <div className="flex items-center gap-4">
                  {/* Ícono a la izquierda */}
                    <img
                      src="/images/Iconos_anios.svg"
                      alt="Icono rostro"
                      className="icon-small"
                    />
                  {/* Texto a la derecha */}
                  <div className="flex flex-col">
                    <h4 className="text-xl font-bold">Experiencia</h4>
                    <p className="text-sm">
                      {props.consultant.experience ?? "10 años"}
                    </p>
                  </div>
                </div>
                {/* Certificados */}
                <div className="flex items-center gap-4">
                  {/* Ícono a la izquierda */}
                  <img
                      src="/images/Iconos_rostro.svg"
                      alt="Icono rostro"
                      className="icon-small"
                    />
                  {/* Texto a la derecha */}
                  <div className="flex flex-col">
                    <h4 className="text-xl font-bold">Certificaciones</h4>
                    <p className="text-sm">
                      {props.consultant.certificates ?? "Cuidado de la piel"}
                    </p>
                  </div>
                </div>
                {/* Ventas */}
                <div className="flex items-center gap-4">
                  {/* Ícono a la izquierda */}
                    <img
                      src="/images/Iconos_ventas.svg"
                      alt="Icono rostro"
                      className="icon-small"
                    />
                  {/* Texto a la derecha */}
                  <div className="flex flex-col">
                    <h4 className="text-xl font-bold">Nivel en ventas</h4>
                    <p className="text-sm">
                      {props.consultant.salesLevel ?? "Top"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Comprar conmigo */}
            <div className="text-center mt-4">
              <a
                id="consultant-card-select-insider"
                className="h-10 bg-mine-shaft text-white hover:bg-black rounded flex items-center justify-center px-10 gap-x-2 no-underline cursor-pointer"
                href={`https://jafra-mx.myshopify.com/?pws=${props.consultant.siteName}`}
                target="_parent"
              >
                <IoBagOutline className="text-2xl" />
                Comprar conmigo
              </a>
            </div>
            {/* Productos estrella */}
              {props.consultant.pickedProductsFromPartner?.length > 0 && (
                <div>
                  <h2 className="text-md font-semibold mb-2">Mis productos estrella</h2>
                  <div className="flex gap-4 overflow-x-scroll scrollbar-hide pb-2">
                    {props.consultant.pickedProductsFromPartner.map((product, index) => (
                      <div
                        key={index}
                        className="min-w-[140px] max-w-[160px] bg-white shadow-md rounded-lg p-3 flex flex-col gap-2 h-[270px]"
                      >
                        <p className="text-sm font-semibold mt-2 text-center line-clamp-2 font-bold">
                          {product.title}
                        </p>
                        <Image
                          src={product.featuredImage?.url || "/default-product.jpg"}
                          alt={product.featuredImage?.altText || product.title}
                          className="h-24 w-full object-cover"
                          width={100}
                          height={90}
                        />
                        {product.feedback && (
                          <p className="text-xs italic text-center mt-1 text-gray-500">
                            “{product.feedback}”
                          </p>
                        )}
                        <a
                          href={`https://jafra-mx.myshopify.com/products/${product.handle}?pws=${props.consultant.siteName}`}
                          id= "view-products"
                          rel="noopener noreferrer"
                          className="mt-auto bg-purple-600 text-white py-1 rounded hover:bg-purple-700 text-sm text-center w-full max-w-[130px] self-center"
                        >
                          Ver producto
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantViewDetails;