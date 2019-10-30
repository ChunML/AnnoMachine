import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import BoxesDetail from '../BoxesDetail';
import '../../setupTests';

const boxes = [
  {
    id: 1,
    label: 'dog',
    x_min: 10,
    y_min: 10,
    x_max: 20,
    y_max: 20,
  },
  {
    id: 2,
    label: 'cat',
    x_min: 10,
    y_min: 10,
    x_max: 20,
    y_max: 20,
  },
];

const editModes = [false, false];

const component = (
  <BoxesDetail
    boxes={boxes}
    drawList={[1]}
    editModes={editModes}
    onInputChange={jest.fn()}
    onEyeIconClick={jest.fn()}
    onCheckIconClick={jest.fn()}
    onTrashIconClick={jest.fn()}
  />
);

it('BoxesDetail renders properly', () => {
  const wrapper = shallow(component);
  const segments = wrapper.find('.segments');
  expect(segments.length).toBe(1);
});

it('BoxesDetail renders a snapshot properly', () => {
  const tree = renderer.create(component).toJSON();
  expect(tree).toMatchSnapshot();
});
