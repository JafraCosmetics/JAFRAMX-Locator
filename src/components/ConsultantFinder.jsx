"use client"; // This is a client component 👈🏽

import React, { useMemo, useState, useEffect } from "react";
import { CloseIcon, CheckIcon } from "../components/Icons";
import Locator from "./Locator";
// import consultantLanding from "/consultant-landing.jpeg";
import ConsultantSearch from "./ConsultantSearch";

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

  const startBody = () => {
    return (
      <div className="modal-container">
        <div className="modal grid md:grid-cols-2-3">
          <div className="p-4 md:p-6 h-280 order-2 md:order-1 ">
            <div
              data-close-modal="find-your-consultant"
              className="hidden md:block cursor-pointer"
            >
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

            <div className="flex flex-col gap-3">
              <button
                className="bg-mine-shaft text-white hover:bg-black capitalize w-full py-4 rounded"
                onClick={handleKnowConsultant}
              >
                {props.dict.find_your_insider.know_btn}
              </button>
              <button
                className="bg-white text-black hover:bg-black capitalize w-full py-4 rounded border-2 border-black"
                onClick={handleFindConsultant}
              >
                {props.dict.find_your_insider.match_btn}
              </button>
            </div>
          </div>
          <div className="order-1 md:order-2 md:h-unset">
            <div
              data-close-modal="find-your-consultant"
              className="md:hidden cursor-pointer absolute top-2 left-2"
            >
              <CloseIcon
                className="close-icon"
                onClick={closeModal}
                pathFill="#eeeeee"
                circleFill="#717171"
              />
            </div>
            <img
              className="w-full md:h-720 object-cover rounded-r-lg"
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
      <div className="modal-container flex flex-col h-full md:h-720 md:w-1080">
        <div className="hidden md:block cursor-pointer">
          <CloseIcon className="close-icon" onClick={closeModal} />
        </div>
        <div className="modal justify-center items-center flex flex-col gap-9 p-4 w-full h-full">
          <div className="flex flex-col justify-center items-center gap-4">
            <CheckIcon />
            <p className="modal-heading text-center">
              {props.dict.selection_confirmation.confirm_msg}
            </p>
          </div>
          <button
            onClick={() => closeModal()}
            className="bg-mine-shaft text-white hover:bg-black capitalize w-full md:w-1/3 py-4 rounded"
          >
            {props.dict.selection_confirmation.close_btn}
          </button>
        </div>
      </div>
    );
  };

  const getModalBody = () => {
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
  };

  useMemo(() => {
    getModalBody();
  }, [modalState]);

  return (
    <div
      id="consultant-locator-modal"
      className="relative w-auto mx-auto max-w-1080 flex justify-center items-center  overflow-hidden md:w-unset"
    >
      {/*content*/}
      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <div className="relative flex-auto">{modalBody}</div>
      </div>
    </div>
  );
}
