export const SubmitIcon = (props) => (
  <div viewBox="0 0 24 24">
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.07492 14.563C11.7568 14.563 14.7416 11.5783 14.7416 7.89633C14.7416 4.2144 11.7568 1.22961 8.07492 1.22961C4.39299 1.22961 1.4082 4.2144 1.4082 7.89633C1.4082 11.5783 4.39299 14.563 8.07492 14.563Z" stroke="#29243E" strokeWidth="1.50001" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.4082 16.2296L12.7832 12.6046" stroke="#29243E" strokeWidth="1.50001" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  </div>
);

export const BackIcon = (props) => (
  <div viewBox="0 0 20 20">
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="10"
        cy="10"
        r="10"
        transform="rotate(-180 10 10)"
        fill={props.color}
      />
      <path
        d="M11.25 6.6665L7.91667 9.99984L11.25 13.3332"
        stroke="white"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const NumberedListIcon = (props) => {
  return (
    <div height={props.height} width={props.width} viewBox="0 0 27 36">
      <svg
        width="27"
        height="36"
        viewBox="0 0 27 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M27 13.5C27 19.6453 18.7734 30.5859 15.1664 35.1C14.3016 36.1758 12.6984 36.1758 11.8336 35.1C8.22656 30.5859 0 19.6453 0 13.5C0 6.04688 6.04688 0 13.5 0C20.9531 0 27 6.04688 27 13.5Z"
          fill="#5A52B9"
        />
        <text
          className="numbered-text"
          textAnchor="middle"
          x="13.5"
          y="18"
          fill="white"
        >
          {props.number}
        </text>
      </svg>
    </div>
  );
};

export const CloseIcon = (props) => (
  <div onClick={props.onClick} viewBox="0 0 24 24">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 7L7 21" stroke="#29243E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 7L21 21" stroke="#29243E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export const PhoneIcon = () => (
  <div viewBox="0 0 20 20">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.7316 12.1477V14.2553C15.7324 14.4509 15.6923 14.6446 15.6139 14.8239C15.5355 15.0031 15.4206 15.164 15.2764 15.2963C15.1322 15.4286 14.962 15.5293 14.7767 15.592C14.5914 15.6546 14.395 15.6779 14.2001 15.6603C12.0383 15.4254 9.96179 14.6867 8.13734 13.5036C6.43993 12.425 5.00082 10.9859 3.92221 9.28844C2.73493 7.45571 1.99607 5.36907 1.76547 3.19758C1.74791 3.00331 1.771 2.80751 1.83326 2.62265C1.89552 2.4378 1.99559 2.26793 2.1271 2.12386C2.25861 1.9798 2.41868 1.86469 2.59711 1.78588C2.77554 1.70707 2.96842 1.66627 3.16349 1.66608H5.27105C5.61199 1.66273 5.94251 1.78346 6.20102 2.00578C6.45953 2.22809 6.62838 2.53682 6.67609 2.87442C6.76505 3.54889 6.93002 4.21113 7.16786 4.84851C7.26238 5.09996 7.28283 5.37323 7.2268 5.63595C7.17077 5.89867 7.04061 6.13982 6.85172 6.33083L5.95952 7.22303C6.9596 8.98182 8.41586 10.4381 10.1747 11.4382L11.0669 10.546C11.2579 10.3571 11.499 10.2269 11.7617 10.1709C12.0244 10.1148 12.2977 10.1353 12.5492 10.2298C13.1866 10.4677 13.8488 10.6326 14.5233 10.7216C14.8645 10.7697 15.1762 10.9416 15.399 11.2046C15.6218 11.4675 15.7401 11.8032 15.7316 12.1477Z" stroke="#5A52B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  </div>
);

export const EmailIcon = () => (
  <div viewBox="0 0 18 18">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2.99976H15C15.825 2.99976 16.5 3.67476 16.5 4.49976V13.4998C16.5 14.3248 15.825 14.9998 15 14.9998H3C2.175 14.9998 1.5 14.3248 1.5 13.4998V4.49976C1.5 3.67476 2.175 2.99976 3 2.99976Z" stroke="#5A52B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 4.5L9 9.75L1.5 4.5" stroke="#5A52B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  </div>
);

export const CheckIcon = () => (
  <div viewBox="0 0 36 36">
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 3C9.729 3 3 9.729 3 18C3 26.271 9.729 33 18 33C26.271 33 33 26.271 33 18C33 9.729 26.271 3 18 3ZM15.0015 24.6195L9.432 19.062L11.55 16.938L14.9985 20.3805L22.9395 12.4395L25.0605 14.5605L15.0015 24.6195Z"
        fill="#5A52B9"
      />
    </svg>
  </div>
);
export const WebIcon = () => (
  <div viewBox="0 0 19 19">
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 18C14.1944 18 18 14.1944 18 9.5C18 4.80558 14.1944 1 9.5 1C4.80558 1 1 4.80558 1 9.5C1 14.1944 4.80558 18 9.5 18Z" stroke="#5A52B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 9.5H18" stroke="#5A52B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.49979 1C11.6259 3.3276 12.8341 6.34823 12.8998 9.5C12.8341 12.6518 11.6259 15.6724 9.49979 18C7.3737 15.6724 6.16545 12.6518 6.09979 9.5C6.16545 6.34823 7.3737 3.3276 9.49979 1Z" stroke="#5A52B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  </div>
);

export const LocationPinIcon = () => (
  <div viewBox="0 0 21 20">
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8.33337C18 14.1667 10.5 19.1667 10.5 19.1667C10.5 19.1667 3 14.1667 3 8.33337C3 6.34425 3.79018 4.4366 5.1967 3.03007C6.60322 1.62355 8.51088 0.833374 10.5 0.833374C12.4891 0.833374 14.3968 1.62355 15.8033 3.03007C17.2098 4.4366 18 6.34425 18 8.33337Z" stroke="#5A52B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 10.8334C11.8807 10.8334 13 9.71409 13 8.33337C13 6.95266 11.8807 5.83337 10.5 5.83337C9.11929 5.83337 8 6.95266 8 8.33337C8 9.71409 9.11929 10.8334 10.5 10.8334Z" stroke="#5A52B9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  </div>
);

export const LocationIcon = () => (
  <div viewBox="0 0 17 17">
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.669284 5.94819C0.650118 6.29069 0.841784 6.60985 1.15345 6.75319L7.40678 9.62152L10.2751 15.874C10.4118 16.1707 10.7085 16.3599 11.0326 16.3599L11.0801 16.3582C11.2474 16.3488 11.4079 16.2893 11.5408 16.1873C11.6737 16.0853 11.7728 15.9456 11.8251 15.7865L16.4876 1.59319C16.5851 1.29485 16.5068 0.965685 16.2851 0.743185C16.0634 0.520685 15.7351 0.444852 15.4351 0.540685L1.24095 5.20402C1.08177 5.256 0.942009 5.35487 0.839996 5.48767C0.737984 5.62046 0.678479 5.78098 0.669284 5.94819Z"
        fill="#5A52B9"
      />
    </svg>
  </div>
);


export const ArrowIcon = () => (
  <div viewBox="0 0 17 17">
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.702 5.79758C13.7018 5.79733 13.7015 5.79705 13.7013 5.7968L8.6946 0.790142C8.30183 0.400843 7.66783 0.403659 7.27853 0.796431C7.24777 0.827473 7.21908 0.860485 7.19261 0.895281C6.91189 1.31399 6.97316 1.87396 7.3378 2.22204L10.1015 4.99573C10.2484 5.1428 10.4173 5.26612 10.6021 5.36122L10.9075 5.52143H1.06947C0.565704 5.50025 0.119799 5.84474 0.0130637 6.33752C-0.0754602 6.8834 0.295283 7.39771 0.841195 7.48623C0.898459 7.49552 0.956411 7.49981 1.01439 7.49906H10.8875L10.6722 7.59919C10.4622 7.69729 10.2708 7.83113 10.1065 7.99472L7.3378 10.7634C6.97316 11.1115 6.91189 11.6714 7.19261 12.0902C7.51932 12.5363 8.14587 12.6332 8.59209 12.3065C8.62814 12.2801 8.6624 12.2513 8.6946 12.2203L13.7013 7.21368C14.0925 6.82285 14.0928 6.18885 13.702 5.79758Z" fill="#5A52B9" />
    </svg>
  </div>
);

export const AccordionOpenIcon = () => (
  <div viewBox="0 0 21 21">
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="10.0909"
        cy="10.0909"
        r="9.54545"
        stroke="#5A52B9"
        strokeWidth="0.909091"
      />
      <path
        d="M4.63672 10.5453V9.18164H15.5458V10.5453H4.63672Z"
        fill="#5A52B9"
      />
      <path
        d="M9.4098 4.40918L10.7734 4.40918L10.7734 15.3183L9.4098 15.3183L9.4098 4.40918Z"
        fill="#5A52B9"
      />
    </svg>
  </div>
);

export const AccordionCloseIcon = () => (
  <div viewBox="0 0 20 20">
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="9.99911"
        cy="10.0001"
        r="9.54545"
        stroke="#5A52B9"
        strokeWidth="0.909091"
      />
      <path
        d="M4.54492 10.4545V9.09082H15.454V10.4545H4.54492Z"
        fill="#5A52B9"
      />
    </svg>
  </div>
);
