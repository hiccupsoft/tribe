import React, { useState, useEffect } from "react";
import PlatformForm from "../../forms/PlatformForm";
import FormModal from "../../forms/FormModal";
import {
  clearErrors,
  deletePlatformAsync,
  readAllPlatformsAsync
} from "../../../features/platform/platformSlice";
import { useDispatch, useSelector } from "react-redux";
import * as OutlineIcons from "../../../assets/icons/outline";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { flashNotificationAsync } from "../../../features/notification/notificationSlice";

const Platforms = () => {
  const [modalShowing, setModalShowing] = useState(false);
  const [model, setModel] = useState(null);
  const [deleteModalShowing, setDeleteModalShowing] = useState(false);

  const editRow = selectedModel => {
    setModel(selectedModel);
    setModalShowing(true);
  };

  const { currentUser } = useSelector(state => state.auth);

  const platform = useSelector(state => state.platform);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(readAllPlatformsAsync());

    // eslint-disable-next-line
  }, []);

  const closeModal = () => {
    setModalShowing(false);
    dispatch(clearErrors());
  };

  return (
    <>
      <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
        <div className="mt-8">
          <div className="max-w-7xl px-5 sm:px-10  mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h2 className="">Platforms</h2>

              {"sa" === currentUser.role && (
                <span className="shadow-sm rounded-md">
                  <button
                    type="button"
                    className="mr-2 inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out"
                    onClick={() => {
                      setModel(null);
                      setModalShowing(true);
                    }}
                  >
                    Add platform
                  </button>
                </span>
              )}
            </div>

            <table className="shadow mt-2 w-full divide-y divide-cool-gray-200 table-fixed">
              <thead>
                <tr>
                  <th className="sm:w-1/2 px-6 py-3 bg-cool-gray-50 text-left text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                    name
                  </th>
                  <th className="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                    Url
                  </th>
                  <th className="w-36 px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-cool-gray-200">
                {(platform.platforms || []).map((platform, i) => (
                  <tr
                    key={i}
                    className={`${
                      0 === i % 2 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 cursor-pointer transition ease-in-out duration-150`}
                  >
                    <td
                      className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-cool-gray-900"
                      onClick={() => {
                        editRow(platform);
                      }}
                    >
                      <div className="flex">
                        <p className="text-cool-gray-500 truncate group-hover:text-cool-gray-900 transition ease-in-out duration-150">
                          {platform.name}
                        </p>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500"
                      onClick={() => {
                        editRow(platform);
                      }}
                    >
                      {platform.homepageUrl}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <OutlineIcons.Pencil
                        className="h-5 mr-2 inline cursor-pointer text-gray-500 hover:text-gray-800"
                        onClick={() => {
                          editRow(platform);
                        }}
                      />
                      <OutlineIcons.X
                        onClick={() => {
                          setDeleteModalShowing(true);
                          setModel(platform);
                        }}
                        className="h-5 inline cursor-pointer text-gray-500 hover:text-gray-800"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/*<!-- Pagination -->
                <nav className='bg-white px-4 py-3 flex items-center justify-between border-t border-cool-gray-200 sm:px-6'>
                  <div className='hidden sm:block'>
                    <p className='text-sm leading-5 text-cool-gray-700'>
                      Showing
                      <span className='font-medium'> 1 </span>
                      to
                      <span className='font-medium'> 10 </span>
                      of
                      <span className='font-medium'> 20 </span>
                      results
                    </p>
                  </div>
                  <div className='flex-1 flex justify-between sm:justify-end'>
                    <button className='relative inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-cool-gray-100 active:text-cool-gray-700 transition ease-in-out duration-150'>
                      Previous
                    </button>
                    <button className='ml-3 relative inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-cool-gray-100 active:text-cool-gray-700 transition ease-in-out duration-150'>
                      Next
                    </button>
                  </div>
                </nav>
             */}
          </div>
        </div>
      </main>
      <FormModal
        modalShowing={modalShowing}
        closeModal={closeModal}
        Form={PlatformForm}
        title={model ? "Update platform" : "Add new platform"}
        model={model}
      />
      <DeleteConfirmationModal
        showing={deleteModalShowing}
        closeModal={() => {
          setDeleteModalShowing(false);
          //setModel(null);
        }}
        deleteAsync={() => {
          dispatch(deletePlatformAsync({ platform: model })).then(action => {
            if (!action.error) {
              dispatch(flashNotificationAsync({}));
              setDeleteModalShowing(false);
            }
          });
        }}
        model={model}
      />
    </>
  );
};

export default Platforms;
