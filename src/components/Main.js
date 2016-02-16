require('normalize.css');
require('styles/App.css');

import React from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import ChatLog from './ChatLog';
import User from './User';
import ActiveUsers from './ActiveUsers';
//var ChatInput = React.createClass({
//
//  onSubmit: function (event) {
//    event.preventDefault();
//    var body = "HELLOOO!";
//    this.props.onSubmit(body);
//  },
//
//  render: function () {
//
//    return (
//      <div className="chat-input">
//        <form onSubmit={this.onSubmit}>
//          <input placeholder="type here..."/>
//          <input type="submit"/>
//        </form>
//      </div>
//    );
//  }
//});

//var ChatMessage = React.createClass({
//  getDefaultProps: function () {
//    return {
//      alignRight: false,
//      delivered: true,
//      body: '',
//      user: {},
//      date: '',
//      id: ''
//    }
//  },
//
//  render: function () {
//    var align = this.props.alignRight ? 'right' : 'left';
//    var delivered = this.props.delivered ? '' : 'not-delivered';
//    var user = this.props.user;
//    return (
//      <div className="chat-message">
//        <div className={"align-" + align + ' ' + delivered}>
//          <User firstName={user.first_name} lastName={user.last_name} />
//          <div className="body">{this.props.body}</div>
//          <div className="date">{this.props.date}</div>
//        </div>
//      </div>
//    );
//  }
//});

//var ChatLog = React.createClass({
//  render: function () {
//    return (
//      <div className="chat-log">
//        {this.props.children}
//      </div>
//    );
//  }
//});

//var User = React.createClass({
//
//  render: function () {
//    return (
//      <span className="active-user">
//        <span className="green-dot"/>
//        <span>{this.props.firstName}</span> <span>{this.props.lastName}</span>
//      </span>
//    );
//  }
//});
//
//var ActiveUsers = React.createClass({
//  getDefaultProps: function () {
//    return {
//      list: []
//    }
//  },
//
//  render: function () {
//
//    var activeUsers = this.props.list.map(function (user) {
//      return (<User key={user.fb_id} firstName={user.first_name} lastName={user.last_name} />);
//    })
//
//    return (
//      <div className="active-users">
//        {activeUsers}
//      </div>
//    );
//  }
//});

var AppComponent = React.createClass({

  getInitialState: function () {

    return {
      activeUsers: [],

      messageLog: [],

      isLoggedIn: true,

      currentUser: {
        fb_id: "1307233471",
        first_name: "Vlad",
        last_name: "Goran"
      }
    }
  },


  fetchUsers: function () {
    var url = 'http://server.godev.ro:8081/api/participants';
    fetch(url).then(function(response) {
      return response.json()
    }).then(function(json) {
      this.setState({
        activeUsers: json
      });
    }.bind(this));
  },

  fetchUser: function () {
    var url = "http://server.godev.ro:8081/api/participants";
    return fetch(url,
      {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fb_id: "1307233471",
          first_name: "Vlad",
          last_name: "Goran"
        })
      }
    )
      .then(function(response) {
        return response.json();

      }).then(function(json) {
        this.setState({
          currentUser: json
        });
      }.bind(this));
  },

  fetchMessages: function () {
    console.log('getting messages', this.state.currentUser);
    var url = 'http://server.godev.ro:8081/api/messages/' + this.state.currentUser.id;
    fetch(url).then(function(response) {
      console.log('response',response);
      return response.json()
    }).then(function(json) {
      this.setState({
        messageLog: json
      });
    }.bind(this));
  },

  componentWillMount: function () {

    this.fetchUsers();
    setInterval(this.fetchUsers, 3000);

    this.fetchUser().then(function () {
      this.fetchMessages();
      setInterval(this.fetchMessages, 2000);
    }.bind(this));
  },

  onSubmit: function (body) {
    // call API...
  },

  render: function () {
    var currentUser = this.state.currentUser;
    var chatMessages = this.state.messageLog.map(function (message) {
      var alignRight = (currentUser.fb_id === message.participant.fb_id);

      return (<ChatMessage
        user={message.participant}
        body={message.body}
        date={message.date}
        delivered={message.id}
        key={message.id}
        alignRight={alignRight}
      />)
    });

    return (
      <div className="app">
        <ActiveUsers list={this.state.activeUsers}/>
        <ChatLog>
          {chatMessages}
        </ChatLog>
        <ChatInput onSubmit={this.onSubmit}/>
      </div>
    );
  }
});


export default AppComponent;
