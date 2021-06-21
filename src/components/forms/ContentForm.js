import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RichTextEditor from "react-rte";
import { flashNotificationAsync } from "../../features/notification/notificationSlice";
import {
  upsertContentAsync,
  clearError,
  getCollectionByPlatformAsync
} from "../../features/content/contentSlice";
import { ReactComponent as IconError } from "../../assets/icons/icon-error.svg";
import { getAdminsAsync } from "../../features/user/userSlice";

import slugify from "slugify";
import UploaderFormField from "./utils/UploaderFormField";

const ContentForm = ({ model, closeModal }) => {
  const { platforms } = useSelector(state => state.platform);
  const { admins } = useSelector(state => state.user);
  const { currentUser } = useSelector(state => state.auth);

  // form state
  const [state, setState] = useState(model || {});
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

  const { error, collections } = useSelector(state => state.content);
  const dispatch = useDispatch();

  const onChange = event => {
    let { name, value } = event.target;

    if (error && error[name]) {
      dispatch(clearError({ field: name }));
    }

    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onSubmit = async event => {
    event.preventDefault();
    const stateWithDescription = stringifyAndAppendDescriptionToState();
    dispatch(upsertContentAsync({ content: stateWithDescription })).then(action => {
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
        type: "video embed",
        visibility: "public",
        CollectionId: collections && collections[0] && collections[0].id
      }));
    } else if (!state.UserId) {
      // fill author information
      setState(prevState => ({
        ...prevState,
        UserId: admins && admins[0] && admins[0].id
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

  return (
    <form onSubmit={event => onSubmit(event)}>
      <div className="grid grid-cols-2 gap-8">
        <div>
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

          <div>
            <label
              htmlFor="title"
              className="block mt-6 text-sm font-medium leading-5 text-cool-gray-700"
            >
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
                onBlur={event => {
                  if (state && !state.slug && state.title) {
                    setState(prevState => ({
                      ...prevState,
                      slug: slugify(state.title)
                    }));
                  }
                }}
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
              htmlFor="publishedDate"
              className="block text-sm font-medium leading-5 text-cool-gray-700"
            >
              Published date
            </label>
            <div className="text-xs leading-4 mt-1 mb-2 text-cool-gray-500">
              Select a past or future date. Content will be <strong>hidden</strong> if a{" "}
              <strong>future date</strong> is selected.
            </div>
            <div className="mt-1 rounded-md shadow-sm relative">
              <input
                id="publishedDate"
                name="publishedDate"
                type="date"
                className={`${
                  error && error.publishedDate
                    ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                    : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
                } block w-full px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                value={(state && state.publishedDate && state.publishedDate.slice(0, 10)) || ""}
                onChange={event => onChange(event)}
                placeholder=""
              />
              {error && error.publishedDate && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <IconError />
                </div>
              )}
            </div>

            {error && error.publishedDate && (
              <p className="mt-2 text-sm text-red-600">This field is required</p>
            )}
          </div>
          <div className="mt-6">
            <label
              htmlFor="expireDate"
              className="block text-sm font-medium leading-5 text-cool-gray-700"
            >
              Expiration date (optional)
            </label>
            <div className="text-xs leading-4 mt-1 mb-2 text-cool-gray-500">
              Set a date to <strong>hide</strong> your content. Leave blank to{" "}
              <strong>never expire</strong>.
            </div>
            <div className="mt-1 rounded-md shadow-sm relative">
              <input
                id="expireDate"
                name="expireDate"
                type="date"
                className={`${
                  error && error.expireDate
                    ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                    : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
                } block w-full px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                value={(state && state.expireDate && state.expireDate.slice(0, 10)) || ""}
                onChange={event => onChange(event)}
                placeholder=""
              />
              {error && error.expireDate && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <IconError />
                </div>
              )}
            </div>
            {error && error.publishedDate && (
              <p className="mt-2 text-sm text-red-600">This field is required</p>
            )}
          </div>

          <div className="mt-6">
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
        </div>

        <div>
          <UploaderFormField
            title="Featured Image"
            field="featuredImage"
            model={model}
            state={state}
            setState={setState}
            description={"SVG, PNG, JPG, GIF up to 10MB"}
          />

          <div className="mt-6">
            <label
              htmlFor="type"
              className="block text-sm font-medium leading-5 text-cool-gray-700"
            >
              Content type
            </label>
            <div className="mt-1 rounded-md shadow-sm">
              <select
                id="type"
                className="form-select block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                name="type"
                value={(state && state.type) || ""}
                onChange={event => onChange(event)}
              >
                <option value="video embed">YouTube or Vimeo</option>
                <option value="video">Video</option>
                <option value="jw video">JW Video</option>
                <option value="jw live channel">JW Live Channel</option>
                <option value="resi">Resi (Living as One)</option>
              </select>
            </div>
          </div>

          {state && "video" === state.type ? (
            <UploaderFormField
              title="Video"
              field="video"
              model={model}
              state={state}
              setState={setState}
              description={"Mp4 or Mov files up to 5GB"}
            />
          ) : (
            <div className="mt-6">
              <label
                htmlFor="contentURI"
                className="block text-sm font-medium leading-5 text-cool-gray-700"
              >
                {state && "jw video" === state.type && "JW Video ID"}
                {state && "video embed" === state.type && "Youtube or Vimeo link"}
                {state && "jw live channel" === state.type && "JW Live Channel ID"}
                {state && "resi" === state.type && "Resi Event ID"}
              </label>
              <div className="mt-1 rounded-md shadow-sm relative">
                <input
                  id="contentURI"
                  name="contentURI"
                  type="text"
                  className={`${
                    error && error.contentURI
                      ? "border-red-300 text-red-300 focus:border-red-300 focus:shadow-outline-red"
                      : "border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
                  } block w-full px-3 py-2 border rounded-md focus:outline-none transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                  value={(state && state.contentURI) || ""}
                  onChange={event => onChange(event)}
                  placeholder=""
                />
                {error && error.contentURI && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <IconError />
                  </div>
                )}
              </div>
              {error && error.contentURI && (
                <p className="mt-2 text-sm text-red-600">This field is required</p>
              )}
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="chatEnabled"
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-cool-gray-700 transition duration-150 ease-in-out"
                  name="chatEnabled"
                  checked={(state && state.chatEnabled) || false}
                  onChange={() => {
                    setState(prevState => ({
                      ...prevState,
                      chatEnabled: !state.chatEnabled
                    }));
                  }}
                />
              </div>
              <div className="ml-3 text-sm leading-5 font-medium">
                <label htmlFor="chatEnabled" className=" text-cool-gray-700">
                  Enabled Live Chat
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="visibility"
              className="block text-sm font-medium leading-5 text-cool-gray-700"
            >
              Visibility
            </label>
            <div className="mt-1 rounded-md shadow-sm">
              <select
                id="visibility"
                className="form-select block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                name="visibility"
                value={(state && state.visibility) || ""}
                onChange={event => onChange(event)}
              >
                <option value="public">Public</option>
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
            </div>
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
          {/* <textarea
            id='description'
            name='description'
            rows='3'
            className='form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
            placeholder='brief description'
            value={(state && state.description) || ""}
            onChange={(event) => onChange(event)}
          ></textarea> */}
          <RichTextEditor
            value={editorState}
            onChange={setEditorState}
            className=" max-w-full text-editor prose"
            toolbarConfig={{
              display: [
                "INLINE_STYLE_BUTTONS",
                "BLOCK_TYPE_BUTTONS",
                "LINK_BUTTONS",
                "BLOCK_TYPE_DROPDOWN"
              ],
              INLINE_STYLE_BUTTONS: [
                { label: "Bold", style: "BOLD", className: "custom-css-class" },
                { label: "Italic", style: "ITALIC" },
                { label: "Underline", style: "UNDERLINE" }
              ],
              BLOCK_TYPE_DROPDOWN: [
                { label: "Normal", style: "unstyled" },
                { label: "Heading Large", style: "header-one" },
                { label: "Heading Medium", style: "header-two" },
                { label: "Heading Small", style: "header-three" }
              ],
              BLOCK_TYPE_BUTTONS: [
                { label: "UL", style: "unordered-list-item" },
                { label: "OL", style: "ordered-list-item" }
              ]
            }}
          />
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
            className="w-full inline-flex justify-center px-4 py-2 bg-green-500 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out"
          >
            Save
          </button>
        </span>
      </div>
    </form>
  );
};

export default ContentForm;
