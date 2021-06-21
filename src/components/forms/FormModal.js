import React from "react";
import { Transition } from "@tailwindui/react";

const FormModal = ({ modalShowing, closeModal, title, Form, model }) => {
  return (
    <Transition show={modalShowing}>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
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
            className="w-full max-w-sm px-5 sm:px-auto sm:max-w-3xl inline-block align-middle bg-gray-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all"
          >
            <div className="bg-gray-50 flex flex-col justify-center py-8">
              <div className="px-1 sm:mx-auto sm:w-full sm:max-w-2xl">
                <h6 className="mb-2 text-2xl leading-9 font-bold text-gray-900">{title}</h6>

                <div className="sm:rounded-lg">
                  <Form model={model} closeModal={closeModal} />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};

export default FormModal;
