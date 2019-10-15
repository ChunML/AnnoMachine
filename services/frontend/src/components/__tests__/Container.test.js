import React from 'react';
import { shallow } from 'enzyme';
import Container from '../Container';
import '../../setupTests';

it('Container renders properly', () => {
  const wrapper = shallow(
    <Container
      images={[{}]}
      onButtonClick={() => {}}
      onTabChange={() => {}}
      onDeleteImage={() => {}}
      isAuthenticated={false}
      isLoading={false}
      currentUser=''
      selectedTab=''
    />
  );
  const container = wrapper.find('.container');
  expect(container).toBeDefined();
});