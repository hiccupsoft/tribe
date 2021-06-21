import React, { useEffect, useState } from "react";
import * as OutlineIcons from "../../assets/icons/outline";
import { useDispatch, useSelector } from "react-redux";
import { readManyChatMessagesAsync, postChatMessageAsync } from "../../features/chat/chatSlice";

const ChatMessageForm = ({ content, scrollChatToBottom }) => {
  const { currentUser } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [chatFixed, setChatFixed] = useState(true);

  const [chatMessage, setChatMessage] = useState(null);

  const postChatMessage = () => {
    if (chatMessage && chatMessage.length > 0)
      dispatch(
        postChatMessageAsync({
          message: chatMessage,
          ContentId: content.id,
          UserId: currentUser.id
        })
      ).then(() => {
        setChatMessage(null);
        dispatch(readManyChatMessagesAsync({ contentId: content.id })).then(() => {
          scrollChatToBottom();
        });
      });
  };

  const handleScroll = () => {
    if (window.scrollY < 200) {
      setChatFixed(true);
    } else {
      setChatFixed(false);
    }
  };

  // stick chat message textarea to bottom
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

    // eslint-disable-next-line
  }, []);

  const onPressEnter = event => {
    if (13 === event.keyCode && false === event.shiftKey) {
      event.preventDefault();
      postChatMessage();
    }
  };

  return (
    <div
      className={`${chatFixed ? "fixed bottom-0" : "relative"} w-full md:relative bg-white`}
      style={{
        flexBasis: 100,
        borderBottomColor: "rgb(33 40 47)",
        borderWidth: 1,
        zIndex: 1
      }}
    >
      <textarea
        value={chatMessage || ""}
        onChange={event => setChatMessage(event.target.value)}
        className="form-textarea outline-none text-md md:leading-5 text-gray-600"
        placeholder="Join the conversation"
        style={{
          resize: "none",
          width: "85%",
          border: "none",
          boxShadow: "none",
          marginTop: 28
        }}
        onKeyDown={onPressEnter}
      ></textarea>
      <OutlineIcons.Send
        className="absolute bottom-9 right-5 inline cursor-pointer hover:opacity-50"
        style={{ color: "#6875F5" }}
        onClick={() => {
          postChatMessage();
        }}
      />
    </div>
  );
};

export default ChatMessageForm;
