import {Fragment, useState} from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react';
import {AccordionOpenIcon, AccordionCloseIcon} from './Icons';

const MapAccordion = (props) => {
  const [open, setOpen] = useState();

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div className="px-6">
      <Fragment>
        <Accordion open={open === 1}>
          <AccordionHeader onClick={() => handleOpen(1)}>
            <div className="flex flex-cols items-center gap-2">
              {open ? <AccordionCloseIcon /> : <AccordionOpenIcon />}
              View Map
            </div>
          </AccordionHeader>
          <AccordionBody>{props.body}</AccordionBody>
        </Accordion>
      </Fragment>
    </div>
  );
};
export default MapAccordion;
