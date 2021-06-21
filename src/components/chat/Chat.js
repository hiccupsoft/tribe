import React, { useEffect } from "react";
import { readManyChatMessagesAsync } from "../../features/chat/chatSlice";
import { setLoginModalState } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import * as moment from "moment";
import ChatMenu from "./ChatMenu";
import ChatMessageForm from "./ChatMessageForm";
import constants from "../../constants.json";

const Chat = ({ content }) => {
  const { currentUser } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const scrollChatToBottom = () => {
    // scroll chat to bottom on message send
    const chatMessagesDiv = document.getElementById("chatMessages");
    if (chatMessagesDiv) chatMessagesDiv.scrollTo(0, chatMessagesDiv.scrollHeight);
  };

  // load chat
  useEffect(() => {
    if (content.chatEnabled) {
      dispatch(readManyChatMessagesAsync({ contentId: content.id })).then(() => {
        scrollChatToBottom();
      });
    }
    // eslint-disable-next-line
  }, []);

  const { chatMessages } = useSelector(state => state.chat);

  // stick chat message textarea to bottom
  useEffect(() => {
    // update chat
    if (content.chatEnabled) {
      const interval = setInterval(() => {
        dispatch(readManyChatMessagesAsync({ contentId: content.id })).then(() => {
          const chatMessagesDiv = document.getElementById("chatMessages");

          // TODO: scroll chat down after sign in
          // TODO: if chat was scrolled all the way down prior to the refresh
          if (
            chatMessagesDiv &&
            chatMessagesDiv.scrollHeight -
              chatMessagesDiv.scrollTop -
              chatMessagesDiv.clientHeight <
              55
          ) {
            scrollChatToBottom();
          }
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      {content.chatEnabled && (
        <>
          {!!currentUser ? (
            <div
              className="md:ml-2 flex flex-1 flex-col text-white"
              style={{
                height: 552,
                maxHeight: 522,
                background: "#161616"
              }}
            >
              <div style={{ overflow: "auto" }} className="flex-1 px-6 pt-5" id="chatMessages">
                {(chatMessages || []).map(message => {
                  if (message.User.banned) return null;
                  return (
                    <div key={message.id} className="mb-2 flex justify-between items-center">
                      {/* message */}

                      <div>
                        {/* name and date */}
                        <div className="flex items-center" style={{ lineHeight: 1.2 }}>
                          {/* avatar */}
                          <div className="">
                            <img
                              className="inline-block h-9 w-9 rounded-full mr-2"
                              src={
                                message.User && message.User.photoUrl
                                  ? constants.cdnUrl + message.User.photoUrl
                                  : "/anon.png"
                              }
                              alt={message.User && message.User.name}
                            />
                          </div>
                          <b className="mr-2" style={{ fontSize: "18px" }}>
                            {message.User.name}.
                          </b>{" "}
                          <span className="" style={{ color: "#ACACAC", fontSize: "12px" }}>
                            {moment(message.createdAt).fromNow()}
                          </span>
                        </div>

                        {/* message */}
                        <div className="mb-2 ml-11" style={{ fontSize: "16px" }}>
                          {!message.deleted ? (
                            message.message
                          ) : (
                            <span className="text-gray-700 text-xs">[message deleted]</span>
                          )}
                        </div>
                      </div>

                      <ChatMenu message={message} />
                    </div>
                  );
                })}
              </div>

              <ChatMessageForm content={content} scrollChatToBottom={scrollChatToBottom} />
            </div>
          ) : (
            <div
              className="md:ml-5  sm:m-0   m-5 p-5 flex flex-1 flex-col items-center justify-center text-gray-700 bg-opacity-0 sm:bg-opacity-50 bg-black "
              data-style={{ height: 600 }}
            >
              <svg
                className=" hidden sm:inline-flex "
                xmlns="http://www.w3.org/2000/svg"
                width="29.996"
                height="29.997"
              >
                <path
                  d="M27.345 28.665c-.64-.467-1.131-.819-1.615-1.184-1.549-1.158-3.076-2.353-4.656-3.468-.424-.299-1.008-.508-1.52-.514-3.367-.045-6.736-.01-10.104-.037-.58-.004-1.158-.178-1.738-.271l-.019-.27c.841-.639 1.671-1.295 2.533-1.904.182-.128.479-.125.725-.126 3.255-.009 6.511-.019 9.766.014.383.004.811.188 1.135.41.938.646 1.836 1.352 2.9 2.146v-2.57h2.534V9.141c-1.169 0-2.286-.028-3.397.033-.156.009-.406.455-.412.702-.035 1.823-.011 3.648-.021 5.473-.014 1.921-.983 2.896-2.908 2.899-3.366.01-6.735-.021-10.104.023a2.845 2.845 0 00-1.52.512c-1.895 1.354-3.74 2.772-5.606 4.168-.191.143-.398.264-.736.486 0-1.545-.017-2.937.009-4.324.01-.533-.047-.839-.698-.969C.775 17.92.023 16.918.017 15.752-.004 11.794-.008 7.837.014 3.88c.006-1.431 1.074-2.528 2.5-2.534 6.147-.02 12.293-.019 18.439.004 1.387.006 2.423 1.079 2.49 2.464.029.616.049 1.237.004 1.852-.051.671.132.961.877.907.977-.069 1.964-.027 2.943-.011 1.594.025 2.687 1.016 2.701 2.609.041 3.9.031 7.802 0 11.703-.012 1.33-.771 2.244-2.046 2.533-.464.104-.589.291-.582.727.019 1.179.005 2.357.003 3.535.002.269.002.538.002.996zM20.73 15.677c.067-.188.104-.24.104-.292.01-3.616.006-7.23.029-10.848.004-.585-.315-.609-.75-.609-5.581.007-11.16.014-16.74-.007-.63-.002-.807.196-.801.818.029 3.393.014 6.785.02 10.178 0 .238.041.477.07.789h2.592v2.525c1.068-.802 1.964-1.515 2.906-2.156a2.222 2.222 0 011.143-.384c1.541-.042 3.083-.016 4.626-.014h6.801z"
                  fill="currentColor"
                ></path>
                <circle cx="7.457" cy="9.917" r="1.438" fill="currentColor"></circle>
                <circle cx="12.332" cy="9.917" r="1.438" fill="currentColor"></circle>
                <circle cx="17.207" cy="9.917" r="1.438" fill="currentColor"></circle>
              </svg>
              <div
                className="flex mt-4 items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white button transition ease-in-out duration-150"
                onClick={() =>
                  dispatch(
                    setLoginModalState({
                      loginModalShowing: true,
                      activeAuthForm: "signIn"
                    })
                  )
                }
              >
                {currentUser ? "loading..." : "Sign in to join conversation"}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Chat;
