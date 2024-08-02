"use client";
import "../styles/globals.css";
import Header from "../components/Header";
import MainContainer from "../components/MainContainer";
import SplashScreen from "../components/SplashScreen";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import WelcomePopup from "../components/WelcomePopup";
import DesktopWelcomePopup from "../components/DesktopWelcomePopup";
import { useMediaQuery } from "react-responsive";
import dynamic from "next/dynamic";
import Script from "next/script";
import Footer from "../components/Footer";
import NotificationBanner from "../components/NotificationBanner"
import NotificationProvider from "../providers";

// prevent SSR for this council provider, only rendered on the client side
// Import the CouncilProvider component using dynamic import
const CouncilProviderLoader = dynamic(
  () => import("../providers").then((module) => module.CouncilProvider),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const isHome = pathName === "/";
  const isExplore = pathName === "/explore";
  const [isLoading, setIsLoading] = useState<boolean>(isHome);
  const [isLoading2, setIsLoading2] = useState<boolean>(isExplore);
  

  useEffect(() => {
    if (isLoading) return;
  }, [isLoading]);

  useEffect(() => {
    if (isLoading2) return;
  }, [isLoading2]);

  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const isPc = useMediaQuery({ query: "(min-width: 601px)" });

  return (
    <html lang="en">
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-JEDFB1FRLZ"></Script>
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JEDFB1FRLZ');
          `}
      </Script>
      <head>
        <link rel="icon" href="./favicon.ico?v=2" type="image/x-icon" />
      </head>

      <body>
      <NotificationProvider>
        {/* {isLoading2 && isExplore && (
          <SplashScreen
            finishLoading={() => {
              setIsLoading2(false);
            }}
          />
        )} */}

        {(isLoading && isHome) || (isLoading2 && isExplore) ? (// display spalsh pop up conditionally to the route
          <SplashScreen
            finishLoading={() => {
              setIsLoading(false);
              setIsLoading2(false);
            }}
          />
        ) : ( // display welcome pop up conditionally to the route
          
          <CouncilProviderLoader>
            
            {(isHome || isExplore) && (
              <>
                {isMobile && <WelcomePopup />}
                {isPc && <DesktopWelcomePopup />}
              </>
            )}
            <NotificationBanner/>
            <Header />
            <MainContainer>{children}</MainContainer>
            <Footer />
          </CouncilProviderLoader>
        )}
        </NotificationProvider>
      </body>
    </html>
  );
}