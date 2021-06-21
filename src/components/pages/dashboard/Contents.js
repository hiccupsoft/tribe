import React, { useState, useEffect } from "react";
import ContentForm from "../../forms/ContentForm";
import FormModal from "../../forms/FormModal";
import {
  clearErrors,
  deleteContentAsync,
  readAllContentsAsync
} from "../../../features/content/contentSlice";
import { useDispatch, useSelector } from "react-redux";
import * as OutlineIcons from "../../../assets/icons/outline";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { flashNotificationAsync } from "../../../features/notification/notificationSlice";
import { readAllPlatformsAsync } from "../../../features/platform/platformSlice";

const Contents = () => {
  const [modalShowing, setModalShowing] = useState(false);
  const [model, setModel] = useState(null);
  const [deleteModalShowing, setDeleteModalShowing] = useState(false);

  const editRow = selectedModel => {
    setModel(selectedModel);
    setModalShowing(true);
  };

  const { currentUser } = useSelector(state => state.auth);

  const content = useSelector(state => state.content);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(readAllContentsAsync());
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
              <h2 className="">Content</h2>

              <span className="shadow-sm rounded-md">
                <button
                  type="button"
                  className="mr-2 inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out"
                  onClick={() => {
                    setModel(null);
                    setModalShowing(true);
                  }}
                >
                  Add content
                </button>
              </span>
            </div>

            <table className="shadow mt-2 w-full divide-y divide-cool-gray-200 table-fixed">
              <thead>
                <tr>
                  <th className="sm:w-1/2 px-6 py-3 bg-cool-gray-50 text-left text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                    Visibility
                  </th>
                  <th className="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                    Type
                  </th>

                  {"sa" === currentUser.role && (
                    <th className="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                  )}
                  <th className="w-36 px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-cool-gray-200">
                {(content.contents || []).map((content, i) => (
                  <tr
                    key={i}
                    className={`${
                      0 === i % 2 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 cursor-pointer transition ease-in-out duration-150`}
                  >
                    <td
                      className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-cool-gray-900"
                      onClick={() => {
                        editRow(content);
                      }}
                    >
                      <div className="flex">
                        <p className="text-cool-gray-500 truncate group-hover:text-cool-gray-900 transition ease-in-out duration-150">
                          {content.title}
                        </p>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500"
                      onClick={() => {
                        editRow(content);
                      }}
                    >
                      {content.visibility}
                    </td>

                    <td
                      className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500"
                      onClick={() => {
                        editRow(content);
                      }}
                    >
                      {content.type}
                    </td>

                    {"sa" === currentUser.role && (
                      <td className="px-6 py-4 text-right whitespace-no-wrap text-sm leading-5 text-cool-gray-500">
                        {/*  TODO */}
                      </td>
                    )}

                    <td className="px-6 py-4 text-center">
                      <OutlineIcons.Pencil
                        className="h-5 mr-2 inline cursor-pointer text-gray-500 hover:text-gray-800"
                        onClick={() => {
                          editRow(content);
                        }}
                      />
                      <OutlineIcons.X
                        onClick={() => {
                          setDeleteModalShowing(true);
                          setModel(content);
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
        Form={ContentForm}
        title={model ? "Update content" : "Add new content"}
        model={model}
      />
      <DeleteConfirmationModal
        showing={deleteModalShowing}
        closeModal={() => {
          setDeleteModalShowing(false);
          //setModel(null);
        }}
        deleteAsync={() => {
          dispatch(deleteContentAsync({ content: model })).then(action => {
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

export default Contents;
