import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";

const styles = {
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
};

const unreadMessagesStyles = {
  color: "white",
  borderRadius: "50%",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "14px",
  lineHeight: "1.5",
  letterSpacing: "-0.2",
  width: "2rem",
};

const Chat = (props) => {
  const { setActiveChat, classes, conversation } = props;
  const otherUser = conversation.otherUser;
  let unreadMessages = 0;
  conversation.messages.forEach((message) => {
    if (!message.read && message.senderId === otherUser.id) unreadMessages++;
  });

  const handleClick = async (conversation) => {
    await setActiveChat(conversation.otherUser.username);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent
        conversation={conversation}
        unreadMessages={unreadMessages}
      />
      {unreadMessages > 0 && (
        <Box style={unreadMessagesStyles} p={1} mr={1} bgcolor="primary.main">
          {unreadMessages}
        </Box>
      )}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
  };
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Chat));
