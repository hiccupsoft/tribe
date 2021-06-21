import React, { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../../LoadingSpinner";
import constants from "../../../constants.json";
import { useDispatch } from "react-redux";
import { deleteFile, uploadFileAsync } from "../../../features/uploader/uploaderSlice";
import VideoPlayer from "react-video-js-player";

const UploaderFormField = ({ title, field, model, state, setState, description }) => {
  const file = useRef(null);
  const [loading, setLoading] = useState(false);
  //const { loading } = useSelector((state) => state.uploader);
  const dispatch = useDispatch();

  const deleteFileFromModel = () => {
    setState(prevState => ({
      ...prevState,
      [field]: null
    }));
  };

  // upload file listener
  useEffect(() => {
    document.getElementById(field).onclick = event => {
      document.getElementById(field).value = null;
    };

    document.getElementById(field).onchange = event => {
      if (event.target.files && event.target.files.length > 0) {
        setLoading(true);
        dispatch(uploadFileAsync({ id: field })).then(({ payload }) => {
          setLoading(false);
          setState(prevState => ({
            ...prevState,
            [field]: payload.latestUploadedFileUrl
          }));
        });
      }
    };

    return () => {
      dispatch(deleteFile());
      deleteFileFromModel();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="mt-6">
      <label htmlFor={field} className="block text-sm font-medium leading-5 text-cool-gray-700">
        {title}
      </label>
      <input
        id={field}
        type="file"
        name={field}
        ref={file}
        className="hidden"
        accept="image/*|video/*"
      />
      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {state && state[field] ? (
              <div>
                {state[field].includes("mp4") ||
                state[field].includes("webm") ||
                state[field].includes("ogv") ? (
                  <div style={{ width: 300, height: 170, position: "relative" }}>
                    <VideoPlayer
                      controls={true}
                      src={constants.cdnUrl + state[field]}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img src={constants.cdnUrl + state[field]} alt="preview" />
                )}

                <span className="inline-flex rounded-md shadow-sm">
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs leading-4 font-medium rounded text-red-300 bg-white hover:text-red-200 focus:outline-none focus:border-red-200 focus:shadow-outline-redd active:text-red-200 active:bg-gray-50 transition ease-in-out duration-150"
                    onClick={() => {
                      dispatch(deleteFile());
                      deleteFileFromModel();
                    }}
                  >
                    Delete {title}
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
                    Upload a file&nbsp;
                  </button>
                </p>
                <p className="mt-1 text-xs text-cool-gray-500">{description}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UploaderFormField;
