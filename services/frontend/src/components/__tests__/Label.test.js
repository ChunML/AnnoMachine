import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Label from '../Label';
import '../../setupTests';

const label = 'dog';

it('Label renders properly', () => {
  const wrapper = shallow(<Label label={label} />);
  const spans = wrapper.find('span');
  expect(spans.length).toBe(1);
  expect(spans.text()).toEqual('dog');
});

it('Label renders a snapshot properly', () => {
  const tree = renderer.create(<Label label={label} />).toJSON();
  expect(tree).toMatchSnapshot();
});
