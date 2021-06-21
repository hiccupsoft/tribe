import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { flashNotificationAsync } from "../../features/notification/notificationSlice";
import { upsertLinkAsync, clearError } from "../../features/link/linkSlice";
import { ReactComponent as IconError } from "../../assets/icons/icon-error.svg";

const LinkForm = ({ model, closeModal }) => {
  const { platforms } = useSelector(state => state.platform);

  const [state, setState] = useState(model || {}); // form state

  const { error } = useSelector(state => state.link);

  const { currentUser } = useSelector(state => state.auth);

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
    dispatch(upsertLinkAsync({ link: state })).then(action => {
      if (!action.error) {
        dispatch(flashNotificationAsync({}));
        closeModal();
      }
    });
  };

  useEffect(() => {
    if (!model) {
      setState(prevState => ({
        ...prevState,
        PlatformId: platforms && platforms[0] && platforms[0].id
      }));
    }
    // eslint-disable-next-line
  }, [platforms]);

  return (
    <form onSubmit={event => onSubmit(event)}>
      <div>
        <label htmlFor="title" className="block text-sm font-medium leading-5 text-cool-gray-700">
          Title
        </label>
        <div className="mt-1 rounded-md shadow-sm relative">
          <input
            id="title"
            name="title"
            className={`${
              error && error.title
                ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
            } block w-full px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
            value={(state && state.title) || ""}
            onChange={event => onChange(event)}
            placeholder="title"
          />
          {error && error.title && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <IconError />
            </div>
          )}
        </div>
        {error && error.title && (
          <p className="mt-2 text-sm text-red-600">This field is required</p>
        )}
      </div>

      <div className="mt-6">
        <label htmlFor="url" className="block text-sm font-medium leading-5 text-cool-gray-700">
          Url
        </label>
        <div className="mt-1 rounded-md shadow-sm relative">
          <input
            id="url"
            name="url"
            type="url"
            className={`${
              error && error.url
                ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
            } block w-full px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
            value={(state && state.url) || ""}
            onChange={event => onChange(event)}
            placeholder="url"
          />
          {error && error.url && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <IconError />
            </div>
          )}
        </div>
        {error && error.url && <p className="mt-2 text-sm text-red-600">This field is required</p>}
      </div>

      <div className="mt-6">
        <label
          htmlFor="position"
          className="block text-sm font-medium leading-5 text-cool-gray-700"
        >
          Position
        </label>
        <div className="mt-1 rounded-md shadow-sm relative">
          <input
            id="position"
            name="position"
            type="number"
            className={`${
              error && error.position
                ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
            } block w-full px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
            value={(state && state.position) || ""}
            onChange={event => onChange(event)}
            placeholder="position"
          />
          {error && error.position && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <IconError />
            </div>
          )}
        </div>
        {error && error.position && (
          <p className="mt-2 text-sm text-red-600">This field is required</p>
        )}
      </div>

      {"sa" === currentUser.role && (
        <div className="mt-6">
          <label
            htmlFor="platform"
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

export default LinkForm;
