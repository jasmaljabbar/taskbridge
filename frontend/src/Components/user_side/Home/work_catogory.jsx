import React from "react";

import next from "../../../statics/user_side/work_image/after.png";
import Img2 from "../../../statics/user_side/work_image/mechanic.png";
import Img3 from "../../../statics/user_side/work_image/teapicker.png";
import Img4 from "../../../statics/user_side/work_image/moving.png";
import Img5 from "../../../statics/user_side/work_image/cleaner.png";
import Img6 from "../../../statics/user_side/work_image/outworking.png";
import Img7 from "../../../statics/user_side/work_image/home_repair.png";
import Img8 from "../../../statics/user_side/work_image/painter.png";
import Img9 from "../../../statics/user_side/work_image/electrition.png";
import previos from "../../../statics/user_side/work_image/previos.png";

const work_category = () => {
  const workItems = [
    {
      src: previos,
      alt: "Previous",
      label: "",
      className: "opacity-40",
      style: { width: "100%", borderRadius: "50%" },
    },
    {
      src: Img9,
      alt: "Electrician",
      label: "Electrician",
      className: "",
      style: { width: "60%", borderRadius: "50%" },
    },
    {
      src: Img2,
      alt: "Mechanic",
      label: "Mechanic",
      style: { width: "60%", borderRadius: "50%" },
    },
    {
      src: Img3,
      alt: "Tea Plucker",
      label: "Tea Plucker",
      style: { width: "60%", borderRadius: "50%" },
    },
    {
      src: Img4,
      alt: "Moving",
      label: "Moving",
      style: { width: "60%", borderRadius: "50%" },
    },
    {
      src: Img5,
      alt: "Cleaner",
      label: "Cleaner",
      style: { width: "60%", borderRadius: "50%" },
    },
    {
      src: Img6,
      alt: "Outdoor",
      label: "Outdoor",
      style: { width: "60%", borderRadius: "50%" },
    },
    {
      src: Img7,
      alt: "Home Repair",
      label: "Home Repair",
      style: { width: "60%", borderRadius: "50%" },
    },
    {
      src: Img8,
      alt: "Painter",
      label: "Painter",
      style: { width: "60%", borderRadius: "50%" },
    },
    {
      src: next,
      alt: "Next",
      label: "",
      className: "opacity-40",
      style: { width: "100%", borderRadius: "50%" },
    },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-between w-full sm:w-12/12">
        {workItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-2"
          >
            <img
              src={item.src}
              alt={item.alt}
              className={`shadow rounded-full max-w-full h-auto align-middle border-none transition-transform transform hover:scale-105 ${item.className}`}
              style={item.style}
            />
            {item.label && <p>{item.label}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default work_category;
