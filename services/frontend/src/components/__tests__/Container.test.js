import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Container from '../Container';
import ImageTabNavBar from '../ImageTabNavBar';
import '../../setupTests';

const images = [
  {
    id: 1,
    name: 'test.jpg',
    width: 100,
    height: 100,
    user: {
      username: 'testUser',
    },
    uploaded_at: '2000/01/01 01:02',
    boxes: [
      {
        id: 1,
        x_min: 10,
        y_min: 10,
        x_max: 20,
        y_max: 20,
        label: 'dog',
      },
    ],
  },
];

describe('Image dashboard page', () => {
  it('Container renders properly', () => {
    const wrapper = mount(
      <Router initialEntries={['/images']}>
        <Container
          images={images}
          onButtonClick={jest.fn()}
          onTabChange={jest.fn()}
          onDeleteImage={jest.fn()}
          createMessage={jest.fn()}
          isAuthenticated={false}
          isLoading={false}
          currentUser="testUser"
          selectedTab="all"
        />
      </Router>
    );
    expect(wrapper.find(ImageTabNavBar)).toHaveLength(1);
    expect(wrapper.find('CardList')).toHaveLength(1);
    expect(wrapper.find('AddImageForm')).toHaveLength(0);
  });

  it('Container renders properly with authenticated user', () => {
    const wrapper = mount(
      <Router initialEntries={['/images']}>
        <Container
          images={images}
          onButtonClick={jest.fn()}
          onTabChange={jest.fn()}
          onDeleteImage={jest.fn()}
          createMessage={jest.fn()}
          isAuthenticated
          isLoading={false}
          currentUser="testUser"
          selectedTab="all"
        />
      </Router>
    );
    expect(wrapper.find(ImageTabNavBar)).toHaveLength(1);
    expect(wrapper.find('CardList')).toHaveLength(1);
    expect(wrapper.find('AddImageForm')).toHaveLength(1);
  });

  it('Container renders a snapshot properly', () => {
    const tree = renderer
      .create(
        <Router initialEntries={['/images']}>
          <Container
            images={images}
            onButtonClick={jest.fn()}
            onTabChange={jest.fn()}
            onDeleteImage={jest.fn()}
            createMessage={jest.fn()}
            isAuthenticated={false}
            isLoading={false}
            currentUser="testUser"
            selectedTab="all"
          />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Image detail page', () => {
  it('Container renders properly', () => {
    const wrapper = mount(
      <Router initialEntries={['/images/test']}>
        <Container
          images={images}
          onButtonClick={jest.fn()}
          onTabChange={jest.fn()}
          onDeleteImage={jest.fn()}
          createMessage={jest.fn()}
          isAuthenticated={false}
          isLoading={false}
          currentUser="testUser"
          selectedTab="all"
        />
      </Router>
    );
    expect(wrapper.find('ImageDetail')).toHaveLength(1);
  });

  it('Container renders a snapshot properly', () => {
    const tree = renderer
      .create(
        <Router initialEntries={['/images/test']}>
          <Container
            images={images}
            onButtonClick={jest.fn()}
            onTabChange={jest.fn()}
            onDeleteImage={jest.fn()}
            createMessage={jest.fn()}
            isAuthenticated={false}
            isLoading={false}
            currentUser="testUser"
            selectedTab="all"
          />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
