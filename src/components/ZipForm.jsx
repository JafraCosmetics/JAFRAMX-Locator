//zipform
import React, { useContext, useState } from "react";
import { SubmitIcon } from "../components/Icons";
import { UserContext } from "./ConsultantFinder";

const ZipForm = (props) => {
  const [inputValue, setInputValue] = useState("");
  const { showWarning, setShowWarning } = useContext(UserContext);

 const submitHandler = (event) => {
  event.preventDefault();

  if (inputValue.trim().length === 0) {
    setShowWarning(true);
    return;
  }

  setShowWarning(false);

  if (/^\d{4,6}$/.test(inputValue)) {
    props.setSearchQuery(inputValue); // Esto se envía al padre (Finder)
    props.setSearchType("locator");
  } else {
    props.setSearchQuery(inputValue);
    props.setSearchType("consultantSearch");
  }
};

  return (
    <form onSubmit={submitHandler}>
      {showWarning && (
        <div className="search-warning">
          {props.dict.match_insider.zip_error_msg}
        </div>
      )}
      <div className="relative">
        <input
          type="text"
          class="py-3 px-4 block w-full border border-border-gray rounded-lg shadow-sm text-base focus:z-10"         
          placeholder={props.dict.match_insider.input_placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center z-20 rounded-lg">
          <button type="submit">
            <SubmitIcon />
          </button>
        </div>
      </div>
    </form>
  );
};


export default ZipForm;