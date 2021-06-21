import React from "react";

const YoutubeEmbed = ({ src }) => {
  const extractYoutubeId = ytUrl => {
    const regex = /([a-zA-Z0-9-_]{8,})/gm;
    const str = src;
    let m;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      let result;
      m.forEach((match, groupIndex) => {
        if (1 === groupIndex) result = match;
      });
      return result;
    }
  };

  return (
    <iframe
      title="video"
      style={{ position: "absolute" }}
      width="100%"
      height="100%"
      scrolling="auto"
      src={`https://www.youtube.com/embed/${extractYoutubeId(src)}?autoplay=1`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

export default YoutubeEmbed;
