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

  return selectedConsultant ? (
    <>
      <div className="modal-container h-full lg:h-860">
        <div className="modal p-4 w-full flex lg:grid lg:p-8 lg:modal-container-grid">
          <div className="hidden lg:flex flex-col justify-between w-full">
            <div>
              <div className="w-full lg:max-w-420">
                <div
                  className="close-modal flex items-center gap-2 mb-10"
                  onClick={props.returnToStartHandler}
                >
                  <BackIcon color="#272727" />
                  <p>{props.dict.find_your_insider.go_back}</p>
                </div>

                <div className="modal-heading w-10%">
                  {props.dict.i_know_an_insider.h1}
                </div>

                <p className="hidden lg:block mb-6">
                  {props.dict.i_know_an_insider.body}

                  <br />
                  <br />
                  <a className="cursor-pointer" onClick={props.goToFindHandler}>
                    {props.dict.i_know_an_insider.help_link}
                  </a>
                </p>

                <div className="search-heading mb-2">
                  {props.dict.i_know_an_insider.search_header}
                </div>
                {showWarning ? (
                  <div class="search-warning">
                    {props.dict.i_know_an_insider.input_placeholder}
                  </div>
                ) : null}
                <div className="relative">
                  <input
                    type="text"
                    id="searchByName"
                    name="searchByName"
                    className="name-input py-3 px-4 pr-11 block w-full border border-border-gray shadow-sm rounded-md text-base focus:z-10"
                    placeholder={props.dict.i_know_an_insider.input_placeholder}
                    onChange={inputHandler}
                    onKeyDown={(event) => handleKeyDown(event, "name")}
                    value={searchQuery}
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center z-20 pr-4"
                    onClick={findConsultantByWebsite}
                  >
                    <SubmitIcon />
                  </div>
                </div>
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
    <>
      <div className="modal-container h-screen lg:h-full">
        <div className="modal flex lg:grid modal-container-grid w-full p-4 lg:p-8">
          <div className="modal__left flex flex-col w-full lg:max-w-420 lg:max-h-665">
            {/* <div className=""> */}
            <div
              className="close-modal flex items-center gap-2 mb-6"
              onClick={props.returnToStartHandler}
            >
              <BackIcon color="#272727" />
              <p>{props.dict.find_your_insider.go_back}</p>
            </div>

            <div className="modal-heading ">
              {props.dict.i_know_an_insider.h1}
            </div>

            <p className="hidden lg:block mb-6">
              {props.dict.i_know_an_insider.body}

              <br />
              <br />
              <a className="cursor-pointer" onClick={props.goToFindHandler}>
                {props.dict.i_know_an_insider.help_link}
              </a>
            </p>

            <div className="search-heading mb-2">
              {props.dict.i_know_an_insider.search_header}
            </div>
            {showWarning ? (
              <div class="search-warning text-pink-700">
                {props.dict.i_know_an_insider.input_placeholder}
              </div>
            ) : null}
            <div className="relative">
              <input
                type="text"
                id="searchByName"
                name="searchByName"
                className="name-input py-3 px-4 pr-11 block w-full border border-border-gray shadow-sm rounded-md text-base focus:z-10"
                placeholder={props.dict.i_know_an_insider.input_placeholder}
                onChange={inputHandler}
                onKeyDown={(event) => handleKeyDown(event, "name")}
                value={searchQuery}
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center z-20 pr-4"
                onClick={findConsultantByWebsite}
              >
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