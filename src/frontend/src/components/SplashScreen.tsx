import React, { useEffect, useState } from "react";
import anime from "animejs";
import Logo from "./Logo";

interface SplashScreenProps {
  finishLoading: () => void;
}
const SplashScreen: React.FC<SplashScreenProps> = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  const animate = () => {
    const loader = anime.timeline({
      easing: "easeOutExpo",
      duration: 1000,
      endDelay: 400,
      complete: () => finishLoading(),
    });

    loader
      .add({
        targets: ".arrow",
        strokeDashoffset: [anime.setDashoffset, 0],
        fill: "#4c4f56",
        easing: "easeInExpo",
        duration: 400,
        direction: "linear",
        loop: false,
      })
      .add({
        targets: ".word-binfluence path",
        fill: "#4c4f56",
        opacity: [0, 1],
        translateX: [-25, 0],
        rotate: ["-20deg", 0],
        delay: anime.stagger(25),
      })
      .add({
        targets: ".logo",
        opacity: [1, 0],
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 10);
    animate();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <Logo className="logo" />
    </div>
  );
};

export default SplashScreen;
function finishLoading() {
  throw new Error("Function not implemented.");
}
