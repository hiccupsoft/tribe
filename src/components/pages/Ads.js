import React from "react";
import constants from "../../constants.json";
import PopupIframe from "./PopupIframe";

const ImageAd = ({ ad }) => (
  <div className=" w-full sm:max-w-xs ">
    <a target="_blank" rel="noopener noreferrer" href={ad.url}>
      <img className="w-full" alt="" src={constants.cdnUrl + ad.image + "?tr=w-500"} />
    </a>
  </div>
);

const EmbedAd = ({ ad }) => (
  <div className="max-w-xs ">
    <iframe className="w-full h-full " title="iframe" srcDoc={ad.embed} />
  </div>
);

const EmbedAdFull = ({ ad }) => (
  <div className="w-full" style={{ height: "40rem" }}>
    <iframe className="w-full h-full " title="iframe" srcDoc={ad.embed} />
  </div>
);

const PopupEmbedAd = ({ ad, platformDark, platformPrimary }) => (
  <div
    className="max-w-xs flex items-center text-center justify-center  text-center w-full max-w-xl"
    style={{ backgroundColor: `${platformPrimary}` }}
  >
    <PopupIframe platformDark={platformDark} headline={ad.title} embedURL={ad.embed} />
  </div>
);

const Ads = ({ collection, platformDark, platformPrimary }) => {
  const ads = collection.Ads || [];

  const images = ads.filter(ad => ad.type === "Image");

  const embeds = ads.filter(ad => ad.type === "Embed");

  const fullembed = ads.filter(ad => ad.type === "Embed Large");

  const popupembeds = ads.filter(ad => ad.type === "Popup Embed");

  return (
    <div className="block md:flex justify-start  mx-2 md:space-x-5 space-y-2 md:space-y-0 md:mx-auto pb-12 max-w-7xl px-5 sm:px-10  md:my-4 ">
      {images.map((ad, i) => (
        <ImageAd ad={ad} key={i} />
      ))}

      {fullembed.map((ad, i) => (
        <EmbedAdFull ad={ad} key={i} />
      ))}

      {embeds.map((ad, i) => (
        <EmbedAd ad={ad} key={i} />
      ))}

      {popupembeds.map((ad, i) => (
        <PopupEmbedAd
          platformDark={platformDark}
          platformPrimary={platformPrimary}
          ad={ad}
          key={i}
        />
      ))}
    </div>
  );
};

export default Ads;
