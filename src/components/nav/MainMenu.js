import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import * as OutlineIcons from "../../assets/icons/outline";

const MainMenu = () => {
  const { pathname } = useLocation();
  const { currentUser } = useSelector(state => state.auth);
  return (
    <nav className="px-2 space-y-1">
      <Link
        to="/"
        className={`group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-blue-300 focus:outline-none transition ease-in-out duration-150`}
        target="_blank"
      >
        <OutlineIcons.DesktopComputer className="h-6 mr-4" />
        Visit Website
      </Link>
      <Link
        to="/dashboard/contents"
        className={`${
          "/dashboard/contents" === pathname && "bg-blue-300"
        } group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-blue-300 focus:outline-none transition ease-in-out duration-150`}
      >
        <OutlineIcons.Play className="h-6 mr-4" />
        Content
      </Link>
      <Link
        to="/dashboard/collections"
        className={`${
          "/dashboard/collections" === pathname && "bg-blue-300"
        } group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-blue-300 focus:outline-none transition ease-in-out duration-150`}
      >
        <OutlineIcons.ViewGridAdd className="h-6 mr-4" />
        Collections
      </Link>
      <Link
        to="/dashboard/ads"
        className={`${
          "/dashboard/ads" === pathname && "bg-blue-300"
        } group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-blue-300 focus:outline-none transition ease-in-out duration-150`}
      >
        <OutlineIcons.Cash className="h-6 mr-4" />
        Ads
      </Link>
      <Link
        to="/dashboard/users"
        className={`${
          ("/dashboard/users" === pathname || "/dashboard" === pathname) && "bg-blue-300"
        } group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-blue-300 focus:outline-none transition ease-in-out duration-150`}
      >
        <OutlineIcons.Users className="h-6 mr-4" />
        Users
      </Link>
      <Link
        to="/dashboard/links"
        className={`${
          "/dashboard/links" === pathname && "bg-blue-300"
        } group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-blue-300 focus:outline-none transition ease-in-out duration-150`}
      >
        <OutlineIcons.Link className="h-6 mr-4" />
        Links
      </Link>
      {("admin" === currentUser.role || "sa" === currentUser.role) && (
        <Link
          to="/dashboard/platforms"
          className={`${
            "/dashboard/platforms" === pathname && "bg-blue-300"
          } group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-blue-300 focus:outline-none transition ease-in-out duration-150`}
        >
          <OutlineIcons.ViewBoards className="h-6 mr-4" />
          Platform
        </Link>
      )}{" "}
      <a
        href="https://support.tribesocial.io/"
        rel="noreferrer noopener"
        target="_blank"
        alt="Get support from tribesocial."
        className={`group flex items
        -center px-2 py-2 text-sm leading-6 font-medium rounded-md text-gray-100 hover:text-white hover:bg-blue-300 focus:outline-none transition ease-in-out duration-150`}
      >
        <OutlineIcons.QuestionMarkCircle className="h-6 mr-4" />
        Need Help?
      </a>
    </nav>
  );
};

export default MainMenu;
