import React from "react";
import { Transition } from "@tailwindui/react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ResetPassword from "./ResetPassword";
import SignInHeading from "./SignInHeading";
import ResetPasswordHeader from "./ResetPasswordHeader";
import SignUpHeading from "./SignUpHeading";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModalState } from "../../features/auth/authSlice";
import { useHistory } from "react-router-dom";

const Auth = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { loginModalShowing, activeAuthForm, redirectOnCloseTo } = useSelector(state => state.auth);

  /*
  const signInWithFacebook = () => {
    const pageURL = `https://localhost:3001/auth/facebook`;
    const title = "Tribe";
    const w = 515;
    const h = 679;
    const left = window.screen.width / 2 - w / 2;
    const top = window.screen.height / 2 - h / 2;
    const facebookWindowRef = window.open(
      pageURL,
      title,
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );
    facebookWindowRef.onunload = () => {
      console.log("just closed");
    };
  };

  const signInWithGoogle = () => {
    const pageURL = `https://localhost:3001/auth/google`;
    const title = "Tribe";
    const w = 515;
    const h = 679;
    const left = window.screen.width / 2 - w / 2;
    const top = window.screen.height / 2 - h / 2;
    const googleWindowRef = window.open(
      pageURL,
      title,
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );
    googleWindowRef.onunload = () => {
      console.log("just closed");
    };
  };
*/
  return (
    <Transition
      show={loginModalShowing}
      as="div"
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: 50 }}
    >
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
              dispatch(setLoginModalState({ loginModalShowing: false }));
              if (redirectOnCloseTo) history.push("/");
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
          className="w-full max-w-sm px-5 sm:px-auto sm:max-w-lg inline-block align-middle bg-gray-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all"
        >
          <div className="bg-gray-50 flex flex-col justify-center py-8">
            {"signIn" === activeAuthForm && <SignInHeading />}

            {"signUp" === activeAuthForm && <SignUpHeading />}

            {"resetPassword" === activeAuthForm && <ResetPasswordHeader />}

            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="py-8 px-4 sm:rounded-lg sm:px-10">
                {"signIn" === activeAuthForm && <SignIn />}

                {"signUp" === activeAuthForm && <SignUp />}

                {"resetPassword" === activeAuthForm && <ResetPassword />}
                {/*
                <div className='mt-6'>
                  <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                      <div className='w-full border-t border-gray-300'></div>
                    </div>
                    <div className='relative flex justify-center text-sm leading-5'>
                      <span className='px-2 bg-gray-50 text-gray-500'>
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className='mt-6 grid grid-cols-2 gap-3'>
                    <div>
                      <span className='w-full inline-flex rounded-md shadow-sm'>
                        <button
                          type='button'
                          className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out'
                          aria-label='Sign in with Facebook'
                          onClick={() => signInWithFacebook()}
                        >
                          <svg
                            width='27'
                            height='27'
                            viewBox='0 0 27 27'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M23.362 0H3.638A3.638 3.638 0 0 0 0 3.638v19.724A3.638 3.638 0 0 0 3.638 27h9.728l.016-9.648h-2.506a.591.591 0 0 1-.592-.59l-.012-3.11a.591.591 0 0 1 .592-.593h2.502v-3.005c0-3.488 2.13-5.387 5.24-5.387h2.553c.327 0 .592.265.592.592V7.88a.592.592 0 0 1-.591.592h-1.567c-1.692 0-2.02.804-2.02 1.984v2.602h3.718c.355 0 .63.309.588.66l-.369 3.11a.591.591 0 0 1-.587.523H17.59L17.574 27h5.788A3.638 3.638 0 0 0 27 23.362V3.638A3.638 3.638 0 0 0 23.362 0z'
                              fill='#475993'
                            ></path>
                          </svg>
                        </button>
                      </span>
                    </div>

                    <div>
                      <span className='w-full inline-flex rounded-md shadow-sm'>
                        <button
                          type='button'
                          className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out'
                          aria-label='Sign in with Google'
                          onClick={() => signInWithGoogle()}
                        >
                          <svg
                            width='27'
                            height='27'
                            viewBox='0 0 27 27'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <g clipPath='url(#a)'>
                              <path
                                d='M5.984 16.316l-.94 3.509-3.435.073A13.44 13.44 0 0 1 0 13.5C0 11.26.544 9.15 1.51 7.29l3.058.561 1.34 3.04a8.024 8.024 0 0 0-.433 2.608c0 .99.18 1.94.509 2.816z'
                                fill='#FBBB00'
                              ></path>
                              <path
                                d='M26.764 10.978c.155.817.236 1.66.236 2.522 0 .966-.102 1.91-.295 2.819a13.497 13.497 0 0 1-4.753 7.709l-.001-.001-3.852-.197-.545-3.403a8.046 8.046 0 0 0 3.462-4.108h-7.22v-5.341h12.968z'
                                fill='#518EF8'
                              ></path>
                              <path
                                d='M21.95 24.027h.002A13.443 13.443 0 0 1 13.5 27c-5.141 0-9.61-2.873-11.891-7.102l4.375-3.581a8.027 8.027 0 0 0 11.57 4.11l4.397 3.6z'
                                fill='#28B446'
                              ></path>
                              <path
                                d='M22.117 3.108l-4.373 3.58a8.03 8.03 0 0 0-11.836 4.204l-4.397-3.6H1.51A13.497 13.497 0 0 1 13.5 0c3.276 0 6.28 1.167 8.617 3.108z'
                                fill='#F14336'
                              ></path>
                            </g>
                            <defs>
                              <clipPath id='a'>
                                <rect
                                  width='27'
                                  height='27'
                                  rx='10'
                                  fill='#fff'
                                ></rect>
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              */}
              </div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default Auth;
