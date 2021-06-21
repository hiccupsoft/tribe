import React from "react";
import constants from "../../constants.json";
import { useSelector } from "react-redux";

const HomeHero = () => {
  // const dispatch = useDispatch();
  const { platformData } = useSelector(state => state.frontend);

  return (
    <div
      className="relative white-text bg-gray-50 overflow-hidden"
      style={{
        backgroundImage: `url("${constants.cdnUrl + platformData.heroImage}?tr=w-2000")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="relative pt-6 pb-12 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
        {platformData && platformData.logo && (
          <main
            className="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28"
            style={platformData.heroImgOnly ? { visibility: "hidden" } : {}}
          >
            <div className="text-center">
              {/*<span className="text-uppercase text-gray-900">WELCOME TO</span>*/}
              <h2
                className="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl"
                style={{ color: `${platformData.heroTextColor}` }}
              >
                {platformData.name}
              </h2>
              <p
                className="mt-3 max-w-sm mx-auto text-base text-gray-900 sm:text-lg md:mt-5 md:text-xl md:max-w-lg"
                style={{ color: `${platformData.heroTextColor}` }}
              >
                {platformData.description}
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <a
                    href="#firstcollection"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-500 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                    style={{
                      backgroundColor: `${platformData.primaryColor}`,
                      color: `${platformData.lightColor}`
                    }}
                  >
                    Start Watching
                  </a>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <a
                    target="_blank"
                    href={platformData.upgradeUrl}
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-gray-800 bg-white hover:text-gray-900 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                    style={{
                      backgroundColor: `${platformData.lightColor}`,
                      color: `${platformData.primaryColor}`
                    }}
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default HomeHero;
