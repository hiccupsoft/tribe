import React from "react";
import { Transition } from "@tailwindui/react";
import { useSelector } from "react-redux";

const UpgradeModal = ({ modalShowing, content, currentUser, closeModal }) => {
  const { platformData } = useSelector(state => state.frontend);
  return (
    <Transition show={modalShowing}>
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
            <div
              className="absolute inset-0 bg-gray-500 opacity-75"
              onClick={() => {
                closeModal();
              }}
            ></div>
          </Transition.Child>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          &#8203;
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            as="div"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
            className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          >
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  Upgrade your account
                </h3>
                <div className="mt-2">
                  <p className="text-sm leading-5 text-gray-500">
                    A <span className="capitalize">{content && content.visibility}</span> account is
                    required to access this content - Please visit this link to upgrade.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-300 text-base leading-6 font-medium text-white shadow-sm hover:bg-blue-200 focus:outline-none focus:border-blue-200 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                  href={platformData && platformData.upgradeUrl}
                >
                  Upgrade
                </a>
              </span>
              <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                  onClick={() => {
                    closeModal();
                  }}
                >
                  Cancel
                </button>
              </span>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};

export default UpgradeModal;
