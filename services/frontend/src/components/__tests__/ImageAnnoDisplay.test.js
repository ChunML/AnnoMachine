import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import ImageAnnoDisplay from '../ImageAnnoDisplay';
import '../../setupTests';

const props = {
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

describe('Display landscape image', () => {
  const imageSize = { imageWidth: 100, imageHeight: 50 };
  it('ImageAnnoDisplay renders properly', () => {
    const wrapper = shallow(
      <ImageAnnoDisplay {...{ ...props, ...imageSize }} />
    );
    const svg = wrapper.find('svg');
    expect(svg.length).toBe(1);
    const image = svg.find('image');
    expect(image.length).toBe(1);
    expect(image.get(0).props.style.width).toEqual('100%');
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
    const tree = renderer
      .create(<ImageAnnoDisplay {...{ ...props, ...imageSize }} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Display portrait image', () => {
  const imageSize = { imageWidth: 50, imageHeight: 100 };
  it('ImageAnnoDisplay renders properly', () => {
    const wrapper = shallow(
      <ImageAnnoDisplay {...{ ...props, ...imageSize }} />
    );
    const svg = wrapper.find('svg');
    expect(svg.length).toBe(1);
    const image = svg.find('image');
    expect(image.length).toBe(1);
    expect(image.get(0).props.style.height).toEqual('100%');
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
    const tree = renderer
      .create(<ImageAnnoDisplay {...{ ...props, ...imageSize }} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
