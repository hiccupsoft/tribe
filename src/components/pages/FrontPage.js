import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import HomeHero from "./HomeHero";
import Navbar from "./Navbar";
import SecondaryCollection from "./SecondaryCollection";
import constants from "../../constants.json";

const FrontPage = () => {
  const { platformData } = useSelector(state => state.frontend);
  const history = useHistory();

  useEffect(() => {
    // scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // If user has single collection with single content item, redirect there
  useEffect(() => {
    //console.log('platform data', platformData)
    if (
      platformData?.Collections?.length === 1 &&
      platformData?.Collections?.[0]?.Contents?.length === 1
    )
      history.replace(
        `/${platformData.Collections[0].slug}/${platformData.Collections[0].Contents[0].slug}`
      );
  }, [platformData, history]);

  return (
    <div className="relative overflow-hidden frontpage">
      {platformData && (
        <Helmet>
          <title>{platformData?.name || ""}</title>
          <meta name="description" content={platformData?.description || ""} />
          <meta name="og:description" content={platformData?.description || ""} />
          <meta name="og:image" content={constants.cdnUrl + platformData?.heroImage || ""} />
          <meta name="og:title" content={platformData?.name || ""} />
        </Helmet>
      )}
      <div className="relative max-w-8xl mx-auto hidden md:block" style={{ zIndex: -1 }}>
        <div
          className="absolute top-0 left-0 ml-5 bg-dots-white"
          style={{ width: "319px", height: "342px", marginTop: 85 }}
        ></div>
      </div>

      <Navbar />

      <div></div>

      <HomeHero />
      {/*<MainCollection collections={platformData && platformData.Collections} />*/}

      {platformData &&
        platformData.Collections &&
        platformData.Collections.slice(0).map((collection, i) => (
          <SecondaryCollection key={i} n={i} collection={collection} />
        ))}
    </div>
  );
};

export default FrontPage;
