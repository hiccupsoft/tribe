import React, { useState } from "react";
import { Transition } from "@tailwindui/react";

const PopupIframe = ({ embedURL, headline, platformDark }) => {
  const [PopupIframeStatus, SetPopupIframeStatus] = useState(false);
  let darkColor = platformDark;

  return (
    <>
      <div
        className="text-3xl font-bold py-5 flex items-center justify-center w-full h-full cursor-pointer text-white "
        onClick={() => {
          SetPopupIframeStatus(true);
        }}
      >
        {headline}
      </div>
      <Transition show={PopupIframeStatus}>
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              as="div"
              className="fixed inset-0 transition-opacity"
            >
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div
                  className="absolute inset-0 bg-gray-800 opacity-75"
                  style={{ backgroundColor: `${darkColor}` }}
                  onClick={() => {
                    SetPopupIframeStatus(false);
                  }}
                />
              </div>
            </Transition.Child>
            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              ​
            </span>

            <Transition.Child
              enter="ease-out duration-300 "
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              as="div"
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle  sm:max-w-3xl sm:w-full sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div>
                <div className="hidden mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center min-h  sm:mt-5">
                  <h2
                    className="text-3xl font-bold font-medium text-gray-900"
                    id="modal-headline"
                    style={{
                      color: `${darkColor}`
                    }}
                  >
                    {headline}
                  </h2>
                  <iframe
                    className="w-full h-full "
                    style={{ minHeight: "400px" }}
                    title="iframe"
                    src={embedURL}
                  />
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense"></div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default PopupIframe;
