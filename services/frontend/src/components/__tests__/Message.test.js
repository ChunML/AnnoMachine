import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Message from '../Message';
import '../../setupTests';

describe('Error message', () => {
  const component = <Message type="error" text="Some error message" />;

  it('Error message renders properly', () => {
    const wrapper = shallow(component);
    const messageDiv = wrapper.find('.error.message');
    expect(messageDiv).toHaveLength(1);
    expect(messageDiv.find('.header')).toHaveLength(1);
    expect(messageDiv.find('.header').text()).toEqual('ERROR');
    expect(wrapper.find('p').text()).toEqual('Some error message');
  });

  it('Error message renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Success message', () => {
  const component = <Message type="success" text="Some success message" />;

  it('Success message renders properly', () => {
    const wrapper = shallow(component);
    const messageDiv = wrapper.find('.success.message');
    expect(messageDiv).toHaveLength(1);
    expect(messageDiv.find('.header')).toHaveLength(1);
    expect(messageDiv.find('.header').text()).toEqual('SUCCESS');
    expect(wrapper.find('p').text()).toEqual('Some success message');
  });

  it('Success message renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
