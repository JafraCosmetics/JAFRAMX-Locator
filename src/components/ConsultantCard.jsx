import Image from "next/image";
import AvatarImage from "/public/images/avatar.png";
import { Avatar } from "@material-tailwind/react";

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
      className="consultant-card flex gap-4 consultant-card__unselected max-h-860 cursor-default border border-senegence-purple rounded-md	"
      id={"consultant-card-" + props.consultant.email}
      key={props.consultant.email}
    >
      <div className="flex items-start justify-start lg:block">
        <Avatar
          src={props.consultant.profileImage ?? AvatarImage.src}
          className="w-8 lg:w-14 rounded-full"
        />
      </div>
      <div className="flex flex-col justify-evenly w-full">
        {/* <Image
          name={props.consultant.displayName}
          className="hidden h-12 w-12 rounded"
          fill={true}
          src={
            props.consultant.profileImage
              ? props.consultant.profileImage
              : AvatarImage
          }
          alt="profile image"
        /> */}
        <div className="flex justify-between">
          <div className="consultant-box__name">
            {props.consultant.displayName}
          </div>
          {props.distance ? (
            <p className="consultant-box__location">
              {props.consultant.distance} {props.dict.consultant_card.distance}
            </p>
          ) : null}
        </div>
        {/* {props.consultant.defaultAddress ? renderLocation(props) : null} */}

        <div className="flex justify-between">
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
