import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import ImageDetail from '../ImageDetail';
import '../../setupTests';

const image = {
  name: 'testImage',
  uploaded_at: '2000/01/01 01:02',
  user: {
    username: 'testUser',
  },
  width: 100,
  height: 100,
  boxes: [
    {
      id: 1,
      label: 'dog',
      x_min: 10,
      y_min: 10,
      x_max: 20,
      y_max: 20,
    },
    {
      id: 2,
      label: 'cat',
      x_min: 20,
      y_min: 20,
      x_max: 40,
      y_max: 40,
    },
  ],
};

describe('No image is passed', () => {
  it('ImageDetail renders properly', () => {
    const wrapper = shallow(<ImageDetail createMessage={jest.fn()} />);
    expect(wrapper.text()).toEqual('Loading...');
  });

  it('ImageDetail renders a snapshot properly', () => {
    const tree = renderer
      .create(<ImageDetail createMessage={jest.fn()} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('One image is properly passed', () => {
  it('ImageDetail renders properly', () => {
    const wrapper = shallow(
      <ImageDetail image={image} createMessage={jest.fn()} />
    );
    const columns = wrapper.find('.row > .half-width-item');
    expect(columns.length).toBe(2);
    expect(columns.at(0).find('ImageAnnoDisplay')).toHaveLength(1);
    expect(columns.at(0).find('.button')).toHaveLength(1);
    expect(
      columns
        .at(0)
        .find('.button')
        .text()
    ).toEqual('Download annotation');
    expect(columns.at(1).find('UploadInfo')).toHaveLength(1);
    expect(columns.at(1).find('BoxesDetail')).toHaveLength(1);
    expect(columns.at(1).find('.button')).toHaveLength(1);
    expect(
      columns
        .at(1)
        .find('.button')
        .get(0).props.children
    ).toContain('Add');
    columns
      .at(1)
      .find('.button')
      .simulate('click');
    expect(
      wrapper
        .find('.row > .half-width-item')
        .at(1)
        .find('.button')
        .get(0).props.children
    ).toContain('Undo');
  });

  it('ImageDetail renders a snapshot properly', () => {
    const tree = renderer
      .create(<ImageDetail image={image} createMessage={jest.fn()} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
