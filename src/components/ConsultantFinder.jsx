"use client"; // This is a client component 👈🏽
import React, { useState, useCallback, createContext } from "react";
import Locator from "./Locator";
import ConsultantSearch from "./ConsultantSearch";
import { CloseIcon, SubmitIcon } from "../components/Icons";
import Image from "next/image";
import AvatarImage from "/public/images/avatar.png";
import ConsultantLanding from "/public/images/consultantLanding.jpeg";

// Crear el contexto
export const ConsultantSelectedContext = createContext(null);
export const UserContext = createContext(null);

export default function ConsultantFinder(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState(null); // "locator" o "consultantSearch"
  const [modalState, setModalState] = useState("start"); // "start", "results"
  const [consultantSelected, setConsultantSelected] = useState(null);

  const closeModal = () => {
    setModalState("start");
    setSearchQuery("");
    setSearchType(null);
    parent.postMessage({ type: "closeModal" }, "*");
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (searchQuery.trim().length === 0) {
      alert("Por favor, ingresa un término de búsqueda.");
      return;
    }

    // Detectar el tipo de búsqueda
    const isZipCode = /^\d+$/.test(searchQuery); // Solo números
    if (isZipCode) {
      setSearchType("locator");
    } else {
      setSearchType("consultantSearch");
    }

    setModalState("results");
  };

  const getModalBody = useCallback(() => {
    if (modalState === "start") {
      return (
        <div className="modal-container">
          <div className="modal flex flex-col lg:grid lg:modal-container-grid lg:p-8">
            <div className="modal__left order-2 p-4 lg:order-1">
              <div className="close-button hidden lg:block cursor-pointer absolute top-6 left-6">
                <CloseIcon className="close-icon" onClick={closeModal} />
              </div>
              {/* Logo Jafra centrada */}
              <div className="flex justify-center items-center mb-6">
                <Image
                  src={AvatarImage}
                  alt="Default Avatar"
                  width={100}
                  height={100}
                />
              </div>
              <br />
              <div className="modal-heading jafra-purple font-bold object-contain">
                {props.dict.match_insider.h1}
              </div>
              <br />
              <p className="hidden lg:block mb-6 ">
                {props.dict.match_insider.body}
              </p>

              {/* Input de búsqueda con botón */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={props.dict.find_your_insider.input_placeholder}
                  className="py-3 px-4 block w-full border border-border-gray rounded-lg shadow-sm text-base focus:z-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center z-20 rounded-lg">
                  <button type="submit">
                    <SubmitIcon />
                  </button>
                </div>
              </form>
            </div>
            <div className="order-1 lg:order-2 lg:h-unset">
              <div className="close-button lg:hidden cursor-pointer absolute top-2 left-2">
                <CloseIcon
                  className="close-icon"
                  onClick={closeModal}
                  pathFill="#eeeeee"
                />
              </div>
              <Image
                className="lg:w-full lg:h-full object-cover"
                src={ConsultantLanding}
                alt="Consultant Locator Modal"
              />
            </div>
          </div>
        </div>
      );
    }
    if (modalState === "results") {
      if (searchType === "locator") {
        return (
          <ConsultantSelectedContext.Provider
            value={{
              consultantSelected,
              setConsultantSelected,
              setModalState,
            }}
          >
          <Locator
            zipcode={searchQuery} // Código postal
            dict={props.dict} // Objeto `dict` que contiene los textos
            returnToStartHandler={() => setModalState("start")} // Función para manejar el retorno
          />
          </ConsultantSelectedContext.Provider>
        );
      } else if (searchType === "consultantSearch") {
        return (
          <ConsultantSelectedContext.Provider
            value={{
              consultantSelected,
              setConsultantSelected,
              setModalState,
            }}
          >
            <ConsultantSearch
              searchQuery={searchQuery}
              returnToStartHandler={() => setModalState("start")}
              dict={props.dict}
            />
          </ConsultantSelectedContext.Provider>
        );
      }
    }
  }, [modalState, searchQuery, searchType, props.dict, consultantSelected]);

  return (
    <div
      id="consultant-locator-modal"
      className="relative w-auto mx-auto flex justify-center items-center overflow-hidden lg:w-unset"
    >
      {/*content*/}
      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <div className="relative flex-auto">{getModalBody()}</div>
      </div>
    </div>
  );
}