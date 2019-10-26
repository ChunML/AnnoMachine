import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import BoxCoord from '../BoxCoord';
import '../../setupTests';

const coords = {
  x_min: 10,
  y_min: 10,
  x_max: 20,
  y_max: 20,
};

it('BoxCoord renders properly', () => {
  const wrapper = shallow(<BoxCoord coords={coords} />);
  const spans = wrapper.find('span');
  expect(spans.length).toBe(4);
});

it('BoxCoord renders a snapshot properly', () => {
  const tree = renderer.create(<BoxCoord coords={coords} />).toJSON();
  expect(tree).toMatchSnapshot();
});
