import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import LabelEditForm from '../LabelEditForm';
import '../../setupTests';

const label = 'dog';

const onInputChange = jest.fn();

it('LabelEditForm renders properly', () => {
  const wrapper = shallow(
    <LabelEditForm label={label} onInputChange={onInputChange} />
  );
  const form = wrapper.find('.form');
  expect(form.length).toBe(1);
  const inputs = form.find('input');
  expect(inputs.length).toBe(1);
  expect(inputs.get(0).props.name).toEqual('label');
  expect(onInputChange).toHaveBeenCalledTimes(0);
  inputs.at(0).simulate('change', { target: { name: 'label', value: 'cat' } });
  expect(onInputChange).toHaveBeenCalledTimes(1);
});

it('LabelEditForm renders a snapshot properly', () => {
  const tree = renderer
    .create(<LabelEditForm label={label} onInputChange={jest.fn()} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
