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

const imageNoBox = {
  name: 'test.jpg',
  user: {
    username: 'testUser'
  },
  uploaded_at: '2000/01/01 01:02',
  boxes: []
};

const currentUser = ['testUser', 'testUser_2'];

describe('current user is the author of the image', () => {
  it('Card renders properly', () => {
    const onDeleteImage = jest.fn();
    const wrapper = shallow(
      <Card
        image={ image }
        onDeleteImage={ onDeleteImage }
        currentUser={ currentUser[0] }
      />
    );
    const card = wrapper.find('.column').find('.ui.card');
    expect(card.length).toBe(1);
    const img = card.find('img');
    expect(img.length).toBe(1);
    expect(img.get(0).props.src).toContain(image.name);
    const icons = card.find('.icon');
    expect(icons.length).toBe(3);
    icons.at(0).simulate('click');
    expect(wrapper.find('img').get(0).props.src).toContain('uploads');
    expect(onDeleteImage).toHaveBeenCalledTimes(0);
    icons.at(2).simulate('click');
    expect(onDeleteImage).toHaveBeenCalledTimes(1);
    const description = card.find('.description');
    expect(description.text()).toEqual('This image may contain: dogcat');
    const extraContent = card.find('.extra.content');
    expect(extraContent.text()).toBe(`Uploaded by ${image.user.username} at ${image.uploaded_at}`);
  });

  it('Card renders a snapshot properly', () => {
    const tree = renderer.create(
      <Router location='/'>
        <Card
          image={ image }
          onDeleteImage={ jest.fn() }
          currentUser={ currentUser[0] }
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
        image={ image }
        onDeleteImage={ jest.fn() }
        currentUser={ currentUser[1] }
      />
    );
    const card = wrapper.find('.column').find('.ui.card');
    expect(card.length).toBe(1);
    const img = card.find('img');
    expect(img.length).toBe(1);
    expect(img.get(0).props.src).toContain(image.name);
    const icons = card.find('.icon');
    expect(icons.length).toBe(2);
    icons.at(0).simulate('click');
    expect(wrapper.find('img').get(0).props.src).toContain('uploads');
    const description = card.find('.description');
    expect(description.text()).toEqual('This image may contain: dogcat');
    const extraContent = card.find('.extra.content');
    expect(extraContent.text()).toBe(`Uploaded by ${image.user.username} at ${image.uploaded_at}`);
  });

  it('Card renders a snapshot properly', () => {
    const tree = renderer.create(
      <Router location='/'>
        <Card
          image={ image }
          onDeleteImage={ jest.fn() }
          currentUser={ currentUser[1] }
        />
      </Router>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Image has no boxes', () => {
  it('Card renders properly', () => {
    const onDeleteImage = jest.fn();
    const wrapper = shallow(
      <Card
        image={ imageNoBox }
        onDeleteImage={ onDeleteImage }
        currentUser={ currentUser[0] }
      />
    );
    const card = wrapper.find('.column').find('.ui.card');
    expect(card.length).toBe(1);
    const img = card.find('img');
    expect(img.length).toBe(1);
    expect(img.get(0).props.src).toContain(image.name);
    const icons = card.find('.icon');
    expect(icons.length).toBe(3);
    icons.at(0).simulate('click');
    expect(wrapper.find('img').get(0).props.src).toContain('uploads');
    expect(onDeleteImage).toHaveBeenCalledTimes(0);
    icons.at(2).simulate('click');
    expect(onDeleteImage).toHaveBeenCalledTimes(1);
    const description = card.find('.description');
    expect(description.text()).toEqual('This image may contain: nothing');
    const extraContent = card.find('.extra.content');
    expect(extraContent.text()).toBe(`Uploaded by ${image.user.username} at ${image.uploaded_at}`);
  });

  it('Card renders a snapshot properly', () => {
    const tree = renderer.create(
      <Router location='/'>
        <Card
          image={ image }
          onDeleteImage={ jest.fn() }
          currentUser={ currentUser[0] }
        />
      </Router>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});