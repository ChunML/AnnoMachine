import React, { useState, useEffect } from 'react';

class Loader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: 'Uploading'
    };
  }

  componentDidMount() {
    const interval = setInterval(() => {
      const { text } = this.state;
      this.setState({
        text: text === 'Uploading...' ? 'Uploading' : `${text}.`
      });
    }, 500);
  }

  componentWillUnMount() {
    clearInterval(interval);
  }

  render() {
    const { text } = this.state;
    return (
      <div className="segment loader">
        <p>{ text }</p>
        <br />
        <br />
        <br />
      </div>
    );
  }

}

export default Loader;
