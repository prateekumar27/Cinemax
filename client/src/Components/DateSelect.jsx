import React, { useState } from "react";
import BlurCircle from "./BlurCircle";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DateSelect = ({ dateTime, id }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  const [selected, setSelected] = useState(null);

  const onBookHandler = () => {
    if (!selected) {
      return toast("Please select a date");
    }

    navigate(`/movies/${id}/${selected}`);
    scrollTo(0, 0);
  };

  return (
    <div id="dateSelect" className="pt-30">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary rounded-lg">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="-100px" right="0px" />

        <div>
          <p className="text-lg font-semibold ">Choose Date</p>
          <div className="flex items-center gap-6 text-sm mt-5">
            <ChevronLeftIcon width={28} className="cursor-pointer" />

            <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
              {Object.keys(dateTime).map((date) => (
                <button
                  key={date}
                  onClick={() => setSelected(date)}
                  className={`flex flex-col items-center justify-center h-14 w-14 rounded aspect-square cursor-pointer ${
                    selected === date
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <span>{new Date(date).getDate()}</span>
                  <span>
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                </button>
              ))}
            </span>
            <ChevronRightIcon width={28} className="cursor-pointer" />
          </div>
        </div>
        <button
          onClick={onBookHandler}
          className="px-10 py-3 bg-primary hover:bg-primary/90 text-white rounded-md font-medium transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
