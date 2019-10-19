import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import BoxDetail from '../BoxDetail';
import '../../setupTests';

const box = {
  id: 1,
  label: 'dog',
  x_min: 10,
  y_min: 10,
  x_max: 20,
  y_max: 20
};

const onEyeIconClick = jest.fn();

it('BoxDetail renders properly', () => {
  const wrapper = shallow(
    <BoxDetail
      box={ box }
      onEyeIconClick={ onEyeIconClick }
    />);
  const grid = wrapper.find('.grid');
  expect(grid.length).toBe(1);
  const rows = grid.find('.row');
  expect(rows.length).toBe(2);
  const columns = rows.at(0).find('.column');
  expect(columns.length).toBe(2);
  expect(columns.at(1).find('button').length).toBe(2);
});

it('BoxDetail renders a snapshot properly', () => {
  const tree = renderer.create(
    <BoxDetail
      box={ box }
      onEyeIconClick={ onEyeIconClick }
    />).toJSON();
  expect(tree).toMatchSnapshot();
});