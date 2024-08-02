import dynamic from "next/dynamic";
import React, { forwardRef, ReactNode, Ref, useRef } from "react";
import { MainContainerRefProvider } from "../providers";

interface CustomCardProps {
  children: ReactNode;
}
/*const MainContainerRefProvider = dynamic(
  () => import("../providers").then((module) => module.MainContainerRefProvider),
  { ssr: false }
);
*/

const MainContainer: React.FC<CustomCardProps> = ({ children }) => {
  const mainContainerRef = useRef<HTMLDivElement | null>(null); // used to manage the reference of the main body container
  return (
    <div
      ref={mainContainerRef}
      id="content">
      <MainContainerRefProvider containerRef={mainContainerRef}>
        {children}
      </MainContainerRefProvider>

    </div>
  );

}
export default MainContainer;