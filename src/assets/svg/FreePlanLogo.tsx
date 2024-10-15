import * as React from "react";
import { SVGProps } from "react";
const FreePlanLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={60}
    height={60}
    fill="none"
    {...props}
  >
    <rect width={60} height={60} fill="#F2F3F3" rx={30} />
    <path
      fill="#263238"
      d="m29.695 40.124 7.612 4.604c1.394.844 3.1-.404 2.733-1.981l-2.017-8.657 6.731-5.833c1.229-1.064.569-3.082-1.045-3.21l-8.86-.752-3.466-8.18c-.624-1.486-2.752-1.486-3.375 0l-3.467 8.162-8.86.752c-1.613.128-2.273 2.146-1.045 3.21l6.732 5.832-2.018 8.658c-.367 1.577 1.34 2.824 2.733 1.98l7.612-4.585Z"
    />
  </svg>
);
export default FreePlanLogo;
