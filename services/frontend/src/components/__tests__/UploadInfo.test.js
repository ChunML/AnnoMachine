import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import UploadInfo from '../UploadInfo';
import '../../setupTests';

const component = (
  <UploadInfo username="testUser" uploaded_at="2000/01/01 01:02" />
);

it('UploadInfo renders properly', () => {
  const wrapper = shallow(component);
  const info = wrapper.find('p');
  expect(info.length).toBe(2);
  expect(info.at(0).text()).toEqual('Author: testUser');
  expect(info.at(1).text()).toEqual('Uploaded at: 2000/01/01 01:02');
});

it('UploadInfo renders a snapshot properly', () => {
  const tree = renderer.create(component).toJSON();
  expect(tree).toMatchSnapshot();
});
