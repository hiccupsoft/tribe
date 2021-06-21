import React, { useEffect, useRef, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { Transition } from "@tailwindui/react";
import Logo from "./components/nav/Logo";
import MainMenu from "./components/nav/MainMenu";
import Platforms from "./components/pages/dashboard/Platforms";
import Users from "./components/pages/dashboard/Users";
import Contents from "./components/pages/dashboard/Contents";
import Collections from "./components/pages/dashboard/Collections";
import Ads from "./components/pages/dashboard/Ads";
import Notification from "./components/pages/dashboard/general/Notification";
import { useDispatch, useSelector } from "react-redux";
import Links from "./components/pages/dashboard/Links";
import { logoutAsync } from "./features/auth/authSlice";
// import PrivateDashboardRoute from "./components/PrivateDashboardRoute";
import constants from "./constants.json";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const [profileDropdownIsOpen, setProfileDropdownIsOpen] = useState(false);
  const [offCanvasMenuIsOpen, setOffCanvasMenuIsOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationState = useSelector(state => state.notification);
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
      !profileMenuRef.current.contains(event.target)
    ) {
      // click outsite profileMenuRef
      setProfileDropdownIsOpen(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-cool-gray-100">
      {/*<!-- Off-canvas menu htmlFor mobile -->*/}

      <Transition show={offCanvasMenuIsOpen} as="div" className="lg:hidden">
        <div className="fixed inset-0 flex z-40">
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            as="div"
            className="fixed inset-0"
          >
            <div className="absolute inset-0 bg-cool-gray-600 opacity-75"></div>
          </Transition.Child>

          <Transition.Child
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
            as="div"
            className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-600"
          >
            <div className="absolute top-0 right-0 -mr-14 p-1">
              <button
                className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-cool-gray-600"
                aria-label="Close sidebar"
                onClick={() => setOffCanvasMenuIsOpen(false)}
              >
                <svg
                  className="h-6 w-6 text-white"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-shrink-0 flex items-center px-4">
              <Logo />
            </div>
            <div className="mt-5 overflow-y-auto">
              <MainMenu />
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14">
            {/*<!-- Dummy element to force sidebar to shrink to fit close icon -->*/}
          </div>
        </div>
      </Transition>
      {/*<!-- Static sidebar htmlFor desktop -->*/}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/*<!-- Sidebar component, swap this element with another sidebar if you like -->*/}
          <div className="flex flex-col flex-grow bg-gray-800 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Logo />
            </div>
            <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
              <div className="overflow-y-auto">
                <MainMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto focus:outline-none" tabIndex="0">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:border-none">
          <button
            className="cursor-pointer px-4 border-r border-cool-gray-200 text-cool-gray-400 focus:outline-none focus:bg-cool-gray-100 focus:text-cool-gray-600 lg:hidden"
            aria-label="Open sidebar"
            onClick={() => setOffCanvasMenuIsOpen(true)}
          >
            <svg
              className="h-6 w-6 transition ease-in-out duration-150"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>
          {/*<!-- Search bar -->*/}
          <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-7xl px-5 sm:px-10  lg:mx-auto lg:px-8">
            <div className="flex-1 flex">
              <form className="w-full flex md:ml-0" action="#" method="GET">
                <label htmlFor="search_field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-cool-gray-400 focus-within:text-cool-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="search_field"
                    className="block w-full h-full pl-8 pr-3 py-2 rounded-md text-cool-gray-900 placeholder-cool-gray-500 focus:outline-none focus:placeholder-cool-gray-400 sm:text-sm"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </form>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/*<!-- Profile dropdown -->*/}
              <div className="ml-3 relative">
                <div>
                  <button
                    className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:bg-cool-gray-100 lg:p-2 lg:rounded-md lg:hover:bg-cool-gray-100"
                    id="user-menu"
                    aria-label="User menu"
                    aria-haspopup="true"
                    onClick={() => setProfileDropdownIsOpen(!profileDropdownIsOpen)}
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src={
                        currentUser && currentUser.photoUrl
                          ? constants.cdnUrl + currentUser.photoUrl
                          : "/anon.png"
                      }
                      alt=""
                    />
                    <p className="hidden ml-3 text-cool-gray-700 text-sm leading-5 font-medium lg:block">
                      {currentUser && currentUser.name}
                    </p>
                    <svg
                      className="hidden flex-shrink-0 ml-1 h-5 w-5 text-cool-gray-400 lg:block"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <Transition
                  show={profileDropdownIsOpen}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div
                    ref={profileMenuRef}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg"
                  >
                    <div
                      className="py-1 rounded-md bg-white shadow-xs"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <button
                        className="w-full block px-4 py-2 text-sm text-cool-gray-700 hover:bg-cool-gray-100 transition ease-in-out duration-150"
                        role="menuitem"
                        onClick={() => dispatch(logoutAsync())}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>

        <Switch>
          <Route exact path="/dashboard">
            <Users />
          </Route>
          <Route exact path="/dashboard/platforms">
            <Platforms />
          </Route>
          <Route exact path="/dashboard/users">
            <Users />
          </Route>
          <Route exact path="/dashboard/contents">
            <Contents />
          </Route>
          <Route exact path="/dashboard/collections">
            <Collections />
          </Route>
          <Route exact path="/dashboard/ads">
            <Ads />
          </Route>
          <Route exact path="/dashboard/links">
            <Links />
          </Route>
        </Switch>
      </div>

      <Notification notificationState={notificationState} />
    </div>
  );
};

export default DashboardLayout;
