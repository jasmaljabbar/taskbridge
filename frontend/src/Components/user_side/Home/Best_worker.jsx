import React from "react";
import Img1 from "../../../statics/user_side/worker_image/jnj.png";
import Img2 from "../../../statics/user_side/worker_image/jnj.png";
import Img3 from "../../../statics/user_side/worker_image/jnj.png";

const Best_worker = () => {
  const workerItems = [
    {
      src: Img1,
      alt: "Electrician",
      label: "Electrician",
      style: { width: "60%" },
    },
    {
      src: Img2,
      alt: "Electrician",
      label: "Electrician",
      style: { width: "60%" },
    },
    {
      src: Img3,
      alt: "Electrician",
      label: "Electrician",
      style: { width: "60%" },
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 container mx-auto">
      <div className="flex items-center justify-between w-full sm:w-8/12">
        {workerItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <img
              src={item.src}
              alt={item.alt}
              className="shadow rounded-full max-w-full h-auto align-middle border-none"
              style={item.style}
            />
            {item.label && <p>{item.label}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Best_worker;
