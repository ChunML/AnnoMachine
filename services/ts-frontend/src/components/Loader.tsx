import React from 'react';

class Loader extends React.Component {
  state: { text: string; };
  interval: any;
  constructor(props: any) {
    super(props);

    this.state = {
      text: 'Uploading',
    };

    this.interval = 0;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const { text } = this.state;
      this.setState({
        text: text === 'Uploading...' ? 'Uploading' : `${text}.`,
      });
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { text } = this.state;
    return (
      <div className="segment loader">
        <p>{text}</p>
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default Loader;
