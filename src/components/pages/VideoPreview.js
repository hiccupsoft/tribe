import React, { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import VideoTag from "./VideoTag";
import YoutubeEmbed from "../video/YoutubeEmbed";
import VimeoEmbed from "../video/VimeoEmbed";
import JWEmbed from "../video/JWEmbed";
import Resi from "../video/ResiEmbed";
import constants from "../../constants.json";
import VideoPlayer from "react-video-js-player";
import * as moment from "moment";
import Chat from "../chat/Chat";

const VideoPreview = ({ content }) => {
  const [isReadingMore, setIsReadingMore] = useState(false);

  const isDescriptionLong = () => ReactHtmlParser(content.description).length > 1; // more than one paragraph
  const renderAbbregedDescription = () => (
    <div className="contentDescription prose">
      {ReactHtmlParser(content.description)[0]}
      <div>...</div>
    </div>
  );

  return (
    content && (
      <div className="block md:flex mx-0 md:mx-auto max-w-8xl px-0 md:px-10 mt-0 md:mt-5 lg:mt-10 xl:mt-20">
        <div
          className={`w-full ${content.chatEnabled ? "md:w-2/3 md:mx-0" : "md:mx-10"} mb-5 md:mb-0`}
        >
          <div className="fixed w-full md:relative top-14 md:top-0 z-10 bg-black">
            {"video embed" === content.type && content.contentURI?.includes("youtu") && (
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  paddingBottom: "56.25%"
                }}
              >
                <YoutubeEmbed src={content.contentURI} />
              </div>
            )}
            {"video embed" === content.type && content.contentURI?.includes("vimeo") && (
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  paddingBottom: "56.25%"
                }}
              >
                <VimeoEmbed src={content.contentURI} />
              </div>
            )}
            {"jw video" === content.type && (
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  paddingBottom: "56.25%"
                }}
              >
                <JWEmbed contentId={content.contentURI} />
              </div>
            )}
            {"resi" === content.type && (
              <Resi contentId={content.contentURI} featuredThumb={content.featuredImage} />
            )}
            {"video" === content.type && (
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  paddingBottom: "56.25%"
                }}
              >
                <VideoPlayer
                  controls={true}
                  src={constants.cdnUrl + content.video}
                  allowFullScreen
                />
              </div>
            )}
            {/* {"jw live channel" === content.type && } */}
          </div>

          {/* video meta */}

          <div className="hidden md:flex justify-between items-center mt-5 md:mt-10 mx-5 md:mx-10 md:mx-0">
            <div>
              <h1 className="font-bold text-white md:text-3xl leading-7 capitalize">
                {content.title}
              </h1>
              <VideoTag />
            </div>
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div className="invisible md:visible">
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={
                      content.User && content.User.photoUrl
                        ? constants.cdnUrl + content.User.photoUrl
                        : "/anon.png"
                    }
                    alt={content.User && content.User.name}
                  />
                </div>
                <div className="ml-3">
                  <div className="pb-1 text-pale-sky text-xs leading-3 lg:leading-4 font-semibold capitalize md:text-base md:leading-5 lg:text-sm lg:leading-4">
                    {content.User && content.User.name}
                  </div>
                  <div className="text-gray-500 text-xs leading-3 font-medium md:text-base md:leading-5 lg:text-sm lg:leading-4">
                    {moment(content.publishedDate).add(1, "days").format("ll")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* description */}

          <div className="hidden md:block pt-8 text-white text-md video-info mx-5 md:mx-10 md:mx-0">
            {isDescriptionLong() ? (
              isReadingMore ? (
                <div className="contentDescription prose">
                  {ReactHtmlParser(content.description)}
                </div>
              ) : (
                renderAbbregedDescription()
              )
            ) : (
              <div className=" contentDescription prose">
                {ReactHtmlParser(content.description)}
              </div>
            )}
            {isDescriptionLong() && (
              <div
                className="mt-2 flex items-center font-bold text-md leading-4 text-white capitalize cursor-pointer"
                onClick={() => setIsReadingMore(!isReadingMore)}
              >
                {isReadingMore ? "Read less" : "Read more"}
                {isReadingMore ? (
                  <span className="ml-2 transform rotate-180">
                    <svg
                      className="fill-current text-white"
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.05.59L7.125 5.17 2.2.59.687 2l6.438 6 6.438-6L12.05.59z"></path>
                    </svg>
                  </span>
                ) : (
                  <span className="ml-2">
                    <svg
                      className="transform fill-current text-white"
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.05.59L7.125 5.17 2.2.59.687 2l6.438 6 6.438-6L12.05.59z"></path>
                    </svg>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <Chat content={content} />
      </div>
    )
  );
};

export default VideoPreview;
