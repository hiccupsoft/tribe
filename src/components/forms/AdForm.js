import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { flashNotificationAsync } from "../../features/notification/notificationSlice";
import { upsertAdAsync, clearError, getCollectionByPlatformAsync } from "../../features/ad/adSlice";
import { ReactComponent as IconError } from "../../assets/icons/icon-error.svg";
import { getAdminsAsync } from "../../features/user/userSlice";
import { deleteFile, uploadFileAsync } from "../../features/uploader/uploaderSlice";
import LoadingSpinner from "../LoadingSpinner";
import constants from "../../constants.json";

const AdForm = ({ model, closeModal }) => {
  const file = useRef(null);
  const { platforms } = useSelector(state => state.platform);
  const { admins } = useSelector(state => state.user);

  const { currentUser } = useSelector(state => state.auth);

  const [state, setState] = useState(model || {}); // form state
  const [selectedPlatformId, setSelectedPlatformId] = useState(null);
  const { loading, latestUploadedFileUrl } = useSelector(state => state.uploader);
  const { error, collections } = useSelector(state => state.ad);
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

  const onChangeMultipleSelect = event => {
    const { options } = event.target;

    if (error && error["CollectionIds"]) {
      dispatch(clearError({ field: "CollectionIds" }));
    }

    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    setState(prevState => ({
      ...prevState,
      CollectionIds: value
    }));
  };

  const onSubmit = event => {
    event.preventDefault();
    dispatch(upsertAdAsync({ ad: state })).then(action => {
      if (!action.error) {
        dispatch(flashNotificationAsync({}));
        closeModal();
      }
    });
  };

  useEffect(() => {
    if (!model && platforms.length) {
      setState(prevState => ({
        ...prevState,
        PlatformId: parseInt(selectedPlatformId),
        UserId: admins && admins[0] && admins[0].id,
        type: "Image",
        visibility: "public"
        //CollectionId: collections && collections[0] && collections[0].id,
      }));
    }
    // eslint-disable-next-line
  }, [admins, collections]);

  useEffect(() => {
    if (platforms.length) {
      if (state.PlatformId) {
        setSelectedPlatformId(state.PlatformId);
        dispatch(getAdminsAsync({ PlatformId: state.PlatformId }));
        dispatch(getCollectionByPlatformAsync({ PlatformId: state.PlatformId }));
      } else {
        setSelectedPlatformId(platforms[0].id);
        dispatch(getAdminsAsync({ PlatformId: platforms[0].id }));
        dispatch(getCollectionByPlatformAsync({ PlatformId: platforms[0].id }));
      }
    }
    // eslint-disable-next-line
  }, [state.PlatformId]);

  useEffect(() => {
    if (model) {
      setState(prevState => ({
        ...prevState,
        CollectionIds: (model.Collections || []).reduce((acc, collection) => {
          acc.push(collection.id);
          return acc;
        }, [])
      }));
    }
    // eslint-disable-next-line
  }, []);

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
    if (!model || (state && !state.image)) {
      setState(prevState => ({
        ...prevState,
        image: latestUploadedFileUrl
      }));
    }
    // eslint-disable-next-line
  }, [latestUploadedFileUrl]);

  const deleteFileFromModel = () => {
    setState(prevState => ({
      ...prevState,
      image: null
    }));
  };

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
        <label htmlFor="type" className="block text-sm font-medium leading-5 text-cool-gray-700">
          Ad Type
        </label>
        <div className="mt-1 rounded-md shadow-sm">
          <select
            id="type"
            className="form-select block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            name="type"
            value={state && state.type}
            onChange={event => onChange(event)}
          >
            <option value="Image">Image</option>
            <option value="Embed">Embed</option>
            <option value="Embed Large">Embed Large</option>
            <option value="Popup Embed">Popup Embed</option>
          </select>
        </div>
      </div>

      {state && "Image" === state.type && (
        <div className="mt-6">
          <label htmlFor="url" className="block text-sm font-medium leading-5 text-cool-gray-700">
            Link URL
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
              placeholder="https://myawesomepage.com"
            />
            {error && error.url && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <IconError />
              </div>
            )}
          </div>
          {error && error.url && (
            <p className="mt-2 text-sm text-red-600">This field is required</p>
          )}
        </div>
      )}

      {state && "Image" !== state.type && (
        <div className="mt-6">
          <label htmlFor="embed" className="block text-sm font-medium leading-5 text-cool-gray-700">
            {state && "Embed" === state.type && "Embed Code"}
            {state && "Popup Embed" === state.type && "Popup Embed URL"}
          </label>
          <div className="mt-1 rounded-md shadow-sm">
            <textarea
              id="embed"
              name="embed"
              rows="3"
              className="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              placeholder="embed code"
              value={(state && state.embed) || ""}
              onChange={event => onChange(event)}
            ></textarea>
          </div>
        </div>
      )}

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

      <div className="mt-6">
        <label
          htmlFor="CollectionIds"
          className="block text-sm font-medium leading-5 text-cool-gray-700"
        >
          Collections
        </label>
        <div className="mt-1 rounded-md shadow-sm relative">
          <select
            id="CollectionIds"
            className="form-select block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            name="CollectionIds"
            value={(state && state.CollectionIds) || []}
            onChange={event => onChangeMultipleSelect(event)}
            multiple={true}
            required
          >
            {(collections || []).map((collection, i) => (
              <option key={i} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
        {error && error.CollectionIds && (
          <p className="mt-2 text-sm text-red-600">This field is required</p>
        )}
      </div>

      <div className="mt-6">
        <label htmlFor="file" className="block text-sm font-medium leading-5 text-cool-gray-700">
          Image
        </label>
        <input id="file" type="file" name="file" ref={file} className="hidden" accept="image/*" />
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {state && state.image ? (
                <div>
                  <img src={constants.cdnUrl + state.image} alt="ad" />
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
            className={`${
              loading || (state && !state.image) ? "opacity-50 cursor-not-allowed" : ""
            } w-full inline-flex justify-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out`}
            disabled={loading || (state && !state.image)}
          >
            Save
          </button>
        </span>
      </div>
    </form>
  );
};

export default AdForm;
