import React, { useState, useEffect } from "react";
import UserForm from "../../forms/UserForm";
import FormModal from "../../forms/FormModal";
import {
  clearErrors,
  deleteUserAsync,
  getUsersCSVAsync,
  readAllUsersAsync
} from "../../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import * as OutlineIcons from "../../../assets/icons/outline";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  flashNotificationAsync,
  flashDetailedNotificationAsync
} from "../../../features/notification/notificationSlice";
import { readAllPlatformsAsync } from "../../../features/platform/platformSlice";
import useAnimationFrame from "../../../components/general/chat/hooks/useAnimationFrame";
import {
  resetPlatformTokensAsync,
  getPlatformAnalyticsAsync
} from "../../../features/frontend/frontendSlice";

const Users = () => {
  const [modalShowing, setModalShowing] = useState(false);
  const [model, setModel] = useState(null);
  const [deleteModalShowing, setDeleteModalShowing] = useState(false);
  const user = useSelector(state => state.user);
  const platformData = useSelector(state => state.frontend.platformData);
  const analytics = useSelector(state => state.frontend.analytics);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(null);
  const [sort, setSort] = useState({
    column: "name",
    desc: false
  });
  const [renderUsers, setRenderUsers] = useState([]);
  useEffect(() => {
    dispatch(readAllUsersAsync());
    dispatch(readAllPlatformsAsync());
    dispatch(getPlatformAnalyticsAsync());
    setRenderUsers(user.users);
    // eslint-disable-next-line
  }, [platformData.premiumToken, platformData.basicToken]);
  useAnimationFrame(60000, () => {
    dispatch(getPlatformAnalyticsAsync());
  });
  useEffect(() => {
    const handleSort = (userA, userB) => {
      const { column, desc } = sort;
      if (desc) {
        return userA[column]?.toLowerCase() > userB[column]?.toLowerCase() ? 1 : -1;
      } else {
        return userA[column]?.toLowerCase() > userB[column]?.toLowerCase() ? -1 : 1;
      }
    };
    let users = Array.from(user.users).sort(handleSort);
    if (filter) {
      setRenderUsers(users.filter(user => user.role === filter));
    } else {
      setRenderUsers(users);
    }
  }, [sort, filter, user]);
  const resetPlatformTokens = () => {
    dispatch(resetPlatformTokensAsync(platformData)).then(() => {
      dispatch(
        flashDetailedNotificationAsync({
          details: "Successfully generated new sign up links!"
        })
      );
    });
  };
  const closeModal = () => {
    setModalShowing(false);
    dispatch(clearErrors());
  };

  const copyLink = role => {
    const el = document.createElement("textarea");
    const token = /basic/i.test(role) ? platformData.basicToken : platformData.premiumToken;
    el.value = `${window.location.protocol}//${
      platformData.homepageUrl ? platformData.homepageUrl : window.location.hostname
    }/auth/signup/${role}?token=${token}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    dispatch(
      flashDetailedNotificationAsync({
        details: `Successfully, copied the ${role} sign up link!`
      })
    );
  };
  const handleFilter = role => {
    if (filter === role) {
      setFilter(null);
    } else {
      setFilter(role);
    }
  };
  const changeSort = column => {
    const newSort = {
      column,
      desc: true
    };
    if (column === sort.column) {
      newSort.desc = !sort.desc;
    }
    setSort(newSort);
  };

  return (
    <>
      <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
        <div className="mt-8">
          <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex-col justify-between">
              <div>
                <div className="flex justify-between mb-6">
                  <h2>Analytics</h2>
                </div>
                <div className="flex mb-8">
                  <div className="sm:grid sm:h- mb-8  w-full sm:grid-flow-row sm:gap-4  sm:grid-cols-4">
                    {["free", "basic", "premium", "admin"].map((role, index) => {
                      return (
                        role && (
                          <div
                            key={index + role}
                            className="flex flex-col justify-center  my-2 bg-white border border-gray-300 rounded-md"
                            onClick={() => handleFilter(role)}
                          >
                            <div>
                              <div className="flex items-center py-4">
                                <div
                                  className=" bg-blue-300  w-2.68 mx-3 p-3 rounded text-white"
                                  style={{
                                    backgroundColor: platformData.primaryColor
                                  }}
                                >
                                  <OutlineIcons.UserGroup className="" />
                                </div>
                                <div className="text-cool-gray-500 w-full text-xs truncate group-hover:text-cool-gray-900 transition ease-in-out duration-150 capitalize">
                                  <div className="flex items-center justify-between w-full">
                                    <span>{role} users</span>
                                    {/basic|premium/i.test(role) && (
                                      <button
                                        onClick={e => {
                                          e.stopPropagation();
                                          copyLink(role);
                                        }}
                                        className="text-xs truncate  hover:underline cursor-pointer text-blue-200  has-tooltip"
                                      >
                                        {platformData.basicToken && platformData.premiumToken ? (
                                          <>
                                            <span className="tooltip bg-gray-900 p-3 -mt-12  md:-ml-32 text-gray-100 rounded">
                                              Click to copy magic sign up url.
                                            </span>
                                            <OutlineIcons.ClipboardCopy className="h-5 mx-2 inline cursor-pointer text-gray-500 hover:text-gray-800 "></OutlineIcons.ClipboardCopy>
                                          </>
                                        ) : null}
                                      </button>
                                    )}
                                  </div>

                                  <p className="text-xl font-semibold  text-gray-800">
                                    {analytics[role]}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleFilter(role)}
                                className="hover:underline cursor-pointer mt-2 px-3 text-base text-left border-gray-400 bg-gray-200 w-full py-2 text-blue-200"
                              >
                                {filter === role
                                  ? "View all users"
                                  : "View only " + role + " users"}
                              </button>
                            </div>
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <h2 className="">Users</h2>
              <span className="shadow-sm rounded-md">
                {platformData.basicToken && platformData.premiumToken ? (
                  <button
                    type="button"
                    className="self-end mx-2 inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out"
                    onClick={resetPlatformTokens}
                  >
                    Reset Sign Up Links
                  </button>
                ) : (
                  <button
                    type="button"
                    className="self-end mx-2 inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm animate-bounce leading-5 font-medium hover:opacity-50 rounded-md text-white  bg-blue-300  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out"
                    onClick={resetPlatformTokens}
                  >
                    Create Sign Up Links
                  </button>
                )}

                <button
                  type="button"
                  className="mr-2 inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out"
                  onClick={() => {
                    setModel(null);
                    setModalShowing(true);
                  }}
                >
                  Add user
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-md text-cool-gray-700 bg-white hover:text-cool-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-cool-gray-800 active:bg-cool-gray-50 transition duration-150 ease-in-out"
                  onClick={() => dispatch(getUsersCSVAsync())}
                >
                  Export to CSV
                </button>
              </span>
            </div>
            <table className="shadow mt-2 w-full divide-y divide-cool-gray-200 table-fixed">
              <thead>
                <tr>
                  <th
                    onClick={() => changeSort("name")}
                    className="cursor-pointer sm:w-1/4 px-6 py-3 bg-cool-gray-50 text-left text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex">
                      <p className="mr-2">name</p>
                      {sort.column === "name" ? (
                        sort.desc ? (
                          <OutlineIcons.ArrowDown className="w-4" />
                        ) : (
                          <OutlineIcons.ArrowUp className="w-4" />
                        )
                      ) : null}
                    </div>
                  </th>
                  <th
                    onClick={() => changeSort("role")}
                    className="cursor-pointer  sm:w-1/4 px-6 py-3 bg-cool-gray-50 text-left text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex">
                      <p className="mr-2">role</p>
                      {sort.column === "role" ? (
                        sort.desc ? (
                          <OutlineIcons.ArrowDown className="w-4" />
                        ) : (
                          <OutlineIcons.ArrowUp className="w-4" />
                        )
                      ) : null}
                    </div>
                  </th>
                  <th
                    onClick={() => changeSort("email")}
                    className="cursor-pointer px-6 sm:w-1/4 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex">
                      <p className="mr-2">email</p>
                      {sort.column === "email" ? (
                        sort.desc ? (
                          <OutlineIcons.ArrowDown className="w-4" />
                        ) : (
                          <OutlineIcons.ArrowUp className="w-4" />
                        )
                      ) : null}
                    </div>
                  </th>
                  <th className="sm:w-1/4 px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-cool-gray-200">
                {renderUsers.map((user, i) => (
                  <tr
                    key={i}
                    className={`${
                      0 === i % 2 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 cursor-pointer transition ease-in-out duration-150`}
                  >
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-cool-gray-900">
                      <div className="flex">
                        <p className="text-cool-gray-500 text-left truncate group-hover:text-cool-gray-900 transition ease-in-out duration-150">
                          {user.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-cool-gray-900">
                      <div className="flex">
                        <p className="text-cool-gray-500 text-left truncate group-hover:text-cool-gray-900 capitalize transition ease-in-out duration-150">
                          {user.role}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4  text-left whitespace-no-wrap truncate text-sm leading-5 text-cool-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <OutlineIcons.Pencil
                        className="h-5 mr-2 inline cursor-pointer text-gray-500 hover:text-gray-800"
                        onClick={() => {
                          setModalShowing(true);
                          setModel(user);
                        }}
                      />
                      <OutlineIcons.X
                        onClick={() => {
                          setDeleteModalShowing(true);
                          setModel(user);
                        }}
                        className="h-5 inline cursor-pointer text-gray-500 hover:text-gray-800"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/*
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
        Form={UserForm}
        title={model ? "Update user" : "Add new user"}
        model={model}
      />
      <DeleteConfirmationModal
        showing={deleteModalShowing}
        closeModal={() => {
          setDeleteModalShowing(false);
          //setModel(null);
        }}
        deleteAsync={() => {
          dispatch(deleteUserAsync({ user: model })).then(action => {
            if (!action.error) {
              dispatch(getPlatformAnalyticsAsync());
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

export default Users;
