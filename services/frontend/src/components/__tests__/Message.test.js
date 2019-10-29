import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Message from '../Message';
import '../../setupTests';

describe('Error message', () => {
  const onCloseMessage = jest.fn();
  const component = (
    <Message
      type="error"
      text="Some error message"
      onCloseMessage={onCloseMessage}
    />
  );

  it('Error message renders properly', () => {
    const wrapper = shallow(component);
    const messageDiv = wrapper.find('.ui.error.message');
    expect(messageDiv).toHaveLength(1);
    expect(messageDiv.find('.header')).toHaveLength(1);
    expect(messageDiv.find('.header').text()).toEqual('ERROR');
    expect(messageDiv.find('i')).toHaveLength(1);
    expect(messageDiv.find('i').get(0).props.className).toEqual('close icon');
    expect(wrapper.find('p').text()).toEqual('Some error message');
    expect(onCloseMessage).toHaveBeenCalledTimes(0);
    messageDiv.find('i').simulate('click');
    expect(onCloseMessage).toHaveBeenCalledTimes(1);
  });

  it('Error message renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Success message', () => {
  const onCloseMessage = jest.fn();
  const component = (
    <Message
      type="success"
      text="Some success message"
      onCloseMessage={onCloseMessage}
    />
  );

  it('Success message renders properly', () => {
    const wrapper = shallow(component);
    const messageDiv = wrapper.find('.ui.success.message');
    expect(messageDiv).toHaveLength(1);
    expect(messageDiv.find('.header')).toHaveLength(1);
    expect(messageDiv.find('.header').text()).toEqual('SUCCESS');
    expect(messageDiv.find('i')).toHaveLength(1);
    expect(messageDiv.find('i').get(0).props.className).toEqual('close icon');
    expect(wrapper.find('p').text()).toEqual('Some success message');
    expect(onCloseMessage).toHaveBeenCalledTimes(0);
    messageDiv.find('i').simulate('click');
    expect(onCloseMessage).toHaveBeenCalledTimes(1);
  });

  it('Success message renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
