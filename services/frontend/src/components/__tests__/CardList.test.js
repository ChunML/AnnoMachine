import React from 'react';
import { shallow } from 'enzyme';
import '../../setupTests';
import CardList from '../CardList';

const images = [
  {
    id: 1,
    user: { username: 'user1' }
  },
  {
    id: 2,
    user: { username: 'user2' }
  }
];

it('CardList renders properly', () => {
  const wrapper = shallow(
    <CardList
      isLoading={ false }
      selectedTab='all'
      currentUser=''
      images={ images }
      onDeleteImage={ () => {} }
    />
  );
  const loader = wrapper.find('Loader');
  expect(loader.length).toBe(0);
  const cards = wrapper.find('Card');
  expect(cards.length).toBe(2);
});

it('CardList renders properly with Loader', () => {
  const wrapper = shallow(
    <CardList
      isLoading={ true }
      selectedTab=''
      currentUser='user1'
      images={ images }
      onDeleteImage={ () => {} }
    />
  );
  const loader = wrapper.find('Loader');
  expect(loader.length).toBe(1);
  const cards = wrapper.find('Card');
  expect(cards.length).toBe(1);
});