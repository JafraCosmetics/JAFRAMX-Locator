import { NumberedListIcon } from "./Icons";

const renderLocation = (props) => {
  if (props.consultant.defaultAddress) {
    if (
      props.consultant.defaultAddress.city &&
      props.consultant.defaultAddress.provinceCode
    ) {
      return (
        <p className="consultant-box__location">
          {props.dict.consultant_card.located_at}{" "}
          {props.consultant.defaultAddress.city},{" "}
          {props.consultant.defaultAddress.provinceCode}
        </p>
      );
    } else if (props.consultant.defaultAddress.city) {
      return (
        <p className="consultant-box__location">
          {props.dict.consultant_card.located_at}{" "}
          {props.consultant.defaultAddress.city}
        </p>
      );
    } else if (props.consultant.defaultAddress.provinceCode) {
      return (
        <p className="consultant-box__location">
          {props.dict.consultant_card.located_at}{" "}
          {props.consultant.defaultAddress.provinceCode}
        </p>
      );
    }
    return null;
  }
};
const ConsultantCard = (props) => {
  return (
    <div
      className="consultant-card flex gap-4 md:grid md:grid-cols-10-90 consultant-card__unselected py-4 px-6 max-h-720 cursor-default	"
      id={"consultant-card-" + props.consultant.email}
      key={props.consultant.email}
      // onClick={(event) => props.radioClickHandler(event, props.consultant)}
    >
      <div className="flex items-start justify-start">
        <NumberedListIcon className="h-8 w-8" number={props.number} />
      </div>
      <div className="flex flex-col gap-1">
        <img
          name={props.consultant.displayName}
          className="hidden h-12 w-12 rounded"
          src={
            props.consultant.profileImage
              ? props.consultant.profileImage
              : `https://randomuser.me/api/portraits/women/${props.number}.jpg`
          }
        />
        <div className="consultant-box__name">
          {props.consultant.displayName}
        </div>
        {props.distance ? (
          <p className="consultant-box__location">
            {props.consultant.distance} {props.dict.consultant_card.distance}
          </p>
        ) : null}
        {props.consultant.defaultAddress ? renderLocation(props) : null}

        <div className="flex gap-6">
          <a
            className="text-xs cursor-pointer"
            onClick={(event) =>
              props.viewDetailsHandler(event, props.consultant)
            }
          >
            {props.dict.consultant_card.view_details}
          </a>
          <a
            className="text-xs cursor-pointer"
            onClick={props.selectConsultantHandler}
          >
            {props.dict.consultant_card.select_insider}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConsultantCard;
