import * as React from "react";
import { SVGProps } from "react";
const ExpandedLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={105}
    height={29}
    fill="none"
    {...props}
  >
    <path
      fill="#0172FC"
      d="m15.938 10.633-4.784.128a1.784 1.784 0 0 0-.405-.906c-.22-.27-.508-.48-.863-.628-.348-.157-.752-.235-1.214-.235-.604 0-1.119.12-1.545.362-.419.242-.625.569-.618.98-.007.32.121.597.384.832.27.234.75.422 1.438.564l3.153.597c1.634.312 2.848.83 3.644 1.555.802.725 1.207 1.683 1.214 2.877-.007 1.122-.34 2.098-1.001 2.93-.653.83-1.548 1.477-2.685 1.938-1.136.455-2.436.682-3.899.682-2.337 0-4.18-.48-5.529-1.438-1.342-.966-2.11-2.259-2.301-3.878l5.145-.128c.114.597.409 1.051.885 1.364.476.312 1.083.468 1.821.468.668 0 1.211-.124 1.63-.372.42-.249.633-.58.64-.991-.008-.37-.17-.664-.49-.884-.32-.228-.82-.405-1.503-.533L6.2 15.374c-1.64-.299-2.862-.85-3.664-1.652-.803-.81-1.2-1.84-1.194-3.09-.007-1.093.284-2.027.874-2.801.59-.781 1.427-1.378 2.514-1.79 1.087-.412 2.369-.618 3.846-.618 2.216 0 3.963.465 5.242 1.396 1.278.923 1.985 2.194 2.12 3.814Zm7.279 2.035V22h-5.21V.182h5.04V8.64h.18c.37-1.009.973-1.797 1.811-2.365.846-.569 1.879-.853 3.1-.853 1.151 0 2.152.256 3.005.767.852.505 1.513 1.218 1.981 2.142.476.923.71 2.002.703 3.238V22h-5.21v-9.407c.008-.91-.22-1.62-.68-2.13-.463-.512-1.112-.768-1.95-.768-.547 0-1.03.121-1.45.362a2.47 2.47 0 0 0-.969 1.013c-.227.44-.344.973-.351 1.598Zm17.575 9.609c-1.044 0-1.97-.174-2.78-.522a4.332 4.332 0 0 1-1.907-1.598c-.462-.717-.693-1.616-.693-2.695 0-.91.16-1.676.48-2.301.32-.625.76-1.133 1.32-1.524a6.215 6.215 0 0 1 1.94-.884 12.596 12.596 0 0 1 2.343-.416c.93-.085 1.68-.174 2.248-.266.569-.1.98-.238 1.236-.415a.896.896 0 0 0 .394-.778v-.053c0-.547-.188-.97-.564-1.268-.377-.298-.885-.448-1.524-.448-.689 0-1.243.15-1.662.448-.419.298-.685.71-.799 1.236l-4.804-.17a5.68 5.68 0 0 1 1.097-2.664c.597-.789 1.413-1.406 2.45-1.854 1.044-.454 2.298-.682 3.76-.682 1.045 0 2.007.125 2.888.373.88.242 1.648.597 2.301 1.066a4.817 4.817 0 0 1 1.513 1.704c.362.675.543 1.445.543 2.312V22h-4.9v-2.28h-.128a4.643 4.643 0 0 1-1.119 1.406 4.457 4.457 0 0 1-1.587.863c-.604.192-1.286.288-2.046.288Zm1.609-3.41c.561 0 1.065-.113 1.513-.34.454-.227.816-.54 1.086-.938.27-.404.405-.873.405-1.406v-1.555c-.149.078-.33.149-.543.213a9.294 9.294 0 0 1-.682.181c-.248.057-.504.107-.767.15-.263.042-.515.08-.756.116-.49.079-.91.2-1.257.363-.341.163-.604.376-.789.639a1.566 1.566 0 0 0-.266.916c0 .54.192.952.575 1.236.39.284.884.426 1.481.426ZM52.857 22V5.636h5.06V8.62h.171c.299-1.08.785-1.882 1.46-2.407.675-.533 1.46-.8 2.354-.8.242 0 .49.018.746.054.256.028.494.074.714.138v4.528a4.985 4.985 0 0 0-.98-.202 8.687 8.687 0 0 0-1.066-.075c-.618 0-1.175.139-1.672.416-.49.27-.877.65-1.161 1.14-.277.482-.416 1.05-.416 1.704V22h-5.21Zm18.527.309c-1.712 0-3.189-.337-4.432-1.012a7 7 0 0 1-2.855-2.909c-.66-1.264-.99-2.766-.99-4.506 0-1.69.333-3.168 1-4.432a7.231 7.231 0 0 1 2.824-2.961c1.214-.71 2.645-1.066 4.293-1.066 1.165 0 2.23.181 3.196.544.966.362 1.8.898 2.504 1.608.703.71 1.25 1.588 1.64 2.632.391 1.037.586 2.226.586 3.569v1.3H64.928V12.05h9.375a2.934 2.934 0 0 0-.394-1.481 2.678 2.678 0 0 0-1.055-1.012c-.44-.249-.948-.373-1.523-.373a3.11 3.11 0 0 0-1.566.394 2.9 2.9 0 0 0-1.098 1.055c-.27.44-.412.94-.426 1.502v3.079c0 .667.132 1.253.394 1.758.263.497.636.884 1.119 1.16.483.278 1.058.416 1.726.416.462 0 .88-.064 1.257-.191.376-.128.7-.316.97-.565a2.33 2.33 0 0 0 .607-.916l4.783.138a5.919 5.919 0 0 1-1.31 2.802c-.668.788-1.545 1.403-2.632 1.843-1.086.433-2.343.65-3.771.65ZM86.121.182V22h-5.21V.182h5.21Zm5.6 27.954c-.624 0-1.214-.05-1.768-.149a7.141 7.141 0 0 1-1.427-.373l1.15-3.782c.512.17.973.27 1.385.299.42.028.778-.04 1.076-.203.306-.156.54-.437.703-.841l.203-.49-5.817-16.96h5.455l3.014 11.675h.171l3.058-11.676h5.486l-6.168 17.93a7.564 7.564 0 0 1-1.268 2.365c-.54.689-1.24 1.229-2.099 1.62-.852.39-1.903.585-3.153.585Z"
    />
  </svg>
);
export default ExpandedLogo;