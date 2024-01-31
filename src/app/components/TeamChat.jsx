import { useState, useCallback, useRef } from "react";
import Talk from "talkjs";
import { Chatbox, useSession } from "@talkjs/react";
import talkJsConfig from "../talkJsConfig";
import CategoryCollapse from "./CategoryCollapse";
import ConversationListItem from "./ConversationListItem";
import ChatHeader from "./ChatHeader";

const TeamChat = ({ unreadMessages }) => {
  const initialConversation = talkJsConfig.conversations.channels[0];
  const [currentConversation, setCurrentConversation] =
    useState(initialConversation);

  const session = useSession();
  const chatboxRef = useRef(null);

  const [mobileChannelSelected, setMobileChannelSelected] = useState(true); //This is used to control whether or not to display the chatbox or the inbox while on mobile displays

  const changeConversation = (conversation) => {
    if (session?.isAlive) {
      const talkJsConversation = session.getOrCreateConversation(
        conversation.id
      );
      const me = new Talk.User(talkJsConfig.userId);

      talkJsConversation.setParticipant(me);
      talkJsConversation.setAttributes(conversation);
      setMobileChannelSelected(true);
      setCurrentConversation(conversation);

      if (chatboxRef.current?.isAlive) {
        chatboxRef.current.select(talkJsConversation);
      }
    }
  };

  const syncConversation = useCallback((session) => {
    const defaultConv = session.getOrCreateConversation("remoteWorkMeetup");
    defaultConv.setParticipant(session.me);
    return defaultConv;
  }, []);

  return (
    <>
      <div className="w-full h-screen flex flex-row bg-gray-900 text-white border-none">
        <div
          className={`flex flex-col ${
            mobileChannelSelected
              ? "lg:w-1/3 hidden lg:block"
              : "lg:w-1/3 w-full"
          }`}
          style={{
            borderColor: "#737373",
            borderWidth: "0 0 0 0",
            borderStyle: "solid",
          }}
        >
          <div
            className="h-20 flex flex-col justify-around rounded-t-xl lg:rounded-none lg:rounded-tl-xl rounded-tl-xl mb-4"
            style={{
              borderColor: "#737373",
              borderWidth: "1px 0 1px 1px",
              borderStyle: "solid",
              backgroundColor: "#404040",
            }}
          >
            <h1
              className="text-xl text-bold pl-4"
              style={{
                fontSize: "16px",
              }}
            >
              Channels
            </h1>
          </div>

          <CategoryCollapse title={"Channels"}>
            {talkJsConfig.conversations.channels.map((channel, key) => {
              return (
                <ConversationListItem
                  conversation={channel}
                  key={key}
                  changeConversation={changeConversation}
                  unreadMessages={unreadMessages}
                  currentConversation={currentConversation}
                />
              );
            })}
          </CategoryCollapse>

          <CategoryCollapse title={"Direct messages"}>
            {talkJsConfig.conversations.dms.map((dm, key) => {
              return (
                <ConversationListItem
                  conversation={dm}
                  key={key}
                  changeConversation={changeConversation}
                  unreadMessages={unreadMessages}
                  currentConversation={currentConversation}
                />
              );
            })}
          </CategoryCollapse>
        </div>

        <div
          className={`flex flex-col ${
            mobileChannelSelected
              ? "lg:w-2/3 w-full"
              : "lg:w-2/3 hidden lg:block"
          }`}
        >
          <div className="h-20 w-full">
            <ChatHeader
              conversation={currentConversation}
              mobileChannelSelected={mobileChannelSelected}
              setMobileChannelSelected={setMobileChannelSelected}
            />
          </div>

          <Chatbox
            syncConversation={syncConversation}
            className="h-full w-full overflow-hidden rounded-b-xl lg:rounded-none lg:rounded-br-xl"
            showChatHeader={false}
            theme="team_chat"
            chatboxRef={chatboxRef}
          />
        </div>
      </div>
    </>
  );
};

export default TeamChat;
