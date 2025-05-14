import { useContext, useMemo, useState, useEffect, useCallback } from "react";

import { SubmitIcon, BackIcon } from "../components/Icons";
import ConsultantCard from "./ConsultantCard";
import ConsultantViewDetails from "./ConsultantViewDetails";
import { ConsultantSelectedContext } from "./ConsultantFinder";
import Image from "next/image";

import KnowConsultantImage from "/public/images/knowConsultant.jpeg";
import AvatarImage from "/public/images/avatar.png";

export default function ConsultantSearch(props) {
  // Estados para manejar los resultados y otros estados
  const [searchResults, setSearchResults] = useState(null); // Almacena los resultados de la búsqueda
  const {
    consultantSelected,
    setConsultantSelected,
    modalState,
    setModalState,
  } = useContext(ConsultantSelectedContext); // Contexto para manejar el consultor seleccionado y el estado del modal
  const [selectedConsultant, setSelectedConsultant] = useState(null); // Consultor seleccionado
  const [loadingConsultants, setLoadingConsultants] = useState(false); // Estado de carga de consultores
  const [showWarning, setShowWarning] = useState(false); // Muestra advertencias si el input está vacío

  // Función para buscar consultores por sitio web
  const findConsultantByWebsite = async (query) => {
    if (query.trim().length === 0) {
      // Si el input está vacío, muestra una advertencia
      setShowWarning(true);
    } else {
      setShowWarning(false);
      setSelectedConsultant(false);
      setLoadingConsultants(true); // Activa el estado de carga

      // Construye la URL para la búsqueda
      let url = `https://ona4umtl22.execute-api.us-west-2.amazonaws.com/Prod/partners/partner-search?searchType=LOCATOR&locator=${query.replace(
        " ",
        "%20"
      )}`;

      let options = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      // Realiza la solicitud a la API
      fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
          // Si hay resultados, los almacena en el estado
          json.partners
            ? setSearchResults(json.partners)
            : setSearchResults(null);
          console.log(json.partners);
          setLoadingConsultants(false); // Desactiva el estado de carga
        })
        .catch((err) => console.error("error:" + err));
    }
  };

  // Realiza la búsqueda automáticamente cuando `props.searchQuery` cambie
  useEffect(() => {
    if (props.searchQuery) {
      findConsultantByWebsite(props.searchQuery);
    }
  }, [props.searchQuery]);

    // Función para establecer un consultor preferido
    const setPrefPartner = () => {
      let data = {
        type: "setPrefPartner",
        data: selectedConsultant,
      };
      parent.postMessage(data, "*"); // Envía un mensaje al padre (probablemente un iframe)
  
      setModalState("confirmation"); // Cambia el estado del modal a "confirmation"
    };
  
    // Muestra los detalles de un consultor seleccionado
const viewDetails = async (event, consultant) => {
  event.preventDefault();
  setLoadingDetails(true);

  try {
    const response = await fetch(
      `https://ona4umtl22.execute-api.us-west-2.amazonaws.com/Prod/partners/partner-search?searchType=EMAIL&email=${consultant.email}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();
    const enriched = data?.partners?.[0];

    if (enriched) {
      setSelectedConsultant({ ...consultant, ...enriched });
    } else {
      setSelectedConsultant(consultant);
    }
  } catch (error) {
    console.error("Error fetching consultant details:", error);
    setSelectedConsultant(consultant);
  } finally {
    setLoadingDetails(false);
  }
};


  
    // Maneja la selección de un consultor en la lista
    const radioClickHandler = (event, consultant) => {
      var radioButtons = document.getElementsByClassName("consultant-card");
  
      // Deselecciona todos los botones de radio
      for (let i = 0; i < radioButtons.length; i++) {
        radioButtons[i].classList.remove("consultant-card__selected");
        radioButtons[i].classList.add("consultant-card__unselected");
      }
  
      // Selecciona el botón de radio actual
      event.target.classList.remove("consultant-card__unselected");
      event.target.classList.add("consultant-card__selected");
  
      setSelectedConsultant(consultant); // Establece el consultor seleccionado
    };
  
    // Función para manejar la selección de un consultor
    const selectConsultantHandler = useCallback(
      (consultant) => {
        let data = {
          type: "setPrefPartner",
          data: consultant,
        };
        parent.postMessage(data, "*"); // Envía un mensaje al padre
  
        setModalState("confirmation"); // Cambia el estado del modal a "confirmation"
      },
      [setModalState]
    );
  
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Renderiza la lista de consultores
  const renderConsultantList = useMemo(() => {
    if (searchResults !== null) {
      const list = searchResults.map((consultant, i) => {
        return (
          <ConsultantSelectedContext.Provider
            value={{ consultantSelected, setConsultantSelected }}
            key={i}
          >
            <ConsultantCard
              consultant={consultant}
              number={i + 1}
              key={i}
              selectConsultantHandler={() =>
                setSelectedConsultant(consultant)
              }
              viewDetailsHandler={(e) => viewDetails(e, consultant)}
              distance={false}
              dict={props.dict}
            />
          </ConsultantSelectedContext.Provider>
        );
      });
      if (list.length === 0) {
        // Si no hay resultados, muestra un mensaje
        return (
          <div className="flex flex-col justify-center items-center gap-2 h-full mt-16">
            <div>{props.dict.i_know_an_insider.no_results}</div>
          </div>
        );
      } else {
        // Si hay resultados, los muestra en una lista
        return (
          <>   
            <div className=" my-3 results-list__heading">
              {searchResults.length}{" "}
              {props.dict.i_know_an_insider.results_found}
            </div>
            
            {showWarning ? (
                <div class="search-warning">
                  {props.dict.match_insider.input_placeholder}
                </div>
              ) : null}
            <div className="flex flex-col gap-2 overflow-auto max-h-450">
              {list}
            </div>
          </>
        );
      }
    }
  },  [
    searchResults,
    consultantSelected,
    props.dict,
    setConsultantSelected,
    selectConsultantHandler,
  ]);

    // Maneja el cambio en el input de búsqueda
    const inputHandler = (event) => {
      setSearchQuery(event.target.value);
    };

  // Renderiza un mensaje de carga
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
        <span className="sr-only"> {props.dict.i_know_an_insider.loading}</span>
      </div>
    );
  }, [props.dict]);

// Renderiza el componente principal
return selectedConsultant ? (
  // Si hay un consultor seleccionado, muestra los detalles
  <>
      <div className="modal-container h-screen lg:h-full ">
        <div className="modal flex lg:grid modal-container-grid w-full p-4 lg:p-8">
        <div className="modal__left flex flex-col w-full">
          <div>
            <div className="flex flex-col gap-2 overflow-auto max-h-450">
              <div
                className="close-modal flex items-center gap-2 mb-10"
                onClick={props.returnToStartHandler}
              >
                <BackIcon color="#272727" />
                <p>{props.dict.find_your_insider.go_back}</p>
              </div>
              <div className="flex justify-center items-center mb-6">
                <Image
                  src={AvatarImage}
                  alt="Default Avatar"
                  width={100}
                  height={100}
                />
              </div><br/>

              <div className="modal-heading w-10%">
                {props.dict.match_insider.h1}
              </div>
              <br />
              <p className="hidden lg:block mb-6">
                {props.dict.match_insider.body}
              </p>
               <form
              onSubmit={(e) => {
                e.preventDefault();
                const isZipCode = /^\d+$/.test(props.searchQuery);
                props.setSearchType(isZipCode ? "locator" : "consultantSearch");
              }}
              className="relative"
            >
              <input
                type="text"
                placeholder={props.dict.find_your_insider.input_placeholder}
                className="py-3 px-4 block w-full border border-border-gray rounded-lg shadow-sm text-base focus:z-10"
                value={props.searchQuery}
                onChange={(e) => props.setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center z-20 rounded-lg">
                <button type="submit">
                  <SubmitIcon />
                </button>
              </div>
            </form>
              {showWarning ? (
                <div class="search-warning">
                  {props.dict.match_insider.input_placeholder}
                </div>
              ) : null}
            </div>
            <div>{renderConsultantList}</div>
          </div>
        </div>
        <ConsultantViewDetails
          consultant={selectedConsultant}
          goBackHandler={() => setSelectedConsultant(null)}
          selectConsultantHandler={setPrefPartner}
          dict={props.dict}
        />
      </div>
    </div>
  </>
) : (
  // Si no hay un consultor seleccionado, muestra el formulario de búsqueda
  <>
    <div className="modal-container h-screen lg:h-full">
      <div className="modal flex lg:grid modal-container-grid w-full p-4 lg:p-8">
        <div className="modal__left flex flex-col w-full">
          <div
            className="close-modal flex items-center gap-4 mb-9"
            onClick={props.returnToStartHandler}
          >
            <BackIcon color="#272727" />
            <p>{props.dict.find_your_insider.go_back}</p>
          </div>
          <div className="flex justify-center items-center mb-6">
            <Image
              className="lg:w-full lg:h-full object-cover"
              src="/images/knowConsultant.jpeg"
              alt="Consultant Locator Modal Search"
            />
          </div><br/>
            <div className="modal-heading w-10%">
            {props.dict.match_insider.h1}
          </div>
          <br/>
          <p className="hidden lg:block mb-6">
            {props.dict.match_insider.body}
          </p>
           <form
              onSubmit={(e) => {
                e.preventDefault();
                const isZipCode = /^\d+$/.test(props.searchQuery);
                props.setSearchType(isZipCode ? "locator" : "consultantSearch");
              }}
              className="relative"
            >
              <input
                type="text"
                placeholder={props.dict.find_your_insider.input_placeholder}
                className="py-3 px-4 block w-full border border-border-gray rounded-lg shadow-sm text-base focus:z-10"
                value={props.searchQuery}
                onChange={(e) => props.setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center z-20 rounded-lg">
                <button type="submit">
                  <SubmitIcon />
                </button>
              </div>
            </form>

          {showWarning ? (
            <div class="search-warning text-pink-700">
              {props.dict.match_insider.input_placeholder}
            </div>
          ) : null}
          {loadingConsultants ? (
            <div className="flex flex-col justify-center items-center gap-2 h-full mt-16">
              <p> {props.dict.match_insider.loading_insiders}</p>
              {renderLoadingMessage}
            </div>
          ) : (
            renderConsultantList
          )}
        </div>
        <div className="hidden lg:block">
          <Image
            className="lg:w-full lg:h-full object-cover"
            src={KnowConsultantImage}
            alt="Consultant Locator Modal Search"
          />
        </div>
      </div>
    </div>
  </>
);
}