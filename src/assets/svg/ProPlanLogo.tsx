import * as React from "react";
import { SVGProps } from "react";
const ProPlanLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={60}
    height={60}
    fill="none"
    {...props}
  >
    <rect width={60} height={60} fill="#0172FC" rx={30} />
    <path
      fill="#fff"
      d="M16.75 37.5 13 16.875l10.313 9.375L29.875 15l6.563 11.25 10.312-9.375L43 37.5H16.75ZM43 43.125C43 44.25 42.25 45 41.125 45h-22.5c-1.125 0-1.875-.75-1.875-1.875V41.25H43v1.875Z"
    />
  </svg>
);
export default ProPlanLogo;
