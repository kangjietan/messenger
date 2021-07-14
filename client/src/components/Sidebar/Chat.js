import React, { Component } from "react";
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
  fontFamily: "Open Sans",
  backgroundColor: "#3A8DFF",
  color: "white",
  borderRadius: "50%",
  padding: "8px",
  marginRight: "0.3rem",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "14px",
  lineHeight: "1.5",
  letterSpacing: "-0.2",
  width: "2rem",
};

class Chat extends Component {
  handleClick = async (conversation) => {
    await this.props.setActiveChat(conversation.otherUser.username);
  };

  render() {
    const { classes, conversation } = this.props;
    const otherUser = this.props.conversation.otherUser;
    let unreadMessages = 0;
    conversation.messages.forEach((message) => {
      if (!message.read && message.senderId === otherUser.id) unreadMessages++;
    });

    return (
      <Box
        onClick={() => this.handleClick(this.props.conversation)}
        className={classes.root}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent
          conversation={this.props.conversation}
          unreadMessages={unreadMessages}
        />
        {unreadMessages > 0 && (
          <div style={unreadMessagesStyles}>{unreadMessages}</div>
        )}
      </Box>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
  };
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Chat));
