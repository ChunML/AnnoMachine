import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import NavBar from '../NavBar';
import '../../setupTests';

const title = 'Hi, there!';

describe('When not authenticated', () => {
  it('Navbar renders properly', () => {
    const wrapper = shallow(<NavBar title={title} isAuthenticated={false} />);
    const header = wrapper.find('.nav-header');
    expect(header.length).toBe(1);
    expect(header.get(0).props.children).toBe(title);

    const items = wrapper.find('.nav-link');
    expect(items.length).toBe(4);
    expect(items.get(0).props.children.props.children).toBe('Home');
    expect(items.get(1).props.children.props.children).toBe('Register');
    expect(items.get(2).props.children.props.children).toBe('Log In');
  });

  it('Navbar renders a snapshot properly', () => {
    const tree = renderer
      .create(
        <Router location="/">
          <NavBar title={title} isAuthenticated={false} />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('When authenticated', () => {
  it('Navbar renders properly', () => {
    const wrapper = shallow(<NavBar title={title} isAuthenticated />);
    const header = wrapper.find('.nav-header');
    expect(header.length).toBe(1);
    expect(header.get(0).props.children).toBe(title);

    const items = wrapper.find('.nav-link');
    expect(items.length).toBe(3);
    expect(items.get(0).props.children.props.children).toBe('Home');
    expect(items.get(1).props.children.props.children).toBe('Log Out');
  });

  it('Navbar renders a snapshot properly', () => {
    const tree = renderer
      .create(
        <Router location="/">
          <NavBar title={title} isAuthenticated />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
