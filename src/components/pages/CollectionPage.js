import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
// import { Helmet } from "react-helmet";

import Navbar from "./Navbar";
import GridCollection from "./GridCollection";

// import { setLoginModalState } from "../../features/auth/authSlice";
//
import constants from "../../constants";
import ReactHtmlParser from "react-html-parser";
// import SecondaryCollection from "./SecondaryCollection";

const CollectionPage = () => {
  const { platformData } = useSelector(state => state.frontend);
  // const { currentUser } = useSelector((state) => state.auth);
  const [collection, setCollection] = useState({});
  const { pathname } = useLocation();

  useEffect(() => {
    const collectionSlug = pathname.split("/").slice(1)[0];

    // find collection with slug collectionSlug
    const collectionTemp =
      platformData.Collections &&
      platformData.Collections.find(collection => collection.slug === collectionSlug);

    if (!collectionTemp) return;

    setCollection(collectionTemp);

    // scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // eslint-disable-next-line
  }, [platformData.Collections, pathname]);

  return (
    <>
      <div
        className="collectionpage "
        style={{
          backgroundColor: `${platformData.lightColor}`
        }}
      >
        <Navbar />

        <div className="sm:mx-3 md:mx-auto w-full sm:max-w-6xl px-0 sm:px-10 mt-12 sm:mt-16 ">
          <div
            className=" px-8 sm:px-10 py-16 sm:py-32 md:py-40 sm:rounded-t-lg overflow-hidden  "
            style={{
              backgroundImage: `url(" ${
                constants.cdnUrl + "tr:ar-16-9,w-1920/" + collection.collectionBGImage
              }")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundColor: `${platformData.darkColor}`
            }}
          >
            <div className=" text-xl sm:text-4xl text-center text-white font-bold font-weight-bold">
              {/*{collection.name}*/}
            </div>
          </div>
          <div className="bg-gray-300 sm:rounded-b-lg py-6 px-6 ">
            <div className="text-2xl leading-6 text-gray-800 font-bold font-weight-bold">
              {collection.name}
            </div>
            <div className="max-w-2xl pt-3 text-gray-800 leading-5">{ReactHtmlParser(collection.description)}</div>

            <div className="hidden">
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                <select
                  id="tabs"
                  name="tabs"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option>My Account</option>
                  <option>Company</option>
                  <option selected>Team Members</option>
                  <option>Billing</option>
                </select>
              </div>
              <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <span className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      My Account
                    </span>
                    <span className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      Company
                    </span>
                    <span
                      className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                      aria-current="page"
                    >
                      Team Members
                    </span>
                    <span className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      Billing
                    </span>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <GridCollection
          overrideTitle={"All Content"}
          // filterContent={content.id}
          collection={collection}
          customBGColor={platformData.lightColor}
        />
      </div>
    </>
  );
};

export default CollectionPage;
