import React, { useEffect, useRef, useState } from "react";
import { Transition } from "@tailwindui/react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAsync, setLoginModalState } from "../../features/auth/authSlice";
import constants from "../../constants.json";
import constans from "../../constants.json";

const Navbar = () => {
  const dispatch = useDispatch();
  const profileMenuRef = useRef(null);

  const [profileDropdownIsOpen, setProfileDropdownIsOpen] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const { platformData } = useSelector(state => state.frontend);
  const { currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = event => {
    if (
      profileMenuRef &&
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target) &&
      "user-menu-img" !== event.target.id
    ) {
      // click outsite profileMenuRef
      setProfileDropdownIsOpen(false);
    }
  };

  return (
    <div
      className="fixed top-0 sm:relative tribe-nav bg-nav z-50 w-full"
      style={{
        backgroundColor: `${platformData.darkColor}`
      }}
    >
      <div className="px-4 sm:px-6">
        <div className="flex max-w-nav mx-auto justify-between items-center py-3 md:justify-start md:space-x-10">
          {platformData && platformData.logo && (
            <Link to="/">
              <img
                className="h-8 sm:h-10 w-auto"
                src={constants.cdnUrl + platformData.logo}
                alt="Logo"
              />
            </Link>
          )}
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-800 focus:outline-none focus:bg-gray-800 focus:text-gray-500 transition duration-150 ease-in-out"
              onClick={() => setShowNavMenu(true)}
            >
              {/*<!-- Heroicon name: menu -->*/}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <nav className="hidden md:flex space-x-6">
            {(
              (platformData &&
                platformData.Links &&
                [...platformData.Links].sort((a, b) => {
                  if (a.position > b.position) return 1;
                  if (a.position < b.position) return -1;
                  return 0;
                })) ||
              []
            ).map((link, i) => (
              <a
                key={i}
                href={link.url}
                className="ml-4 px-3 py-2 rounded-md text-base font-medium leading-5 text-white  hover:bg-gray-800 hover:no-underline focus:outline-none transition duration-150 ease-in-out"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.title}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center justify-end space-x-8 md:flex-1 lg:w-0">
            {currentUser ? (
              <>
                {("admin" === currentUser.role || "sa" === currentUser.role) && (
                  <Link
                    to="/dashboard"
                    className="ml-4 px-3 py-2 rounded-md text-base font-medium leading-5 text-white  hover:bg-gray-800 hover:no-underline focus:outline-none transition duration-150 ease-in-out"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="ml-3 relative">
                  {/*  Profile dropdown */}
                  <div>
                    <button
                      className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
                      id="user-menu"
                      aria-label="User menu"
                      aria-haspopup="true"
                      onClick={() => setProfileDropdownIsOpen(!profileDropdownIsOpen)}
                    >
                      <img
                        id="user-menu-img"
                        className="h-8 w-8 rounded-full"
                        src={
                          currentUser.photoUrl
                            ? constants.cdnUrl + currentUser.photoUrl
                            : "/anon.png"
                        }
                        alt=""
                      />
                    </button>
                  </div>

                  <Transition
                    show={profileDropdownIsOpen}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg"
                      ref={profileMenuRef}
                    >
                      <div
                        className="py-1 rounded-md bg-white shadow-xs"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu"
                      >
                        <button
                          className="w-full block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                          role="menuitem"
                          onClick={() => dispatch(logoutAsync())}
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </>
            ) : (
              <>
                <button
                  className="ml-4 px-3 py-2 rounded-md text-base font-medium leading-5 text-white  hover:bg-gray-800 hover:no-underline focus:outline-none transition duration-150 ease-in-out"
                  onClick={() =>
                    dispatch(
                      setLoginModalState({
                        loginModalShowing: true,
                        activeAuthForm: "signIn"
                      })
                    )
                  }
                >
                  Sign in
                </button>
                <span className="inline-flex rounded-md shadow-sm">
                  <button
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white button focus:outline-none transition duration-150 ease-in-out"
                    onClick={() =>
                      dispatch(
                        setLoginModalState({
                          loginModalShowing: true,
                          activeAuthForm: "signUp"
                        })
                      )
                    }
                  >
                    Sign up
                  </button>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <Transition
        show={showNavMenu}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        as="div"
        className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-10"
      >
        <div className="rounded-lg shadow-lg">
          <div className="rounded-lg shadow-xs bg-nav divide-y-2 divide-gray-800">
            <div className="pt-5 pb-6 px-5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Link to="/">
                    <img
                      className="h-8 w-auto sm:h-10"
                      src={constans.cdnUrl + platformData.logo}
                      alt="Logo"
                    />
                  </Link>
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-800 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                    onClick={() => setShowNavMenu(false)}
                  >
                    {/*<!-- Heroicon name: x -->*/}
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <nav className="grid gap-y-8">
                  {(
                    (platformData &&
                      platformData.Links &&
                      [...platformData.Links].sort((a, b) => {
                        if (a.position > b.position) return 1;
                        if (a.position < b.position) return -1;
                        return 0;
                      })) ||
                    []
                  ).map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      className="-m-3 p-3 flex items-center space-x-3 rounded-md hover:bg-gray-800 transition ease-in-out duration-150"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="text-base leading-6 font-medium text-white">{link.title}</div>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <div className="space-y-6">
                {!currentUser ? (
                  <>
                    <span className="w-full flex rounded-md shadow-sm">
                      <button
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white button transition ease-in-out duration-150"
                        onClick={() =>
                          dispatch(
                            setLoginModalState({
                              loginModalShowing: true,
                              activeAuthForm: "signUp"
                            })
                          )
                        }
                      >
                        Sign up
                      </button>
                    </span>
                    <p className="text-center text-base leading-6 font-medium text-gray-500">
                      Existing customer?&nbsp;
                      <button
                        className="text-blue-600 hover:text-blue-500 transition ease-in-out duration-150"
                        onClick={() =>
                          dispatch(
                            setLoginModalState({
                              loginModalShowing: true,
                              activeAuthForm: "signIn"
                            })
                          )
                        }
                      >
                        Sign in
                      </button>
                    </p>
                  </>
                ) : (
                  <p className="text-center text-base leading-6 font-medium text-gray-500">
                    {currentUser.name}&nbsp;
                    <button
                      className="text-blue-600 hover:text-blue-500 transition ease-in-out duration-150"
                      onClick={() => dispatch(logoutAsync())}
                    >
                      Sign out
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Navbar;
