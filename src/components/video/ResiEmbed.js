import React from "react";
import ScriptTag from "react-script-tag";
// import constants from "../../constants.json";

const Resi = ({ contentId }) => (
  <>
    <ScriptTag
      isHydrating={false}
      type="text/javascript"
      src="https://control.resi.io/webplayer/loader.min.js"
    />
    <div className="  "
      // style={{
      //   backgroundColor: "black",
      //   backgroundImage: `url(" ${constants.cdnUrl + "tr:ar-16-9,w-1280/" + featuredThumb}")`,
      //   backgroundPosition: "center",
      //   backgroundSize: "cover",
      //   backgroundRepeat: "no-repeat",
      //   position: "relative",
      //   overflow: "hidden",
      //   paddingBottom: "56.25%",
      //   display: "flex",
      //   flexDirection: "column",
      //   flexWrap: "wrap",
      //   justifyContent: "center",
      //   alignItems: "stretch",
      //   alignContent: "stretch" }}
    >

      {/*<div className="text-white text-center bg-black font-bold text-lg sm:text-3xl absolute bottom-0 left-0 right-0 ">*/}
      {/*  This live video will be available soon...*/}
      {/*</div>*/}

    {/*

    Original Embed code from Resi
    <div id="resi-video-player"  data-type="event" data-embed-id="97a8b8b4-a4ba-4516-8115-453aaf94f052"></div>
      <script type="application/javascript" src="https://control.resi.io/webplayer/loader.min.js"></script>
     */}

      <div className="" id="resi-video-player" data-type="event" data-embed-id={`${contentId}`}></div>
        </div>
  </>
);

export default Resi;
