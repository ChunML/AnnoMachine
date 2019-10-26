import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import '../../setupTests';
import CardList from '../CardList';

const images = [
  {
    id: 1,
    user: { username: 'user1' },
    name: 'testImage1.jpg',
    boxes: [],
  },
  {
    id: 2,
    user: { username: 'user2' },
    name: 'testImage2.jpg',
    boxes: [],
  },
  {
    id: 3,
    user: { username: 'user1' },
    name: 'testImage3.jpg',
    boxes: [],
  },
];

describe('On all tab', () => {
  const component = (
    <CardList
      isLoading={false}
      selectedTab="all"
      currentUser=""
      images={images}
      onDeleteImage={() => {}}
    />
  );
  it('CardList renders properly', () => {
    const wrapper = shallow(component);
    const loader = wrapper.find('Loader');
    expect(loader.length).toBe(0);
    const cards = wrapper.find('Card');
    expect(cards.length).toBe(3);
  });

  it('CardList renders a snapshot properly', () => {
    const tree = renderer
      .create(<Router initialEntries={['/images']}>{component}</Router>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('On your tab, anonymous user', () => {
  const component = (
    <CardList
      isLoading
      selectedTab="yours"
      currentUser=""
      images={images}
      onDeleteImage={() => {}}
    />
  );

  it('CardList renders properly with anonymous user', () => {
    const wrapper = shallow(component);
    expect(wrapper.text()).toEqual(
      'In order to see your images, log in first at here.'
    );
  });

  it('CardList renders a snapshot properly', () => {
    const tree = renderer
      .create(<Router initialEntries={['/images']}>{component}</Router>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('On your tab, logged in user', () => {
  const component = (
    <CardList
      isLoading
      selectedTab="yours"
      currentUser="user1"
      images={images}
      onDeleteImage={() => {}}
    />
  );

  it('CardList renders properly with Loader', () => {
    const wrapper = shallow(component);
    const loader = wrapper.find('Loader');
    expect(loader.length).toBe(1);
    const cards = wrapper.find('Card');
    expect(cards.length).toBe(2);
  });

  it('CardList renders a snapshot properly', () => {
    const tree = renderer
      .create(<Router initialEntries={['/images']}>{component}</Router>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
