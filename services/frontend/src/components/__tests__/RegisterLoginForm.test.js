import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import RegisterLoginForm from '../RegisterLoginForm';
import '../../setupTests';

describe('Register form', () => {
  const component = (
    <RegisterLoginForm formType="register" onButtonClick={jest.fn()} />
  );

  it('RegisterForm renders properly', () => {
    const wrapper = shallow(component);
    const form = wrapper.find('.form');
    expect(form.length).toBe(1);
    const inputs = form.find('input');
    expect(inputs.length).toBe(2);
    const instance = wrapper.instance();
    instance.handleInputChange({
      target: {
        name: 'username',
        value: 'testName',
      },
    });
    expect(wrapper.state()).toEqual({
      username: 'testName',
      password: '',
      valid: false,
    });
    inputs.at(1).simulate('change', {
      target: {
        name: 'password',
        value: 'ninechars',
      },
    });
    expect(wrapper.state()).toEqual({
      username: 'testName',
      password: 'ninechars',
      valid: true,
    });
    const button = form.find('button');
    expect(button.text()).toEqual('Register');
    const { onButtonClick } = component.props;
    expect(onButtonClick).toHaveBeenCalledTimes(0);
    button.simulate('click', { preventDefault: jest.fn() });
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });

  it('RegisterForm renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON;
    expect(tree).toMatchSnapshot();
  });
});

describe('Log In form', () => {
  const component = (
    <RegisterLoginForm formType="login" onButtonClick={jest.fn()} />
  );

  it('RegisterForm renders properly', () => {
    const wrapper = shallow(component);
    const form = wrapper.find('.form');
    expect(form.length).toBe(1);
    const inputs = form.find('input');
    expect(inputs.length).toBe(2);
    const instance = wrapper.instance();
    instance.handleInputChange({
      target: {
        name: 'username',
        value: 'testName',
      },
    });
    expect(wrapper.state()).toEqual({
      username: 'testName',
      password: '',
      valid: false,
    });
    inputs.at(1).simulate('change', {
      target: {
        name: 'password',
        value: 'ninechars',
      },
    });
    expect(wrapper.state()).toEqual({
      username: 'testName',
      password: 'ninechars',
      valid: true,
    });
    const button = form.find('button');
    expect(button.text()).toEqual('Log In');
    const { onButtonClick } = component.props;
    expect(onButtonClick).toHaveBeenCalledTimes(0);
    button.simulate('click', { preventDefault: jest.fn() });
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });

  it('RegisterForm renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON;
    expect(tree).toMatchSnapshot();
  });
});

describe('User is already logged in', () => {
  const component = (
    <RegisterLoginForm
      isAuthenticated
      formType="login"
      onButtonClick={jest.fn()}
    />
  );
  it('Form renders properly', () => {
    const wrapper = shallow(component);
    expect(wrapper.find('Redirect')).toHaveLength(1);
  });
});
