import React from "react";
import Img4 from "../../../statics/user_side/images/group-61.jpg"

const ServiceCard = ({ imgSrc, title, description }) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md m-4">
      <a href="#">
        <img className="rounded-t-lg w-full" src={imgSrc} alt="" />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            {title}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700">{description}</p>
        <a
          href="#"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Read more
          <svg
            className="w-3.5 h-3.5 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

const Services = () => {
  const serviceItems = [
    {
      imgSrc: Img4,
      title: "Minor Plumbing Repairs",
      description: "Projects starting at ₹760",
    },
    {
      imgSrc: Img4,
      title: "Furniture Assembly",
      description: "Projects starting at $49",
    },
    {
      imgSrc: Img4,
      title: "Electrical Help",
      description: "Projects starting at ₹760",
    },
    // Add more services as needed
  ];

  return (
    <div className="flex flex-wrap justify-center">
      {serviceItems.map((item, index) => (
        <ServiceCard
          key={index}
          imgSrc={item.imgSrc}
          title={item.title}
          description={item.description}
        />
      ))}
    </div>
  );
};

export default Services;
