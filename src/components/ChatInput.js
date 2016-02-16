require('normalize.css');
require('styles/App.css');

import React from 'react';

var ChatInput = React.createClass({

  onSubmit: function (event) {
    event.preventDefault();
    var body = this.refs.message.value;
    var form = this.refs.form.reset();
    this.props.onSubmit(body, form);


  },

  render: function () {

    return (
      <div className="chat-input">
        <form onSubmit={this.onSubmit} ref="form">
          <input ref="message" placeholder='type here...'/>
          <input type="submit"/>
        </form>
      </div>
    );
  }
});

export default ChatInput;
