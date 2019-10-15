import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Card from '../Card';
import '../../setupTests';

const image = {
  name: 'test.jpg',
  user: {
    username: 'testUser'
  },
  uploaded_at: '2000/01/01 01:02',
  boxes: [
    {
      label: 'dog',
    },
    {
      label: 'cat',
    },
    {
      label: 'dog'
    }
  ]
};

const onDeleteImage = jest.fn();
const currentUser = ['testUser', 'testUser_2'];

describe('current user is the author of the image', () => {
  it('Card renders properly', () => {
    const wrapper = shallow(
      <Card
        image={image}
        onDeleteImage={onDeleteImage}
        currentUser={currentUser[0]}
      />
    );
    const card = wrapper.find('.column').find('.ui.card');
    expect(card.length).toBe(1);
    const img = card.find('img');
    expect(img.length).toBe(1);
    expect(img.get(0).props.src).toContain(image.name);
    const icons = card.find('.icon');
    expect(icons.length).toBe(3);
    const extraContent = card.find('.extra.content');
    expect(extraContent.text()).toBe(`Uploaded by ${image.user.username} at ${image.uploaded_at}`);
  });

  it('Card renders a snapshot properly', () => {
    const tree = renderer.create(
      <Router location='/'>
        <Card
          image={image}
          onDeleteImage={onDeleteImage}
          currentUser={currentUser[0]}
        />
      </Router>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('current user is not the author of the image', () => {
  it('Card renders properly', () => {
    const wrapper = shallow(
      <Card
        image={image}
        onDeleteImage={onDeleteImage}
        currentUser={currentUser[1]}
      />
    );
    const card = wrapper.find('.column').find('.ui.card');
    expect(card.length).toBe(1);
    const img = card.find('img');
    expect(img.length).toBe(1);
    expect(img.get(0).props.src).toContain(image.name);
    const icons = card.find('.icon');
    expect(icons.length).toBe(2);
    const extraContent = card.find('.extra.content');
    expect(extraContent.text()).toBe(`Uploaded by ${image.user.username} at ${image.uploaded_at}`);
  });

  it('Card renders a snapshot properly', () => {
    const tree = renderer.create(
      <Router location='/'>
        <Card
          image={image}
          onDeleteImage={onDeleteImage}
          currentUser={currentUser[1]}
        />
      </Router>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});