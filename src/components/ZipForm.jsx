import React, { useContext, useState } from "react";
import { SubmitIcon } from "../components/Icons";
import { UserContext } from "./Locator";
import { useTranslation } from "react-i18next";

const ZipForm = (props) => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const { showWarning, setShowWarning } = useContext(UserContext);
  let { t } = useTranslation();

  const zipCheck = (event) => {
    var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(event.target.value);

    if (isValidZip) {
      setButtonDisabled(false);
      setShowWarning(false);
    } else {
      setButtonDisabled(true);
    }
  };

  const submitHandler = (event) => {
    if (buttonDisabled) {
      event.preventDefault();
      setShowWarning(true);
    } else {
      setShowWarning(false);

      props.updateOrigin(event);
    }
  };
  return (
    <form onSubmit={submitHandler}>
      {showWarning ? (
        <div class="search-warning">
          {props.dict.match_insider.zip_error_msg}
        </div>
      ) : null}

      <div className="relative">
        <input
          type="text"
          id="hs-trailing-icon"
          name="zip"
          className="name-input py-3 px-4 pr-11 block w-full border border-border-gray shadow-sm rounded-md text-base focus:z-10"
          placeholder={props.dict.match_insider.input_placeholder}
          onChange={zipCheck}
        />
        <div className="absolute inset-y-0 right-0 flex items-center z-20 pr-4">
          <button type="submit">
            <SubmitIcon disabled={buttonDisabled} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ZipForm;
