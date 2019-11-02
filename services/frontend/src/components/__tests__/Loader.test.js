import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Loader from '../Loader';
import '../../setupTests';

it('Loader renders properly', () => {
  const wrapper = shallow(<Loader />);
  expect(wrapper.find('.segment.loader')).toHaveLength(1);
});

it('Loader renders a snapshot properly', () => {
  const tree = renderer.create(<Loader />).toJSON();
  expect(tree).toMatchSnapshot();
});
