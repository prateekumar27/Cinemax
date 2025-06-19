import React from "react";
import { assets } from "../assets/assets";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className=' flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen'>
      <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20" />

      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110 text-white">
        Guardian <br /> of the Galaxy
      </h1>

      <div className="flex items-center gap-4 text-gray-300">
        <span> Action | Adventure | Science Fiction</span>

        <div>
          <CalendarIcon className="w-4.5 h-4.5" />
          2018
        </div>

        <div>
          <ClockIcon className="w-4.5 h-4.5" />
          2h 1m
        </div>
      </div>
      <p className="max-w-md text-gray-300">
        A ragtag group of intergalactic misfits — including a brash pilot, a
        deadly assassin, a vengeful warrior, a talking raccoon, and a tree-like
        humanoid — come together to form the unlikeliest team in the universe.
        When they discover a powerful orb that could destroy entire worlds, they
        must put aside their differences and learn to fight as one to protect
        the galaxy from cosmic threats.{" "}
      </p>
      <button
        onClick={() => navigate("/movies")}
        className=" flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
      >
        Explore Movies
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Hero;
