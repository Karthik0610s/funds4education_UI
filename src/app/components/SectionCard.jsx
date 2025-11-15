import React from "react";

const SectionCard = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border mb-5 p-5">
      <h2 className="text-lg font-semibold mb-3 text-[#004080] border-b pb-2">
        {title}
      </h2>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
};

export default SectionCard;
