//AUTH AS A PAGE

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import useQuery from "../general/chat/hooks/useQuery";
import useAnimationFrame from "../general/chat/hooks/useAnimationFrame";
import { useLocation, useParams, Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import constants from "../../constants.json";
import { useDispatch } from "react-redux";
import { upsertUserAsync } from "../../features/user/userSlice";
import { loginAsync, checkAuthStatusAsync } from "../../features/auth/authSlice";
import Logo from "../nav/Logo";

const Authenticate = () => {
  const { platformData } = useSelector(state => state.frontend);
  const { basicToken, premiumToken } = platformData;
  const { error, currentUser } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { form, role } = useParams();
  const history = useHistory();
  const query = useQuery();
  const location = useLocation();

  const [emailValidation, setEmailValidation] = useState({
    existing: false,
    message: ""
  });
  const [state, setState] = useState({}); // form state
  const [heading, setHeading] = useState("Sign Up");
  const roleValues = {
    free: 0,
    basic: 1,
    premium: 2
  };
  //#region Logic used for the redirect timer, if a user is already logged in.
  const redirectTimer = useRef();
  const userRef = useRef();
  async function startTimer() {
    if (redirectTimer.current && userRef.current) {
      let time = parseInt(redirectTimer.current.innerText);
      if (time - 1 > 0) {
        redirectTimer.current.innerText = time - 1;
      } else {
        if (
          !/admin|sa/i.test(userRef.current.role) &&
          roleValues[userRef.current.tokenType] > roleValues[userRef.current.role]
        ) {
          try {
            delete userRef.current.tokenType;
            if (userRef.current.password) {
              delete userRef.current.password;
            }
            const userAction = await dispatch(
              upsertUserAsync({
                user: userRef.current,
                PlatformId: platformData.id
              })
            );
            if (userAction?.type === "user/upsert/fulfilled") {
              const authStatus = await dispatch(checkAuthStatusAsync());
              if (authStatus?.type === "auth/status/fulfilled") {
                history.push("/");
              }
            }
          } catch (e) {
            history.push("/");
          }
        } else {
          history.push("/");
        }
      }
    }
  }
  useAnimationFrame(1000, startTimer);
  //End code for an already logged in user.
  //#endregion

  useEffect(() => {
    // scroll to top
    const token = query.get("token");
    let heading = /signin/i.test(form) ? "Sign In" : "Create your account";
    if (token === premiumToken) {
      heading = /signup/i.test(form) ? "Create your Premium account" : "Sign in to upgrade";
    }

    if (currentUser?.hasOwnProperty("id")) {
      userRef.current = {
        ...currentUser,
        token,
        tokenType: token === premiumToken ? "premium" : "basic"
      };
    }
    setHeading(heading);
  }, [currentUser, form, premiumToken, basicToken, query, role, history]);

  const onChange = event => {
    const { name, value } = event.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const checkEmail = event => {
    const emailRegex = /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/i;
    const { value } = event.target;
    if (emailRegex.test(value)) {
      return fetch("/user/validate/" + value)
        .then(res => res.json())
        .then(res => {
          if (res) {
            if (/signup/i.test(form)) {
              setEmailValidation({
                existing: true,
                message: "Looks like you already have an account!"
              });
            }
          } else {
            if (/signin/i.test(form)) {
              setEmailValidation({
                existing: false,
                message: "Doesn't look like you have an account yet."
              });
            }
          }
        });
    } else if (value) {
      return setEmailValidation({
        existing: false,
        message: "Invalid email format."
      });
    }
    return setEmailValidation({
      existing: false,
      message: ""
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    const token = query.get("token");
    if (/signup/.test(form)) {
      if (token === basicToken || token === premiumToken) {
        state.token = token;
      }
      state.role = "free";
      dispatch(upsertUserAsync({ user: state, PlatformId: platformData.id }))
        .then(action => {
          if (action?.type === "user/upsert/fulfilled") {
            return dispatch(loginAsync(state));
          }
        })
        .then(action => {
          if (action?.type === "auth/signin/fulfilled") {
            return history.push("/");
          }
        });
    } else {
      dispatch(loginAsync(state)).then(action => {
        const { payload } = action;
        if (action?.type === "auth/signin/fulfilled") {
          const user = Object.assign({}, payload);
          const tokenType = token === premiumToken ? "premium" : "basic";
          if (token && roleValues[tokenType] > roleValues[user.role]) {
            delete user.password;
            user.token = token;
            dispatch(upsertUserAsync({ user, PlatformId: platformData.id }))
              .then(() => dispatch(checkAuthStatusAsync()))
              .then(() => history.push("/"));
          } else {
            history.push("/");
          }
        }
      });
    }
  };

  return (
    <div
      style={{ backgroundColor: platformData.darkColor }}
      className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gray-400 py-12 px-4 sm:px-6 lg:px-8"
    >
      {platformData && (
        <Helmet>
          <title>{platformData?.name || ""}</title>
          <meta name="description" content={platformData?.description || ""} />
          <meta name="og:description" content={platformData?.description || ""} />
          <meta name="og:image" content={constants.cdnUrl + platformData?.heroImage || ""} />
          <meta name="og:title" content={platformData?.name || ""} />
        </Helmet>
      )}
      {currentUser?.id ? (
        <div className="max-w-md w-full space-y-8 border p-8 rounded-md">
          <div className="mx-auto text-gray-100 text-center">
            You are already logged in.{" "}
            {query.get("token") &&
              `Your role will be set to ${
                query.get("token") === premiumToken ? "premium" : "basic"
              }.`}
            <br />
            <p>
              Redirecting you in <span ref={redirectTimer}>10</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full space-y-8 border p-8 rounded-md">
          <div className="flex justify-center">
            <Logo className="mx-auto" />
          </div>
          <div className="sm:mx-auto">
            <h2 className="mt-6 text-center text-3xl leading-9 font-bold text-gray-100 capitalize">
              {heading}
            </h2>
            <p className="mt-2 text-center text-sm leading-5 text-gray-100 max-w">
              Or&nbsp;
              <Link
                style={{ color: platformData.primaryColor }}
                to={{
                  pathname: /signin/i.test(form) ? "/auth/signup" : "/auth/signin",
                  search: location.search
                }}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
              >
                {/signin/i.test(form) ? "create an account" : "sign in to your account"}
              </Link>
            </p>
          </div>

          <form onSubmit={event => onSubmit(event)}>
            {error && <p className="text-sm leading-5 font-medium text-red-800 mb-1">{error}</p>}
            {/signup/.test(form) && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-100">
                  Full name
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="name"
                    name="name"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    value={(state && state.name) || ""}
                    onChange={event => onChange(event)}
                  />
                </div>
              </div>
            )}

            <div className="mt-6">
              <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-100">
                Email address
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  value={(state && state.email) || ""}
                  onChange={event => onChange(event)}
                  onBlur={checkEmail}
                  onFocus={() => setEmailValidation({ message: "", existing: false })}
                />
              </div>
              {emailValidation.message &&
                (/signup/i.test(form) ? (
                  <p className="text-sm leading-5 font-medium text-red-800 mb-1">
                    {emailValidation.existing && (
                      <span>
                        {emailValidation.message} Please{" "}
                        <Link
                          style={{ color: platformData.primaryColor }}
                          to={{
                            pathname: "/auth/signin",
                            search: location.search
                          }}
                          onClick={() => setEmailValidation({ existing: false, message: "" })}
                        >
                          sign in
                        </Link>{" "}
                        here
                        {query.get("token") === premiumToken
                          ? ", to upgrade your account to PREMIUM!"
                          : "."}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-sm leading-5 font-medium text-red-800 mb-1">
                    {!emailValidation.existing && (
                      <span>
                        {emailValidation.message} Please{" "}
                        <Link
                          style={{ color: platformData.primaryColor }}
                          to={{
                            pathname: "/auth/signup",
                            search: location.search
                          }}
                          onClick={() => setEmailValidation({ existing: false, message: "" })}
                        >
                          sign up
                        </Link>{" "}
                        here
                        {query.get("token") === premiumToken
                          ? ", to create your PREMIUM account!"
                          : "."}
                      </span>
                    )}
                  </p>
                ))}
            </div>

            <div className="mt-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-5 text-gray-100"
              >
                Password
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  value={(state && state.password) || ""}
                  onChange={event => onChange(event)}
                />
              </div>
            </div>
            <div className="mt-6">
              <span className="block w-full rounded-md shadow-sm">
                <button
                  style={{ backgroundColor: platformData.primaryColor }}
                  type="submit"
                  className="disabled:opacity-20 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:shadow-outline-indigo active:bg-blue-700 transition duration-150 ease-in-out"
                >
                  {/signup/i.test(form) ? "Create an account" : "Sign in"}
                </button>
              </span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Authenticate;
