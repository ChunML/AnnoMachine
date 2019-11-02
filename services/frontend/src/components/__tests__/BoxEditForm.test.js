import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import BoxEditForm from '../BoxEditForm';
import '../../setupTests';

const coords = {
  x_min: 10,
  y_min: 10,
  x_max: 20,
  y_max: 20,
};

const onInputChange = jest.fn();

it('BoxEditForm renders properly', () => {
  const wrapper = shallow(
    <BoxEditForm coords={coords} onInputChange={onInputChange} />
  );
  const form = wrapper.find('.row');
  expect(form.length).toBe(1);
  const inputs = form.find('input');
  expect(inputs.length).toBe(4);
  expect(inputs.get(0).props.name).toEqual('x_min');
  expect(inputs.get(1).props.name).toEqual('y_min');
  expect(inputs.get(2).props.name).toEqual('x_max');
  expect(inputs.get(3).props.name).toEqual('y_max');
  expect(onInputChange).toHaveBeenCalledTimes(0);
  inputs.at(0).simulate('change', { target: { name: 'x_min', value: '200' } });
  expect(onInputChange).toHaveBeenCalledTimes(1);
  inputs.at(0).simulate('change', { target: { name: 'y_min', value: '200' } });
  expect(onInputChange).toHaveBeenCalledTimes(2);
  inputs.at(0).simulate('change', { target: { name: 'x_max', value: '200' } });
  expect(onInputChange).toHaveBeenCalledTimes(3);
  inputs.at(0).simulate('change', { target: { name: 'y_max', value: '200' } });
  expect(onInputChange).toHaveBeenCalledTimes(4);
});

it('BoxEditForm renders a snapshot properly', () => {
  const tree = renderer
    .create(<BoxEditForm coords={coords} onInputChange={jest.fn()} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
