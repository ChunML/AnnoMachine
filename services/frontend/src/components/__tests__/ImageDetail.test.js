import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import ImageDetail from '../ImageDetail';
import '../../setupTests';

const image = [{
  name: 'testImage',
  uploaded_at: '2000/01/01 01:02',
  user: {
    username: 'testUser'
  },
  boxes: [
    {
      label: 'dog',
      x_min: 10,
      y_min: 10,
      x_max: 20,
      y_max: 20
    },
    {
      label: 'cat',
      x_min: 20,
      y_min: 20,
      x_max: 40,
      y_max: 40
    },
  ]
}];

it('ImageDetail renders properly', () => {
  const wrapper = shallow(<ImageDetail image={ image } />);
  const columns = wrapper.find('.row.column');
  expect(columns.length).toBe(2);
});

it('ImageDetail renders a snapshot properly', () => {
  const tree = renderer.create(
    <ImageDetail image={ image } />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});