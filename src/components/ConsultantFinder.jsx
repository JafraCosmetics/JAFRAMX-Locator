"use client"; // This is a client component 👈🏽

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { CloseIcon, CheckIcon, ArrowIcon } from "../components/Icons";
import Locator from "./Locator";
import ConsultantSearch from "./ConsultantSearch";
import Image from "next/image";

export const ConsultantSelectedContext = React.createContext(null);

export default function ConsultantFinder(props) {
  const [modalBody, setModalBody] = useState();
  const [modalState, setModalState] = useState("start");
  const [consultantSelected, setConsultantSelected] = useState(false);

  useEffect(() => {}, [consultantSelected]);

  const handleFindConsultant = () => {
    setModalState("find");
  };
  const handleKnowConsultant = () => {
    setModalState("know");
  };

  const handleStartConsultant = () => {
    setModalState("start");
  };

  const closeModal = () => {
    setModalState("start");
    let data = {
      type: "closeModal",
    };
    parent.postMessage(data, "*"); //  `*` on any domain
  };

  const getModalBody = useCallback(() => {
    const startBody = () => {
      return (
        <div className="modal-container">
          <div className="modal flex flex-col lg:grid lg:modal-container-grid lg:p-8">
            <div className="modal__left order-2 p-4 lg:order-1">
              <div className="close-button hidden lg:block cursor-pointer absolute top-6 left-6">
                <CloseIcon className="close-icon" onClick={closeModal} />
              </div>

              <div className="my-6">
                <div as="h1" className="modal-heading mb-3">
                  {props.dict.find_your_insider.title}
                </div>

                <div className="modal-text mb-6">
                  {props.dict.find_your_insider.body}
                </div>
              </div>

              <div className="flex flex-col gap-3 items-center md:items-start">
                <button
                  className="bg-jafra-purple text-white hover:bg-black capitalize max-w-80 p-4 rounded font-bold w-80"
                  onClick={handleKnowConsultant}
                >
                  {props.dict.find_your_insider.know_btn}
                </button>
                <button
                  className="bg-white text-jafra-purple hover:bg-black capitalize max-w-80 p-4 rounded border-2 border-jafra-purple font-bold flex gap-2 justify-center items-center w-80"
                  onClick={handleFindConsultant}
                >
                  {props.dict.find_your_insider.match_btn}
                  <ArrowIcon />
                </button>
              </div>
            </div>
            <div className="order-1 lg:order-2 lg:h-unset">
              <div className="close-button lg:hidden cursor-pointer absolute top-2 left-2">
                <CloseIcon
                  className="close-icon"
                  onClick={closeModal}
                  pathFill="#eeeeee"
                  // circleFill="#717171"
                />
              </div>
              <Image
                className="lg:w-full lg:h-full object-cover"
                src="/images/consultantLanding.jpeg"
                alt="Consultant Locator Modal"
              />
            </div>
          </div>
        </div>
      );
    };

    const confirmationBody = () => {
      return (
        <div className="modal-container flex flex-col">
          <div className="modal justify-center items-center flex flex-col gap-9 p-4 w-full h-full">
            <div className="hidden lg:block cursor-pointer absolute top-6 left-6">
              <CloseIcon className="close-icon" onClick={closeModal} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <CheckIcon />
              <p className="modal-heading text-center">
                {props.dict.selection_confirmation.confirm_msg}
              </p>
            </div>
            <button
              onClick={() => closeModal()}
              className="bg-mine-shaft text-white hover:bg-black capitalize w-full lg:w-1/3 py-4 rounded"
            >
              {props.dict.selection_confirmation.close_btn}
            </button>
          </div>
        </div>
      );
    };

    setModalBody(startBody());

    if (modalState === "start") {
      setModalBody(startBody());
    } else if (modalState === "know") {
      setModalBody(
        <ConsultantSelectedContext.Provider
          value={{
            consultantSelected,
            setConsultantSelected,
            modalState,
            setModalState,
          }}
        >
          <ConsultantSearch
            returnToStartHandler={handleStartConsultant}
            goToFindHandler={handleFindConsultant}
            dict={props.dict}
          />
        </ConsultantSelectedContext.Provider>
      );
    } else if (modalState === "find") {
      setModalBody(
        <ConsultantSelectedContext.Provider
          value={{
            consultantSelected,
            setConsultantSelected,
            modalState,
            setModalState,
          }}
        >
          <Locator
            returnToStartHandler={handleStartConsultant}
            goToKnowHandler={handleKnowConsultant}
            dict={props.dict}
          />
        </ConsultantSelectedContext.Provider>
      );
    } else if (modalState === "confirmation") {
      setModalBody(confirmationBody);
    }
  }, [consultantSelected, modalState, props.dict]);

  useMemo(() => {
    getModalBody();
  }, [getModalBody]);

  return (
    <div
      id="consultant-locator-modal"
      className="relative w-auto mx-auto  flex justify-center items-center  overflow-hidden lg:w-unset"
    >
      {/*content*/}
      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <div className="relative flex-auto">{modalBody}</div>
      </div>
    </div>
  );
}
