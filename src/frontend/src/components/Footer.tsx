"use client";
import { useEffect, useRef, useState } from "react";
import Slider from "./Slider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCouncilContext } from "../providers";

interface NavProps {
  icon: JSX.Element;
  text: JSX.Element;
  href: string;
}

const Footer: React.FC = () => {
  const normalIconColour = "#383e48";
  const navigatedIconColour = "#f4f5f7";

  //Setting navigation items
  const homeCouncil = useCouncilContext();
  const [navItems, setNavItems] = useState<NavProps[]>([]);
  const currentPathName = usePathname();
  useEffect(() => {
    const currentNavItems = [
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={
              currentPathName == "/" ? navigatedIconColour : normalIconColour
            }
            className="w-6 h-6 mb-1"
          >
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
        ),
        text: (
          <div
            className={`text-xs font-semibold ${
              currentPathName == "/" ? "light-white-text" : "navy-black-text"
            }`}
          >
            Home
          </div>
        ),
        href: "/",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={
              currentPathName == "/scan"
                ? navigatedIconColour
                : normalIconColour
            }
            className="w-6 h-6 mb-1"
          >
            <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
            <path
              fill-rule="evenodd"
              d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clip-rule="evenodd"
            />
          </svg>
        ),
        text: (
          <div
            className={`text-xs font-semibold ${
              currentPathName == "/scan"
                ? "light-white-text"
                : "navy-black-text"
            }`}
          >
            Scan QR 
          </div>
        ),
        href: "../scan",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            className="w-[23px] h-[23px] mb-1"
            viewBox="0 0 256 256"
          >
            <g
              fill={
                currentPathName == "/homerecycling"
                  ? navigatedIconColour
                  : normalIconColour
              }
              fillRule="nonzero"
              stroke={
                currentPathName == "/homerecycling"
                  ? navigatedIconColour
                  : normalIconColour
              }
              strokeWidth="1"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeMiterlimit="10"
              strokeDasharray=""
              strokeDashoffset="0"
              fontFamily="none"
              fontWeight="none"
              fontSize="none"
              textAnchor="none"
              style={{ mixBlendMode: "normal" }}
            >
              <g transform="scale(5.12,5.12)">
                <path d="M19.0625,1c-2.5625,0.15234 -4.37109,1.05859 -5.375,2.71875l-6.59375,11.4375l4.40625,2.53125l-11.34375,1.40625l3.46875,2l-3.03125,5.15625c-0.63672,1.10156 -1.00391,3.57031 0.1875,5.375c0.47266,0.71484 1.99609,3.44141 3.34375,5.84375c1.16406,2.07422 2.25391,4.02734 2.75,4.84375c0.57813,0.78516 1.14844,1.55859 1.21875,1.65625c0.00391,0 -1.27734,-2.15234 1,-6.09375l5.90625,-10.21875l3.46875,2l-4.4375,-10.5l4.40625,2.53125l9.4375,-16.34375c1.91016,-3.56641 3.4375,-4.18359 3.78125,-4.28125c0.17188,0 0.3125,0 0.46875,0c-0.13281,-0.00391 -0.26953,-0.03516 -0.40625,-0.03125c-0.08203,0 -0.16797,-0.00391 -0.25,0c-1.39453,0.02734 -3.80469,0.01953 -6.71875,0c-1.73047,-0.01172 -3.62891,-0.02734 -5.6875,-0.03125zM32.96875,1.15625c-0.59766,0.28906 -1.89062,1.23828 -3.46875,4.1875l-3.625,6.28125l2.125,3.71875l-3.46875,2.03125l11.3125,1.375l-4.40625,2.53125l5.71875,9.90625h7.4375c3.12891,0 4.68359,-1.00781 5.34375,-1.65625c0.18359,-1.22656 -0.00391,-2.36328 -0.5625,-3.375l-6.59375,-11.40625l-4.40625,2.53125l4.46875,-10.5l-3.46875,2l-2.96875,-5.1875c-0.50391,-0.875 -1.82812,-2.05859 -3.4375,-2.4375zM32.15625,28.71875l-6.875,9.125v-5.09375h-11.4375l-3.71875,6.4375c-1.5625,2.71094 -1.44922,4.57031 -1.21875,5.46875c0.97266,0.77344 2.03125,1.19531 3.1875,1.21875h13.1875v-5.125l6.875,9.125v-4l5.96875,0.03125c1.27344,0 3.59375,-0.875 4.5625,-2.8125c0.38281,-0.76562 2,-3.47656 3.40625,-5.84375c1.21484,-2.04687 2.35156,-3.97266 2.8125,-4.8125c0.39453,-0.89453 0.76172,-1.76562 0.8125,-1.875c0,0 -1.19922,2.1875 -5.75,2.1875h-11.8125z"></path>
              </g>
            </g>
          </svg>
        ),
        text: (
          <div
            className={`text-xs font-semibold ${
              currentPathName == "/homerecycling"
                ? "light-white-text"
                : "navy-black-text"
            }`}
          >
            My Council
          </div>
        ),
        href: homeCouncil.councilValue ? "../homerecycling" : "#",
      },

      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={
              currentPathName == "/community"
                ? navigatedIconColour
                : normalIconColour
            }
            className="w-6 h-6 mb-1"
          >
            <path
              fill-rule="evenodd"
              d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z"
              clip-rule="evenodd"
            />
          </svg>
        ),
        text: (
          <div
            className={`text-xs font-semibold ${
              currentPathName == "/mapp"
                ? "light-white-text"
                : "navy-black-text"
            }`}
          >
            Community
          </div>
        ),
        href: homeCouncil.councilValue ? "../mapp" : "#",
      },
      {
        icon: (
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-6 h-6 mb-1"
          >
            <defs>
              <style>
                {`
            .cls-1 {
              fill: none;
              stroke: #000;
              stroke-miterlimit: 10;
              stroke-width: 2px;
            }
            .stroke-blue {
              fill: none;
              stroke: ${
                currentPathName == "/contact"
                  ? navigatedIconColour
                  : normalIconColour
              }; 
            }
            `}
              </style>
            </defs>
            <path
              className="cls-1 stroke-blue"
              d="M21.57 22.5H5.34a1.91 1.91 0 0 1-1.91-1.91 1.92 1.92 0 0 1 1.91-1.91h16.23M19.66 18.68v3.82"
            />
            <path
              className="cls-1 stroke-blue"
              d="M19.66 22.5H5.34a1.91 1.91 0 0 1-1.91-1.91V3.41A1.91 1.91 0 0 1 5.34 1.5h15.27v17.18h-.95z"
            />
            <path
              className="cls-1 stroke-blue"
              d="M8.2 6.27h2.46a4.23 4.23 0 0 1 4.23 4.23V13h-2.46A4.23 4.23 0 0 1 8.2 8.73V6.27zM16.8 14.86l-5.73-5.72"
            />
          </svg>
        ),
        text: (
          <div
            className={`text-xs font-semibold ${
              currentPathName == "/contact"
                ? "light-white-text"
                : "navy-black-text"
            }`}
          >
            Contact
          </div>
        ),
        href: "../contact",
      },
    ];
    setNavItems(currentNavItems);
  }, [homeCouncil.councilValue, currentPathName]);

  // handle the Height of footer for the slider to be stack on top of footer in homepage
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  useEffect(() => {
    if (footerRef.current) {
      setFooterHeight(footerRef.current.offsetHeight);
    }
  });

  return (
    <div id="footer" className="creamy-green-bg" ref={footerRef}>
      <div className="flex justify-center pl-1 pr-1">
        {navItems.map((item: NavProps) => (
          <div
            key={JSON.stringify(item)}
            className={`flex-grow justify-between items-center pb-1 pt-3 glow`}
          >
            {/* Seting up the clickable links */}
            <Link href={item.href}>
              <div className={`flex flex-col items-center navigationButton`}>
                {item.icon}
                <div style={{ whiteSpace: "nowrap" }}>{item.text}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Footer;
