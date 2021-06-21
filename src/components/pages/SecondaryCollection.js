import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as moment from "moment";
import { ReactComponent as IconArrow } from "../../assets/icons/icon-arrow.svg";
import { ReactComponent as IconPlay } from "../../assets/icons/icon-play.svg";
import { ReactComponent as IconLock } from "../../assets/icons/icon-lock.svg";
import { stripHtmlTags } from "../../utils";
import constants from "../../constants.json";
import { useSelector } from "react-redux";

const SecondaryCollection = ({ n, overrideTitle, filterContent, collection }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const sliderDiv = useRef(null);

  const [isReadingMore] = useState(false);

  const { platformData } = useSelector(state => state.frontend);

  const Arrow = ({ child, className, onClick }) => {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-white shadow-blue text-gray-500 cursor-pointer ${className}`}
        style={{ width: "38px", height: "38px" }}
        onClick={onClick}
      >
        {child}
      </div>
    );
  };

  const goNext = () => {
    sliderDiv.current.scrollTo({
      left: sliderDiv.current.scrollLeft + 700 + 15,
      behavior: "smooth"
    });
    setTimeout(() => {
      setIsBeginning(false);
      if (
        sliderDiv.current.scrollLeft + sliderDiv.current.offsetWidth >=
        sliderDiv.current.scrollWidth
      ) {
        setIsEnd(true);
      }
    }, 500);
  };

  const goPrev = () => {
    sliderDiv.current.scrollTo({
      left: sliderDiv.current.scrollLeft - 700 - 15,
      behavior: "smooth"
    });
    setTimeout(() => {
      setIsEnd(false);
      if (0 === sliderDiv.current.scrollLeft) {
        setIsBeginning(true);
      }
    }, 500);
  };

  const ArrowLeft = () =>
    Arrow({
      child: <IconArrow className="fill-current" />,
      className: `mr-2 ${
        isBeginning ? "" : "text-purple-400 hover:opacity-50 transition duration-150 ease-in-out"
      }`,
      onClick: isBeginning ? () => {} : goPrev
    });

  const ArrowRight = () =>
    Arrow({
      child: <IconArrow className="fill-current" />,
      className: `transform rotate-180 ${
        isEnd ? "" : "text-purple-400 hover:opacity-50 transition duration-150 ease-in-out"
      }`,
      onClick: isEnd ? () => {} : goNext
    });

  const orderByPublishedDate = contents =>
    contents
      .slice()
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  return (
    <div className={`${n % 2 !== 0 ? "bg-white" : "bg-gray-50"} pt-12 pb-12 `}>
      {/* white decorative element */}
      {n % 2 !== 0 && (
        <div className="relative max-w-8xl mx-auto hidden xl-block">
          <div
            className="absolute top-0 left-0 bg-dots-white"
            style={{ width: 66, height: 130 }}
          ></div>
        </div>
      )}
      <span id="firstcollection"></span>
      <div className="mx-3 md:mx-auto max-w-7xl px-0 sm:px-10  ">
        <div className="flex justify-between pb-5 sm:pb-7">
          <Link to={`/${collection.slug}`}>
            <h1 className="collection-title text-xl sm:text-4xl font-bold">
              {overrideTitle ? overrideTitle : collection.name}
            </h1>
          </Link>
          <div className="flex items-center ml-2">
            <ArrowLeft /> <ArrowRight />
          </div>
        </div>
        <div>
          <ul ref={sliderDiv} className="flex space-x-5 flex-no-wrap overflow-hidden">
            {orderByPublishedDate(collection.Contents || []).map((content, i) => {
              if (content.id === filterContent) return null;

              if (moment().isBefore(content.publishedDate)) return null;
              if (moment().isAfter(content.expireDate)) return null;
              const description = stripHtmlTags(content?.description);
              return (
                <li
                  key={i}
                  className="hover:opacity-75 transition duration-150 ease-in-out"
                  style={{ width: 350 }}
                >
                  <Link to={`/${collection.slug}/${content.slug}`}>
                    <div className="relative" style={{ width: 350 }}>
                      {content.featuredImage ? (
                        <img
                          className="h-full w-full object-cover"
                          src={constants.cdnUrl + "tr:ar-16-9,w-500/" + content.featuredImage}
                          alt="logo"
                        />
                      ) : (
                        <img
                          className="h-full w-full object-cover"
                          src={constants.cdnUrl + "tr:ar-16-9,w-500/" + platformData.heroImage}
                          alt="logo"
                        />
                      )}

                      <div className="absolute flex justify-center items-center w-full h-full top-0">
                        <IconPlay className="w-auto h-auto" />
                      </div>
                      {"public" === content.visibility && (
                        <div className="absolute flex top-5 right-5 text-gray-800 bg-gray-100 px-3 py-0.5 text-xs leading-3 rounded-full capitalize inline-flex items-center justify-center font-medium text-0.5 leading-tight sm:text-xs sm:leading-3">
                          Public
                        </div>
                      )}

                      {"free" === content.visibility && (
                        <div className="absolute flex top-5 right-5  text-green-800 bg-green-100 px-3 py-0.5 text-xs leading-3 rounded-full capitalize inline-flex items-center justify-center font-medium text-0.5 leading-tight sm:text-xs sm:leading-3">
                          Free
                        </div>
                      )}

                      {"basic" === content.visibility && (
                        <div className="absolute flex top-5 text-blue-700 bg-blue-100 right-5  px-3 py-0.5 text-xs leading-3 rounded-full capitalize inline-flex items-center justify-center font-medium text-0.5 leading-tight sm:text-xs sm:leading-3">
                          <IconLock className="  fill-current w-3 h-3 mr-1" /> Basic
                        </div>
                      )}
                      {"premium" === content.visibility && (
                        <div className="absolute flex top-5 right-5 text-purple-700 bg-purple-100 px-3 py-0.5 text-xs leading-3 rounded-full capitalize inline-flex items-center justify-center font-medium text-0.5 leading-tight sm:text-xs sm:leading-3">
                          <IconLock className="  fill-current w-3 h-3 mr-1" /> Premium
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <h2 className="mt-2 font-base font-bold  line-clamp text-xl leading-6 sm:text-2xl">
                        {content.title}
                      </h2>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-700 text-xs mt-6 leading-3 font-semibold  mr-4 sm:text-base sm:leading-5">
                        {content.User?.name}
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-700 text-xs mt-2 leading-3 font-weight-normal  ml-4 sm:text-base sm:leading-5">
                        {moment(content.publishedDate).add(1, "days").format("ll")}
                      </span>

                      <div
                        className="text-gray-700 text-xs mt-2 leading-3 font-normal mr-3 sm:text-base sm:leading-5"
                        style={{ width: 350 }}
                      >
                        {description && description.length >= 110
                          ? isReadingMore
                            ? description
                            : description.slice(0, 110) + "..."
                          : description}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SecondaryCollection;
