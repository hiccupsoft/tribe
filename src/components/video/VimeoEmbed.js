import React from "react";

const VimeoEmbed = ({ src }) => {
  const extractVimeoId = vimeoLink => {
    const regex = /[0-9]+/gm;
    const str = vimeoLink;
    let m;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      let result;
      m.forEach((match, groupIndex) => {
        result = match;
      });
      return result;
    }
  };

  return (
    <>
      <iframe
        src={`https://player.vimeo.com/video/${extractVimeoId(
          src
        )}?title=0&byline=0&portrait=0&badge=0&autoplay=1`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }}
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        title="video"
      ></iframe>
    </>
  );
};

export default VimeoEmbed;
