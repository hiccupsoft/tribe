import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { flashNotificationAsync } from "../../features/notification/notificationSlice";
import { upsertPlatformAsync, clearError } from "../../features/platform/platformSlice";
import { ReactComponent as IconError } from "../../assets/icons/icon-error.svg";
import { deleteFile, uploadFileAsync } from "../../features/uploader/uploaderSlice";
import LoadingSpinner from "../LoadingSpinner";
import constants from "../../constants.json";
import UploaderFormField from "./utils/UploaderFormField";
import ColorPicker from "./utils/ColorPicker";

const PlatformForm = ({ model, closeModal }) => {
  const file = useRef(null);
  const [state, setState] = useState(model); // form state
  const { error } = useSelector(state => state.platform);
  const { loading, latestUploadedFileUrl } = useSelector(state => state.uploader);
  const dispatch = useDispatch();
  const onChange = event => {
    const { name, value } = event.target;

    if (error && error[name]) {
      dispatch(clearError({ field: name }));
    }

    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onSubmit = event => {
    event.preventDefault();
    dispatch(upsertPlatformAsync({ platform: state })).then(action => {
      if (!action.error) {
        dispatch(flashNotificationAsync({}));
        closeModal();
      }
    });
  };

  // upload file listener
  useEffect(() => {
    document.getElementById("file").onclick = event => {
      document.getElementById("file").value = null;
    };

    document.getElementById("file").onchange = event => {
      if (event.target.files && event.target.files.length > 0) {
        dispatch(uploadFileAsync({ id: "file" }));
      }
    };

    return () => {
      dispatch(deleteFile());
      deleteFileFromModel();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!model || (state && !state.logo)) {
      setState(prevState => ({
        ...prevState,
        logo: latestUploadedFileUrl
      }));
    }
    // eslint-disable-next-line
  }, [latestUploadedFileUrl]);

  const deleteFileFromModel = () => {
    setState(prevState => ({
      ...prevState,
      logo: null
    }));
  };

  return (
    <form onSubmit={event => onSubmit(event)}>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="text-xl  block  border-b-2 border-light-blue-500">Details</div>

          <div className="mt-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-5 text-cool-gray-700"
            >
              Name
            </label>
            <div className="mt-1 rounded-md shadow-sm relative">
              <input
                id="name"
                name="name"
                className={`${
                  error && error.name
                    ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                    : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
                } block w-full px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                value={(state && state.name) || ""}
                onChange={event => onChange(event)}
                placeholder="Brilliant"
              />
              {error && error.name && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <IconError />
                </div>
              )}
            </div>
            {error && error.name && (
              <p className="mt-2 text-sm text-red-600">This field is required</p>
            )}
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-1">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlform="slug"
                  className="block text-sm font-medium leading-5 text-cool-gray-700"
                >
                  Tribe Preview URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex-1">
                    <input
                      id="slug"
                      name="slug"
                      className={`${
                        error && error.slug
                          ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                          : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
                      } form-input block w-full rounded-none rounded-l-md transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                      placeholder="brilliant"
                      value={(state && state.slug) || ""}
                      onChange={event => onChange(event)}
                    />
                    {error && error.slug && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <IconError />
                      </div>
                    )}
                  </div>
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-cool-gray-500 text-sm">
                    .tribesocial.io
                  </span>
                </div>

                {error && error.slug && (
                  <p className="mt-2 text-sm text-red-600">This field is required</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-1">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlform="homepageUrl"
                  className="block text-sm font-medium leading-5 text-cool-gray-700"
                >
                  Homepage
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-cool-gray-500 text-sm">
                    https://
                  </span>
                  <div className="relative flex-1">
                    <input
                      id="homepageUrl"
                      name="homepageUrl"
                      className={`${
                        error && error.homepageUrl
                          ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                          : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
                      } form-input block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                      placeholder="www.example.com"
                      value={(state && state.homepageUrl) || ""}
                      onChange={event => onChange(event)}
                    />
                    {error && error.homepageUrl && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <IconError />
                      </div>
                    )}
                  </div>
                </div>
                {error && error.homepageUrl && (
                  <p className="mt-2 text-sm text-red-600">This field is required</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-1">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlform="upgradeUrl"
                  className="block text-sm font-medium leading-5 text-cool-gray-700"
                >
                  Upgrade URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-cool-gray-500 text-sm">
                    https://
                  </span>
                  <div className="flex-1 relative">
                    <input
                      id="upgradeUrl"
                      name="upgradeUrl"
                      className={`${
                        error && error.upgradeUrl
                          ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                          : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
                      } form-input block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                      placeholder="www.example.com"
                      value={(state && state.upgradeUrl) || ""}
                      onChange={event => onChange(event)}
                    />
                    {error && error.upgradeUrl && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <IconError />
                      </div>
                    )}
                  </div>
                </div>
                {error && error.upgradeUrl && (
                  <p className="mt-2 text-sm text-red-600">This field is required</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-5 text-cool-gray-700"
            >
              Description
            </label>
            <div className="mt-1 rounded-md shadow-sm">
              <textarea
                id="description"
                name="description"
                rows="4"
                className="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                placeholder="brief description"
                value={(state && state.description) || ""}
                onChange={event => onChange(event)}
              ></textarea>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="heroTextColor"
              className="block text-sm font-medium leading-5 text-cool-gray-700"
            >
              Fathom Analytics Tracking ID
            </label>
            <div className="text-sm text-cool-gray-400">
              Need a Fathom Analytics account -{" "}
              <a
                rel="noopener noreferrer"
                className="underline text-blue-500"
                target="_blank"
                href="https://usefathom.com/ref/R9J58H"
              >
                Sign Up
              </a>
            </div>
            <div className="mt-2 rounded-md shadow-sm relative">
              <input
                id="fathomAnalytics"
                name="fathomAnalytics"
                className={`${
                  error && error.fathomAnalytics
                    ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                    : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
                } block w-full px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                value={(state && state.fathomAnalytics) || ""}
                onChange={event => onChange(event)}
                placeholder="ABCDEFG"
              />
              {error && error.fathomAnalytics && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <IconError />
                </div>
              )}
            </div>
            {error && error.fathomAnalytics && (
              <p className="mt-2 text-sm text-red-600">This field is required</p>
            )}
          </div>
        </div>

        <div>
          <div className="text-xl  block   border-b-2 border-light-blue-500">Design</div>

          <div className="mt-6">
            <label
              htmlFor="file"
              className="block text-sm font-medium leading-5 text-cool-gray-700"
            >
              Logo
            </label>
            <input
              id="file"
              type="file"
              name="file"
              ref={file}
              className="hidden"
              accept="image/*"
            />
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6  border-2 border-gray-300 border-dashed rounded-md">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  {state && state.logo ? (
                    <div>
                      <img
                        className="bg-gray-900 p-10"
                        src={constants.cdnUrl + state.logo}
                        alt="logo"
                      />
                      <span className="inline-flex mt-6 rounded-md shadow-sm">
                        <button
                          type="button"
                          className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs leading-4 font-medium rounded text-red-300 bg-white hover:text-red-200 focus:outline-none focus:border-red-200 focus:shadow-outline-redd active:text-red-200 active:bg-gray-50 transition ease-in-out duration-150"
                          onClick={() => {
                            dispatch(deleteFile());
                            deleteFileFromModel();
                          }}
                        >
                          Delete Logo
                        </button>
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">
                        <button
                          type="button"
                          className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                          onClick={() => {
                            if (file && file.current) {
                              file.current.click();
                            }
                          }}
                        >
                          Upload an image&nbsp;
                        </button>
                      </p>
                      <p className="mt-1 text-xs text-cool-gray-500">
                        SVG, PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="mt-6">
            <div className="mt-1 rounded-md shadow-sm relative">
              <UploaderFormField
                title="Hero Background Image"
                field="heroImage"
                model={model}
                state={state}
                setState={setState}
              />
            </div>
            {error && error.heroImage && (
              <p className="mt-2 text-sm text-red-600">This field is required</p>
            )}
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-2 gap-2">
              <ColorPicker
                title={"Primary Brand Color"}
                colorerror={error && error.primaryColor}
                colorstate={state && state.primaryColor}
                onChangeEvent={event => onChange(event)}
                colorname={"primaryColor"}
                placeholderColor={"#FF524B"}
              />
              <ColorPicker
                title={"Secondary Brand Color"}
                colorerror={error && error.secondaryColor}
                colorstate={state && state.secondaryColor}
                onChangeEvent={event => onChange(event)}
                colorname={"secondaryColor"}
                placeholderColor={"#307FE2"}
              />
              <ColorPicker
                title={"Light Brand Color"}
                colorerror={error && error.lightColor}
                colorstate={state && state.lightColor}
                onChangeEvent={event => onChange(event)}
                colorname={"lightColor"}
                placeholderColor={"#f3f3f3"}
              />
              <ColorPicker
                title={"Dark Brand Color"}
                colorerror={error && error.darkColor}
                colorstate={state && state.darkColor}
                onChangeEvent={event => onChange(event)}
                colorname={"darkColor"}
                placeholderColor={"#333333"}
              />

              <ColorPicker
                title={"Hero Text Color"}
                colorerror={error && error.heroTextColor}
                colorstate={state && state.heroTextColor}
                onChangeEvent={event => onChange(event)}
                colorname={"heroTextColor"}
                placeholderColor={"#333333"}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="heroImgOnly"
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-cool-gray-700 transition duration-150 ease-in-out"
                  name="heroImgOnly"
                  checked={(state && state.heroImgOnly) || false}
                  onChange={() => {
                    setState(prevState => ({
                      ...prevState,
                      heroImgOnly: !state.heroImgOnly
                    }));
                  }}
                />
              </div>
              <div className="ml-3 text-sm leading-5 font-medium">
                <label htmlFor="heroImgOnly" className=" text-cool-gray-700">
                  Hero Image Only
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <span className="flex w-full rounded-md shadow-sm">
              <button
                type="button"
                className="w-full inline-flex justify-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out"
                onClick={() => {
                  closeModal();
                }}
              >
                Cancel
              </button>
            </span>

            <span className="flex w-full rounded-md shadow-sm">
              <button
                type="submit"
                className={`${
                  loading || (state && !state.logo) ? "opacity-50 cursor-not-allowed" : ""
                } w-full inline-flex justify-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-white bg-blue-500 hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out`}
                disabled={loading || (state && !state.logo)}
              >
                Save
              </button>
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlatformForm;
