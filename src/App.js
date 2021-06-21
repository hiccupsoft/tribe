import React, { useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { Route, Switch, useLocation } from "react-router-dom";
import ContentPage from "./components/pages/ContentPage";
import CollectionPage from "./components/pages/CollectionPage";
import FrontPage from "./components/pages/FrontPage";
import { useDispatch, useSelector } from "react-redux";
import {
  getPlatformDataAsync,
  getPlatformDataByLiveDomainAsync
} from "./features/frontend/frontendSlice";
import Auth from "./components/auth/Auth";
import { checkAuthStatusAsync } from "./features/auth/authSlice";
import PrivateRoute from "./components/PrivateRoute";
import AuthPage from "./components/pages/AuthenticationPage";
import * as Fathom from "fathom-client";

const App = () => {
  const location = useLocation();

  const dispatch = useDispatch();

  const { platformData } = useSelector(state => state.frontend);

  useEffect(() => {
    let defaultSubdomain = "demoevent";
    let subdomain;
    if (
      window.location.host.includes("192.168.") ||
      window.location.host.includes("localhost") ||
      (window.location.host.includes("preview.tribesocial.io") &&
        !window.location.host.includes(".preview.tribesocial.io"))
    ) {
      // localhost or preview.tribesocial.io homepage
      subdomain = defaultSubdomain;
      dispatch(getPlatformDataAsync({ subdomain }));
    } else if (window.location.host.includes(".preview.tribesocial.io")) {
      // *.preview.tribesocial.io platform
      subdomain = window.location.host.split(".")[0];
      dispatch(getPlatformDataAsync({ subdomain }));
    } else {
      // real domain
      dispatch(
        getPlatformDataByLiveDomainAsync({
          homepageUrl: window.location.host
        })
      ).then(data => {
        // default subdomain 100x if no match
        subdomain = data?.payload?.platformData?.slug || defaultSubdomain;

        dispatch(getPlatformDataAsync({ subdomain }));
      });
    }

    // check login status
    dispatch(checkAuthStatusAsync());

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (platformData.fathomAnalytics && !location.pathname.includes("dashboard")) {
      // FATHOM ANALYTICS Upon initial page load...
      Fathom.load(platformData.fathomAnalytics);

      // In the route changed event handler...
      // const onRouteChangeComplete = () => {
      //   Fathom.trackPageview();
      // };
    }
    // eslint-disable-next-line
  }, [platformData]);

  return (
    <>
      <Switch location={location}>
        <Route exact path="/" children={<FrontPage />} />
        <Route exact path="/auth/:form/:role?" component={AuthPage} />
        <PrivateRoute path="/dashboard" children={<DashboardLayout />} />
        <Route exact path="/:collection_slug" children={<CollectionPage />} />
        <Route exact path="/:collection_slug/:content_slug" children={<ContentPage />} />
      </Switch>
      <Auth />
    </>
  );
};

export default App;
