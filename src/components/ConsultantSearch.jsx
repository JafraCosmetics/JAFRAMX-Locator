//search
import { useContext, useMemo, useState, useEffect, useCallback } from "react";
import { SubmitIcon, BackIcon } from "../components/Icons";
import ConsultantCard from "./ConsultantCard";
import ConsultantViewDetails from "./ConsultantViewDetails";
import { ConsultantSelectedContext } from "./ConsultantFinder";
import Image from "next/image";

export default function ConsultantSearch(props) {
  const [searchResults, setSearchResults] = useState(null);
  const {
    consultantSelected,
    setConsultantSelected,
    modalState,
    setModalState,
  } = useContext(ConsultantSelectedContext);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [loadingConsultants, setLoadingConsultants] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const findConsultantByWebsite = async (query) => {
    if (query.trim().length === 0) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      setSelectedConsultant(null);
      setLoadingConsultants(true);

      const url = `https://ona4umtl22.execute-api.us-west-2.amazonaws.com/Prod/partners/partner-search?searchType=LOCATOR&locator=${encodeURIComponent(query)}`;
      const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      try {
        const res = await fetch(url, options);
        const json = await res.json();
        setSearchResults(json.partners || null);
        setLoadingConsultants(false);
      } catch (err) {
        console.error("error:" + err);
      }
    }
  };

    useEffect(() => {
      if (props.autoSearch && props.searchQuery) {
        findConsultantByWebsite(props.searchQuery);
      }

    }, []);


  const setPrefPartner = () => {
    parent.postMessage({ type: "setPrefPartner", data: selectedConsultant }, "*");
    setModalState("confirmation");
  };

  const viewDetails = async (event, consultant) => {
    event.preventDefault();
    setLoadingDetails(true);

    try {
      const response = await fetch(
        `https://ona4umtl22.execute-api.us-west-2.amazonaws.com/Prod/partners/partner-search?searchType=EMAIL&email=${consultant.email}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      const data = await response.json();
      const enriched = data?.partners?.[0];
      setSelectedConsultant({ ...consultant, ...(enriched || {}) });
    } catch (error) {
      console.error("Error fetching consultant details:", error);
      setSelectedConsultant(consultant);
    } finally {
      setLoadingDetails(false);
    }
  };

  const selectConsultantHandler = useCallback((consultant) => {
    parent.postMessage({ type: "setPrefPartner", data: consultant }, "*");
    setModalState("confirmation");
  }, [setModalState]);

  const renderConsultantList = useMemo(() => {
    if (searchResults !== null) {
      if (searchResults.length === 0) {
        return (
          <div className="flex flex-col justify-center items-center gap-2 h-full mt-16">
            <div>{props.dict.i_know_an_insider.no_results}</div>
          </div>
        );
      }

      return (
        <>
          <div className="my-3 results-list__heading">
            {searchResults.length} {props.dict.i_know_an_insider.results_found}
          </div>
          {showWarning && (
            <div className="search-warning text-pink-700">
              {props.dict.match_insider.input_placeholder}
            </div>
          )}
          <div className="flex flex-col gap-2 overflow-auto max-h-[450px]">
            {searchResults.map((consultant, i) => (
              <ConsultantSelectedContext.Provider
                value={{ consultantSelected, setConsultantSelected }}
                key={i}
              >
                <ConsultantCard
                  consultant={consultant}
                  number={i + 1}
                  selectConsultantHandler={() => setSelectedConsultant(consultant)}
                  viewDetailsHandler={(e) => viewDetails(e, consultant)}
                  distance={false}
                  dict={props.dict}
                />
              </ConsultantSelectedContext.Provider>
            ))}
          </div>
        </>
      );
    }
  }, [searchResults, consultantSelected, props.dict, setConsultantSelected, selectConsultantHandler]);

  const renderLoadingMessage = useMemo(() => (
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591..." fill="#EEEEEE" />
        <path d="M93.9676 39.0409C96.393 38.4038..." fill="#8f4899" />
      </svg>
      <span className="sr-only">{props.dict.i_know_an_insider.loading}</span>
    </div>
  ), [props.dict]);

  return (
    <div className="modal-container min-h-screen lg:h-full">
      <div className="modal modal-container-grid w-full flex flex-col lg:flex-row p-4 lg:p-8 gap-6">
        <div className="modal__left w-full lg:w-1/2 flex flex-col">
          <div className="close-modal flex items-center gap-2 mb-10 cursor-pointer" onClick={props.returnToStartHandler}>
            <BackIcon color="#272727" />
            <p>{props.dict.find_your_insider.go_back}</p>
          </div>
          <div className="flex justify-center items-center mb-6">
            <Image src="/images/avatar.png" alt="Default Avatar" width={100} height={100} />
          </div>
          <div className="modal-heading jafra-purple font-bold">
            {props.dict.match_insider.h1}
          </div>
          <p className="hidden lg:block mb-6">{props.dict.match_insider.body}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const trimmed = props.searchQuery.trim();

              if (trimmed.length === 0) {
                setShowWarning(true);
                return;
              }

              setShowWarning(false);

              const isZipCode = /^\d{4,6}$/.test(trimmed);
              props.setSearchType(isZipCode ? "locator" : "consultantSearch");

              findConsultantByWebsite(trimmed);
            }}
            className="relative mb-4"
          >
            <input
              type="text"
              placeholder={props.dict.find_your_insider.input_placeholder}
              className="py-3 px-4 block w-full border border-border-gray rounded-lg shadow-sm text-base focus:z-10"
              value={props.searchQuery}
              onChange={(e) => props.setSearchQuery(e.target.value)} 
            />

            <div className="absolute inset-y-0 right-0 flex items-center z-20">
              <button type="submit">
                <SubmitIcon />
              </button>
            </div>
          </form>
          {showWarning && (
            <div className="search-warning text-pink-700">
              {props.dict.match_insider.input_placeholder}
            </div>
          )}
          {loadingConsultants ? (
            <div className="flex flex-col justify-center items-center gap-2 h-full mt-16">
              <p>{props.dict.match_insider.loading_insiders}</p>
              {renderLoadingMessage}
            </div>
          ) : (
            renderConsultantList
          )}
        </div>

        <div className="modal__right w-full lg:w-1/2 flex justify-center items-center">
          {loadingDetails ? (
            <div className="flex flex-col justify-center items-center h-full">
              <p className="text-lg font-semibold text-gray-600">
                {props.dict?.match_insider?.loading_profile || "Cargando perfil..."}
              </p>
              {renderLoadingMessage}
            </div>
          ) : selectedConsultant ? (
            <ConsultantViewDetails
              consultant={selectedConsultant}
              goBackHandler={() => setSelectedConsultant(null)}
              selectConsultantHandler={setPrefPartner}
              dict={props.dict}
            />
          ) : (
            <Image
              src="/images/knowConsultant.jpeg"
              alt="Know your consultant"
              width={500}
              height={500}
              className="hidden lg:block object-contain rounded-xl"
            />
          )}
        </div>
      </div>
    </div>
  );
}