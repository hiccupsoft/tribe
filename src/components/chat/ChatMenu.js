import React, { useState, useRef, useEffect } from "react";
import { Transition } from "@tailwindui/react";
import { banUserAsync } from "../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteChatMessageAsync } from "../../features/chat/chatSlice";

const ChatMenu = ({ message }) => {
  const { currentUser } = useSelector(state => state.auth);

  const [userMenuOpenId, setUserMenuOpenId] = useState(null);

  const userMenuRef = useRef(null);

  const dispatch = useDispatch();

  // handle click outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = event => {
    if (userMenuRef && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      // click outsite userMenuRef
      setUserMenuOpenId(null);
    }
  };

  return (
    <div
      className={
        "sa" === currentUser.role || "admin" === currentUser.role ? "visible" : "invisible"
      }
    >
      <div className="relative inline-block text-left">
        <div>
          <button
            className="flex items-center text-gray-400 hover:text-gray-600 focus:border-none focus:outline-none "
            onClick={() => {
              if (userMenuOpenId) {
                setUserMenuOpenId(null);
              } else {
                setUserMenuOpenId(message.id);
              }
            }}
          >
            <span className="sr-only">Open options</span>

            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        {/* start: user menu */}
        <Transition
          show={message.id === userMenuOpenId}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div
            ref={userMenuRef}
            style={{ zIndex: 1 }}
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          >
            <div className="py-1" role="menu">
              <button
                className="block focus:outline-none w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => {
                  dispatch(deleteChatMessageAsync({ id: message.id, delete: !message.deleted }));
                  setUserMenuOpenId(null);
                }}
              >
                {!message.deleted ? "Delete Message" : "Undelete message"}
              </button>
              <button
                className="block focus:outline-none w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => {
                  dispatch(banUserAsync({ id: message.User.id }));
                  setUserMenuOpenId(null);
                }}
              >
                Ban User
              </button>
            </div>
          </div>
        </Transition>
        {/* end: user menu */}
      </div>
    </div>
  );
};

export default ChatMenu;
