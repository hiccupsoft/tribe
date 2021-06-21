import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as IconPlay } from "../../assets/icons/icon-play.svg";
import VideoTag from "./VideoTag";
import * as moment from "moment";
import constants from "../../constants.json";

const MainCollection = ({ collections }) => {
  return (
    <div className=" py-20">
      <div className="block md:flex mx-5 md:mx-auto max-w-7xl px-5 sm:px-10  my-0 md:my-0">
        <div className="flex-1 mb-5 md:mb-0 hover:opacity-75 transition duration-150 ease-in-out">
          {collections && collections[0] && collections[0].Contents && collections[0].Contents[0] && (
            <Link to={`/${collections[0].slug}/${collections[0].Contents[0].slug}`}>
              <div className="relative">
                {/* collections[0].Contents[0] */}
                <img
                  alt=""
                  className="w-full"
                  src={constants.cdnUrl + collections[0].Contents[0].featuredImage}
                />
                <div className="absolute flex justify-center items-center w-full h-full top-0">
                  <IconPlay className="w-auto h-auto" />
                </div>
                <div className="absolute flex justify-start items-end w-full h-full top-0">
                  <div className="ml-5 sm:ml-10 pb-2 sm:pb-5">
                    <h1 className="text-white font-bold text-2xl">
                      {collections[0].Contents[0].title}
                    </h1>
                    <span className="text-white">by</span>{" "}
                    <span className="text-white font-bold text-lg">
                      {collections[0].Contents[0].User.name}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="w-full md:w-2/5 flex">
          <ul className="md:ml-10 flex flex-col justify-between">
            {((collections && collections[0] && collections[0].Contents) || []).map(
              (content, i) => {
                if (0 === i) return null;
                if (i >= 4) return null;
                return (
                  <li key={i} className="hover:opacity-75 transition duration-150 ease-in-out">
                    <Link to={`/${collections[0].slug}/${content.slug}`}>
                      <div className="flex mb-5 md:mb-3">
                        <div className="flex-1 relative">
                          <img
                            alt=""
                            className="h-full w-full object-cover"
                            src={constants.cdnUrl + content.featuredImage}
                            style={{ height: 127, maxWidth: 250 }}
                          />
                          <div className="absolute flex justify-center items-center w-full h-full top-0">
                            <IconPlay className="w-10 h-10" />
                          </div>
                        </div>

                        <div className="ml-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h2 className="capitalize  font-bold leading-1.14 text-sm sm:text-1.375 sm:leading-6 xl:text-lg xl:leading-4 w-full line-clamp">
                              {content.title}
                            </h2>
                            <div>
                              <span className="text-gray-700 text-tiny sm:text-sm xl:text-tiny leading-4 font-bold capitalize">
                                {content.User.name}
                              </span>
                              <span className="mx-1 bg-gray-700 rounded-full h-1 w-1 inline-flex align-middle"></span>
                              <span className="text-gray-700 text-xs leading-4 font-medium">
                                {moment(content.publishedDate).add(1, "days").format("ll")}
                              </span>
                            </div>
                          </div>
                          <div className="pb-1">
                            <VideoTag />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainCollection;
