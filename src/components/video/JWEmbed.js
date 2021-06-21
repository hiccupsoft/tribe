import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useLocation } from "react-router-dom";
//import VideoPlayer from "react-video-js-player";
import { getVideoUrlByPartialNameAsync } from "../../features/content/contentSlice";
//import VideoJsPlayer from "./VideoJsPlayer";
import videojs from "video.js";

const JWEmbed = ({ contentId }) => {
  const videoRef = useRef(null);
  //const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { currentContentUrl, loading } = useSelector(state => state.content);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    dispatch(getVideoUrlByPartialNameAsync({ partialName: contentId })).then(action => {
      if (player) {
        player.src(action.payload.data.url);
      } else {
        setPlayer(
          videojs(
            videoRef.current,
            {
              autoplay: true,
              controls: true,
              sources: {
                src: action.payload.data.url
              }
            },
            function onPlayerReady() {
              //console.log("onPlayerReady", this);
            }
          )
        );
      }
    });

    /*return () => {
      if (player) {
        console.log("disposing");
        player.dispose();
      }
    };*/
    // eslint-disable-next-line
  }, [contentId]);

  return currentContentUrl ? (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js"></video>
    </div>
  ) : (
    <div style={{ color: "white", display: "flex", justifyContent: "center" }}>
      {loading ? "loading..." : "video not found"}
    </div>
  );
};

export default JWEmbed;
