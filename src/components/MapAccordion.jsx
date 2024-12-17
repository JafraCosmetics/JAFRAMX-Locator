import { Fragment, useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { AccordionOpenIcon, AccordionCloseIcon } from "./Icons";

const MapAccordion = () => {
  const [open, setOpen] = useState();

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div className="">
      <Fragment>
        <Accordion open={open === 1}>
          <AccordionHeader onClick={() => handleOpen(1)}>
            <div className="flex flex-cols items-center gap-2">
              {open ? <AccordionCloseIcon /> : <AccordionOpenIcon />}
              View Map
            </div>
          </AccordionHeader>
          <AccordionBody>
            <div
              id="map-mobile"
              style={{ height: "100%", width: "100%", minHeight: "300px" }}
            ></div>
          </AccordionBody>
        </Accordion>
      </Fragment>
    </div>
  );
};
export default MapAccordion;
