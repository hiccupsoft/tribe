import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { flashNotificationAsync } from "../../features/notification/notificationSlice";
import { upsertUserAsync, clearError } from "../../features/user/userSlice";
import { ReactComponent as IconError } from "../../assets/icons/icon-error.svg";
import { deleteFile, uploadFileAsync } from "../../features/uploader/uploaderSlice";
import LoadingSpinner from "../LoadingSpinner";
import constants from "../../constants.json";

const UserForm = ({ model, closeModal }) => {
  const file = useRef(null);

  const { platforms } = useSelector(state => state.platform);

  const [creatingNew] = useState(!!model);

  const [state, setState] = useState(model); // form state

  const { error, generalError } = useSelector(state => state.user);

  const { currentUser } = useSelector(state => state.auth);

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
    dispatch(upsertUserAsync({ user: state })).then(action => {
      if (!action.error) {
        dispatch(flashNotificationAsync({}));
        closeModal();
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      // chrome autocomplete reset password field to null
      const oldState = { ...state };
      delete oldState.password;
      setState(oldState);
    }, 400);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (platforms.length) {
      if (!model || !state.PlatformId) {
        setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            role: (state && state.role) || "free",
            PlatformId: platforms[0].id
          }));
        }, 500);
      }
    }
    // eslint-disable-next-line
  }, [platforms]);

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
    if (!model || (state && !state.photoUrl)) {
      setState(prevState => ({
        ...prevState,
        photoUrl: latestUploadedFileUrl
      }));
    }
    // eslint-disable-next-line
  }, [latestUploadedFileUrl]);

  const deleteFileFromModel = () => {
    setState(prevState => ({
      ...prevState,
      photoUrl: null
    }));
  };

  return (
    <form onSubmit={event => onSubmit(event)}>
      {generalError && (
        <p className="text-sm leading-5 font-medium text-red-800 mb-1">{generalError}</p>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium leading-5 text-cool-gray-700">
          Name
        </label>
        <div className="mt-1 rounded-md shadow-sm relative">
          <input
            required
            id="name"
            name="name"
            className={`${
              error && error.name
                ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
            } block w-full px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
            value={(state && state.name) || ""}
            onChange={event => onChange(event)}
            placeholder="Name"
          />
          {error && error.name && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <IconError />
            </div>
          )}
        </div>
        {error && error.name && <p className="mt-2 text-sm text-red-600">This field is required</p>}
      </div>

      <div className="mt-6">
        <label htmlFor="email" className="block text-sm font-medium leading-5 text-cool-gray-700">
          Email
        </label>
        <div className="mt-1 rounded-md shadow-sm relative">
          <input
            id="email"
            name="email"
            type="email"
            className={`${
              error && error.email
                ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
            } block w-full px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
            value={(state && state.email) || ""}
            onChange={event => onChange(event)}
            placeholder="email@test.com"
          />
          {error && error.email && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <IconError />
            </div>
          )}
        </div>
        {error && error.email && (
          <p className="mt-2 text-sm text-red-600">This field is required</p>
        )}
      </div>

      <div className="mt-6">
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-5 text-cool-gray-700"
        >
          Password
        </label>
        <div className="mt-1 rounded-md shadow-sm relative">
          <input
            required={!creatingNew}
            id="password"
            name="password"
            type="password"
            className={`${
              error && error.password
                ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
            } block w-full px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
            value={(state && state.password) || ""}
            onChange={event => onChange(event)}
            placeholder="password"
          />
          {error && error.password && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <IconError />
            </div>
          )}
        </div>
        {error && error.password && (
          <p className="mt-2 text-sm text-red-600">This field is required</p>
        )}
      </div>

      {"sa" === currentUser.role && (
        <div className="mt-6">
          <label
            htmlFor="PlatformId"
            className="block text-sm font-medium leading-5 text-cool-gray-700"
          >
            Platform
          </label>
          <div className="mt-1 rounded-md shadow-sm relative">
            <select
              id="PlatformId"
              className="form-select block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              name="PlatformId"
              value={(state && state.PlatformId) || ""}
              onChange={event => onChange(event)}
            >
              {(platforms || []).map((platform, i) => (
                <option key={i} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>
          {error && error.PlatformId && (
            <p className="mt-2 text-sm text-red-600">This field is required</p>
          )}
        </div>
      )}

      <div className="mt-6">
        <label htmlFor="role" className="block text-sm font-medium leading-5 text-cool-gray-700">
          Role
        </label>
        <div className="mt-1 rounded-md shadow-sm relative">
          <select
            id="role"
            className="form-select block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            name="role"
            value={(state && state.role) || ""}
            onChange={event => onChange(event)}
          >
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && error.role && <p className="mt-2 text-sm text-red-600">This field is required</p>}
      </div>

      <div className="mt-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="banned"
              type="checkbox"
              className="form-checkbox h-4 w-4 text-cool-gray-700 transition duration-150 ease-in-out"
              name="banned"
              checked={(state && state.banned) || false}
              onChange={() => {
                setState(prevState => ({
                  ...prevState,
                  banned: !state.banned
                }));
              }}
            />
          </div>
          <div className="ml-3 text-sm leading-5 font-medium">
            <label htmlFor="chatEnabled" className=" text-cool-gray-700">
              Banned
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="file" className="block text-sm font-medium leading-5 text-cool-gray-700">
          Avatar
        </label>
        <input id="file" type="file" name="file" ref={file} className="hidden" accept="image/*" />
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {state && state.photoUrl ? (
                <div>
                  <img src={constants.cdnUrl + state.photoUrl} alt="ad" />
                  <span className="inline-flex rounded-md shadow-sm">
                    <button
                      type="button"
                      className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs leading-4 font-medium rounded text-red-300 bg-white hover:text-red-200 focus:outline-none focus:border-red-200 focus:shadow-outline-redd active:text-red-200 active:bg-gray-50 transition ease-in-out duration-150"
                      onClick={() => {
                        dispatch(deleteFile());
                        deleteFileFromModel();
                      }}
                    >
                      Delete image
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
                  <p className="mt-1 text-xs text-cool-gray-500">SVG, PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </>
          )}
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
            className="w-full inline-flex justify-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out"
          >
            Save
          </button>
        </span>
      </div>
    </form>
  );
};

export default UserForm;
