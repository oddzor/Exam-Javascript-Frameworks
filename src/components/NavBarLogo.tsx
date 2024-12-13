import React from "react";

function NavbarLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 58 58"
      xmlSpace="preserve"
      {...props}
    >
      <defs>
        <linearGradient id="navbar-logo-gradient">
          <stop stopColor="#ff10d3" offset="0%" />
          <stop stopColor="#bf5fff" offset="100%" />
        </linearGradient>
      </defs>
      <g>
        <polygon
          fill="url(#navbar-logo-gradient)"
          points="29,58 3,45 3,13 29,26"
        />
        <polygon fill="#556080" points="29,58 55,45 55,13 29,26" />
        <polygon fill="#434C6D" points="3,13 28,0 55,13 29,26" />
      </g>
    </svg>
  );
}

export default NavbarLogo;
