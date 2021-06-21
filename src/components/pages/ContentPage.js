import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { setLoginModalState } from "../../features/auth/authSlice";
import UpgradeModal from "../UpgradeModal";
import Ads from "./Ads";
import Navbar from "./Navbar";
import SecondaryCollection from "./SecondaryCollection";
import VideoPreview from "./VideoPreview";
import constants from "../../constants";
import { stripHtmlTags } from "../../utils";

const ContentPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { platformData } = useSelector(state => state.frontend);
  const { currentUser } = useSelector(state => state.auth);
  const [content, setContent] = useState(null);
  const [collection, setCollection] = useState({});
  const [mayAccess, setMayAccess] = useState(undefined);
  const [upgradeModalShowing, setUpgradeModalShowing] = useState(false);

  const { pathname } = useLocation();

  const bgTreatment = constants.cdnUrl + collection.collectionBGImage;

  useEffect(() => {
    const collectionSlug = pathname.split("/").slice(1)[0];

    // find collection with slug collectionSlug
    const collectionTemp =
      platformData.Collections &&
      platformData.Collections.find(collection => collection.slug === collectionSlug);

    if (!collectionTemp) return;

    setCollection(collectionTemp);

    const contentSlug = pathname.split("/").slice(1)[1];

    // find the content with slug contentSlug
    const contentTemp = collectionTemp.Contents.find(content => content.slug === contentSlug);

    if (!contentTemp) return;

    setContent(contentTemp);

    // scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // eslint-disable-next-line
  }, [platformData.Collections, pathname]);

  useEffect(() => {
    if (currentUser && ("sa" === currentUser.role || "admin" === currentUser.role)) {
      // admins, sas, have no restrictions
      setMayAccess(true);
      return;
    }

    if (content && "public" === content.visibility) {
      // no  restrictions
      setMayAccess(true);
      return;
    } else if (content && !currentUser) {
      setMayAccess(false);

      if ("true" === localStorage.getItem("visited")) {
        // visited previously
        dispatch(
          setLoginModalState({
            loginModalShowing: true,
            activeAuthForm: "signUp",
            redirectOnCloseTo: "/"
          })
        );
      } else {
        // had never visited
        dispatch(
          setLoginModalState({
            loginModalShowing: true,
            activeAuthForm: "signIn",
            redirectOnCloseTo: "/"
          })
        );
        localStorage.setItem("visited", "true");
      }

      return;
    }

    // FREE, BASIC and PREMIUM CONTENT
    if (content && "free" === content.visibility) {
      if (
        currentUser &&
        ("free" === currentUser.role ||
          "basic" === currentUser.role ||
          "premium" === currentUser.role)
      ) {
        setMayAccess(true);
      } else {
        setMayAccess(false);
      }
    } else if (content && "basic" === content.visibility) {
      if (currentUser && ("basic" === currentUser.role || "premium" === currentUser.role)) {
        setMayAccess(true);
      } else {
        setMayAccess(false);
      }
    } else if (content && "premium" === content.visibility) {
      if (currentUser && "premium" === currentUser.role) {
        setMayAccess(true);
      } else {
        setMayAccess(false);
      }
    }

    // eslint-disable-next-line
  }, [content, currentUser]);

  useEffect(() => {
    if (false === mayAccess) {
      // show insufficient role modal
      setUpgradeModalShowing(true);
    } else {
      setUpgradeModalShowing(false);
    }
  }, [mayAccess, currentUser]);

  return (
    content && (
      <>
        {collection?.name && content?.title && platformData?.name && (
          <Helmet>
            <title>{`${collection?.name}: ${content?.title} - ${platformData?.name}`}</title>
            <meta name="description" content={stripHtmlTags(content?.description)} />
            <meta name="og:description" content={stripHtmlTags(content?.description)} />
            <meta name="og:image" content={constants.cdnUrl + content?.featuredImage || ""} />
            <meta name="og:title" content={content?.title || ""} />
          </Helmet>
        )}
        <div className="contentpage">
          <Navbar />

          <div
            className="bg-gray-900 relative overflow-hidden"
            style={{
              backgroundImage: `url("${bgTreatment}")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundColor: `${platformData.darkColor}`
            }}
          >
            {/* Decorative background element */}
            {collection.collectionBGImage === null && (
              <div className="relative xl:max-w-8xl mx-auto hidden md:block" style={{ zIndex: 0 }}>
                <div
                  className="absolute hidden top-0 left-0 ml-11 mt-7"
                  style={{
                    width: 319,
                    height: 319,
                    backgroundColor: `${platformData.primaryColor}`,
                    background: `linear-gradient(90deg, #21282f 17px, transparent 1%) center,
              linear-gradient(#21282f 17px, transparent 1%) center,
              rgba(229, 231, 235, 0.2)`
                  }}
                />
              </div>
            )}

            {/* END Decorative background element */}

            {mayAccess ? <VideoPreview content={content} /> : <div className="h-64 mb-32"></div>}

            {/* ADS MODULE */}

            <Ads
              platformDark={platformData.darkColor}
              platformPrimary={platformData.primaryColor}
              collection={collection}
            />
          </div>

          {/* UP NEXT */}
          {collection?.Contents?.length && collection?.Contents?.length > 1 && (
            <SecondaryCollection
              n={1}
              overrideTitle={"Up Next"}
              filterContent={content.id}
              collection={collection}
            />
          )}
        </div>
        <UpgradeModal
          modalShowing={upgradeModalShowing}
          content={content}
          currentUser={currentUser}
          closeModal={() => {
            setUpgradeModalShowing(false);
            history.push("/");
          }}
        />
      </>
    )
  );
};

export default ContentPage;
