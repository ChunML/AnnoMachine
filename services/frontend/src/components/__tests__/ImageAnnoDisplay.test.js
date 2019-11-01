import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import ImageAnnoDisplay from '../ImageAnnoDisplay';
import '../../setupTests';

const props_one_box = {
  svgWidth: 100,
  svgHeight: 100,
  drawBoxes: [
    {
      id: 1,
      x_min: 10,
      y_min: 10,
      x_max: 20,
      y_max: 20,
    },
  ],
  scale: 0.7,
  name: 'testName',
};

const props_two_boxes = {
  svgWidth: 100,
  svgHeight: 100,
  drawBoxes: [
    {
      id: 1,
      x_min: 10,
      y_min: 10,
      x_max: 20,
      y_max: 20,
    },
    {
      id: 2,
      x_min: 20,
      y_min: 20,
      x_max: 30,
      y_max: 30,
    },
  ],
  scale: 0.7,
  name: 'testName',
};

describe('Display landscape image with one box', () => {
  const imageSize = { imageWidth: 100, imageHeight: 50 };
  const onImageClick = jest.fn();
  const createMessage = jest.fn();
  const props = props_one_box;
  const component = (
    <ImageAnnoDisplay
      {...{ ...props, ...imageSize, onImageClick, createMessage }}
    />
  );
  it('ImageAnnoDisplay renders properly', () => {
    const wrapper = shallow(component);
    const svg = wrapper.find('svg');
    expect(svg.length).toBe(1);
    const image = svg.find('image');
    expect(image.length).toBe(1);
    expect(image.get(0).props.style.width).toEqual('100%');
    expect(onImageClick).toHaveBeenCalledTimes(0);
    expect(createMessage).toHaveBeenCalledTimes(0);
    svg.simulate('click');
    wrapper.find('image').simulate('mouseMove', {
      target: {
        getBoundingClientRect: () => ({ x: 100, y: 100 }),
      },
      clientX: 20,
      clientY: 20,
    });
    expect(onImageClick).toHaveBeenCalledTimes(1);
    expect(createMessage).toHaveBeenCalledTimes(0);
    const rects = svg.find('rect');
    expect(rects.length).toBe(1);
    rects.getElements().forEach((rect, i) => {
      expect(rect.props.x).toEqual(props.drawBoxes[i].x_min * props.scale);
      expect(rect.props.y).toEqual(props.drawBoxes[i].y_min * props.scale);
      expect(rect.props.width).toEqual(
        (props.drawBoxes[i].x_max - props.drawBoxes[i].x_min) * props.scale
      );
      expect(rect.props.height).toEqual(
        (props.drawBoxes[i].y_max - props.drawBoxes[i].y_min) * props.scale
      );
    });
  });

  it('ImageAnnoDisplay renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Display landscape image with two boxes', () => {
  const imageSize = { imageWidth: 100, imageHeight: 50 };
  const onImageClick = jest.fn();
  const createMessage = jest.fn();
  const props = props_two_boxes;
  const component = (
    <ImageAnnoDisplay
      {...{ ...props, ...imageSize, onImageClick, createMessage }}
    />
  );
  it('ImageAnnoDisplay renders properly', () => {
    const wrapper = shallow(component);
    const svg = wrapper.find('svg');
    expect(svg.length).toBe(1);
    const image = svg.find('image');
    expect(image.length).toBe(1);
    expect(image.get(0).props.style.width).toEqual('100%');
    expect(onImageClick).toHaveBeenCalledTimes(0);
    expect(createMessage).toHaveBeenCalledTimes(0);
    svg.simulate('click');
    wrapper.find('image').simulate('mouseMove', {
      target: {
        getBoundingClientRect: () => ({ x: 100, y: 100 }),
      },
      clientX: 20,
      clientY: 20,
    });
    expect(onImageClick).toHaveBeenCalledTimes(0);
    expect(createMessage).toHaveBeenCalledTimes(1);
    const rects = svg.find('rect');
    expect(rects.length).toBe(2);
    rects.getElements().forEach((rect, i) => {
      expect(rect.props.x).toEqual(props.drawBoxes[i].x_min * props.scale);
      expect(rect.props.y).toEqual(props.drawBoxes[i].y_min * props.scale);
      expect(rect.props.width).toEqual(
        (props.drawBoxes[i].x_max - props.drawBoxes[i].x_min) * props.scale
      );
      expect(rect.props.height).toEqual(
        (props.drawBoxes[i].y_max - props.drawBoxes[i].y_min) * props.scale
      );
    });
  });

  it('ImageAnnoDisplay renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Display portrait image', () => {
  const imageSize = { imageWidth: 50, imageHeight: 100 };
  const onImageClick = jest.fn();
  const createMessage = jest.fn();
  const props = props_one_box;
  const component = (
    <ImageAnnoDisplay
      {...{ ...props, ...imageSize, onImageClick, createMessage }}
    />
  );
  it('ImageAnnoDisplay renders properly', () => {
    const wrapper = shallow(component);
    const svg = wrapper.find('svg');
    expect(svg.length).toBe(1);
    const image = svg.find('image');
    expect(image.length).toBe(1);
    expect(image.get(0).props.style.height).toEqual('100%');
    expect(onImageClick).toHaveBeenCalledTimes(0);
    expect(createMessage).toHaveBeenCalledTimes(0);
    svg.simulate('click');
    wrapper.find('image').simulate('mouseMove', {
      target: {
        getBoundingClientRect: () => ({ x: 100, y: 100 }),
      },
      clientX: 20,
      clientY: 20,
    });
    expect(onImageClick).toHaveBeenCalledTimes(1);
    expect(createMessage).toHaveBeenCalledTimes(0);
    const rects = svg.find('rect');
    expect(rects.length).toBe(1);
    rects.getElements().forEach((rect, i) => {
      expect(rect.props.x).toEqual(props.drawBoxes[i].x_min * props.scale);
      expect(rect.props.y).toEqual(props.drawBoxes[i].y_min * props.scale);
      expect(rect.props.width).toEqual(
        (props.drawBoxes[i].x_max - props.drawBoxes[i].x_min) * props.scale
      );
      expect(rect.props.height).toEqual(
        (props.drawBoxes[i].y_max - props.drawBoxes[i].y_min) * props.scale
      );
    });
  });

  it('ImageAnnoDisplay renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
