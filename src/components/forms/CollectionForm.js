import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { flashNotificationAsync } from "../../features/notification/notificationSlice";

import { upsertCollectionAsync, clearError } from "../../features/collection/collectionSlice";
import { ReactComponent as IconError } from "../../assets/icons/icon-error.svg";
import { getAdminsAsync } from "../../features/user/userSlice";
import { deleteFile, uploadFileAsync } from "../../features/uploader/uploaderSlice";
import LoadingSpinner from "../LoadingSpinner";
import slugify from "slugify";
import constants from "../../constants";
import RichTextEditor from "react-rte";

const CollectionForm = ({ model, closeModal }) => {
  const file = useRef(null);
  const { platforms } = useSelector(state => state.platform);
  const { admins } = useSelector(state => state.user);
  const { currentUser } = useSelector(state => state.auth);

  const [state, setState] = useState(model || {}); // form state
  const [selectedPlatformId, setSelectedPlatformId] = useState(null);
  // rich text editor
  const [editorState, setEditorState] = React.useState(
    model?.description
      ? RichTextEditor.createValueFromString(model.description, "html")
      : RichTextEditor.createEmptyValue()
  );
  // unusual pattern but if we use setState then we need to dispatch in setState's callback
  // we also can't stringify the rich text on change without affecting performance
  // so the best option is to stringify and append on submit
  const stringifyAndAppendDescriptionToState = () => ({
    ...state,
    description: editorState.toString("html")
  });
  const { loading, latestUploadedFileUrl } = useSelector(state => state.uploader);

  const { error } = useSelector(state => state.collection);
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
    const stateWithDescription = stringifyAndAppendDescriptionToState();
    dispatch(upsertCollectionAsync({ collection: stateWithDescription })).then(action => {
      if (!action.error) {
        dispatch(flashNotificationAsync({}));
        closeModal();
      }
    });
  };

  useEffect(() => {
    if (!model && platforms.length) {
      if (admins.length) {
        setState(prevState => ({
          ...prevState,
          PlatformId: selectedPlatformId,
          UserId: admins[0].id
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          PlatformId: selectedPlatformId
        }));
      }
    }
    // eslint-disable-next-line
  }, [admins]);

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
    if (!model || (state && !state.collectionBGImage)) {
      setState(prevState => ({
        ...prevState,
        collectionBGImage: latestUploadedFileUrl
      }));
    }
    // eslint-disable-next-line
  }, [latestUploadedFileUrl]);

  const deleteFileFromModel = () => {
    setState(prevState => ({
      ...prevState,
      collectionBGImage: null
    }));
  };

  useEffect(() => {
    if (platforms.length) {
      if (state.PlatformId) {
        setSelectedPlatformId(state.PlatformId);
        dispatch(getAdminsAsync({ PlatformId: state.PlatformId }));
      } else {
        setSelectedPlatformId(platforms[0].id);
        dispatch(getAdminsAsync({ PlatformId: platforms[0].id }));
      }
    }
    // eslint-disable-next-line
  }, [state.PlatformId]);

  return (
    <form onSubmit={event => onSubmit(event)}>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div>
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
                onBlur={event => {
                  if (state && !state.slug) {
                    if (state.name) {
                      setState(prevState => ({
                        ...prevState,
                        slug: slugify(state.name)
                      }));
                    }
                  }
                }}
                placeholder="name"
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
            <label
              htmlFor="slug"
              className="block text-sm font-medium leading-5 text-cool-gray-700"
            >
              Slug
            </label>
            <div className="mt-1 rounded-md shadow-sm relative">
              <input
                id="slug"
                name="slug"
                className={`${
                  error && error.slug
                    ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                    : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
                } block w-full px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                value={(state && state.slug) || ""}
                onChange={event => onChange(event)}
                placeholder="slug"
              />
              {error && error.slug && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <IconError />
                </div>
              )}
            </div>
            {error && error.slug && (
              <p className="mt-2 text-sm text-red-600">This field is required</p>
            )}
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

          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-5 text-cool-gray-700"
            >
              Description
            </label>
            <div className="mt-1 rounded-md shadow-sm">
              {/* <textarea
                id="description"
                name="description"
                rows="3"
                className="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                placeholder="brief description"
                value={(state && state.description) || ""}
                onChange={event => onChange(event)}
              ></textarea> */}
              <RichTextEditor
                value={editorState}
                onChange={setEditorState}
                className=" max-w-full text-editor prose"
                toolbarConfig={{
                  display: [
                    "INLINE_STYLE_BUTTONS",
                    "LINK_BUTTONS"
                  ],
                  INLINE_STYLE_BUTTONS: [
                    { label: "Bold", style: "BOLD", className: "custom-css-class" },
                    { label: "Italic", style: "ITALIC" }
                  ]
                }}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="">
            <label
              htmlFor="file"
              className="block text-sm font-medium leading-5 text-cool-gray-700"
            >
              Collection Background Image
            </label>
            <input
              id="file"
              type="file"
              name="file"
              ref={file}
              className="hidden"
              accept="image/*"
            />
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  {state && state.collectionBGImage ? (
                    <div>
                      <img src={constants.cdnUrl + state.collectionBGImage} alt="featured" />
                      <span className="inline-flex rounded-md shadow-sm">
                        <button
                          type="button"
                          className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs leading-4 font-medium rounded text-red-300 bg-white hover:text-red-200 focus:outline-none focus:border-red-200 focus:shadow-outline-redd active:text-red-200 active:bg-gray-50 transition ease-in-out duration-150"
                          onClick={() => {
                            dispatch(deleteFile());
                            deleteFileFromModel();
                          }}
                        >
                          Delete Background image
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

          <div className="mt-6 hidden ">
            <label
              htmlFor="UserId"
              className="block text-sm font-medium leading-5 text-cool-gray-700"
            >
              Author
            </label>
            <div className="mt-1 rounded-md shadow-sm relative">
              <select
                id="UserId"
                className="form-select block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                name="UserId"
                value={(state && state.UserId) || ""}
                onChange={event => onChange(event)}
              >
                {(admins || []).map((admin, i) => (
                  <option key={i} value={admin.id}>
                    {admin.name}
                  </option>
                ))}
              </select>
            </div>
            {error && error.PlatformId && (
              <p className="mt-2 text-sm text-red-600">This field is required</p>
            )}
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
            className="w-full inline-flex bg-green-500	text-white justify-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md  bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out"
          >
            Save
          </button>
        </span>
      </div>
    </form>
  );
};

export default CollectionForm;
