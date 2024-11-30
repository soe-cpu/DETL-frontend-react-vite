import React from "react";

const Breadcrumb = (data: { page: string; action: string }) => {
  return (
    <div>
      <h1>{data.page}</h1>
      <div className="flex items-center text-gray-600">
        <div>Dashboard &nbsp;</div>
        <div>
          <svg
            className="w-3 h-3 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m15 19-7-7 7-7"
            />
          </svg>
        </div>
        <div>&nbsp; {data.page} &nbsp;</div>
        <div>
          <svg
            className="w-3 h-3 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m15 19-7-7 7-7"
            />
          </svg>
        </div>
        <div>&nbsp; {data.action} &nbsp;</div>
      </div>
    </div>
  );
};

export default Breadcrumb;
