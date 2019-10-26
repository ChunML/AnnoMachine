import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import ImageTabNavBar from '../ImageTabNavBar';
import '../../setupTests';

describe('Tab all images selected', () => {
  const component = (
    <ImageTabNavBar selectedTab="all" onTabChange={jest.fn()} />
  );

  it('ImageTabNavBar renders properly', () => {
    const wrapper = shallow(component);
    const menu = wrapper.find('.menu');
    expect(menu.length).toBe(1);
    const tabs = menu.find('a');
    expect(tabs.length).toBe(2);
    expect(tabs.get(0).props.className).toEqual('active item');
    expect(tabs.get(1).props.className).toEqual(' item');
    expect(component.props.onTabChange).toHaveBeenCalledTimes(0);
    tabs.at(0).simulate('click');
    expect(component.props.onTabChange).toHaveBeenCalledTimes(1);
    tabs.at(1).simulate('click');
    expect(component.props.onTabChange).toHaveBeenCalledTimes(2);
  });

  it('ImageTabNavBar renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Tab your images selected', () => {
  const component = (
    <ImageTabNavBar selectedTab="yours" onTabChange={jest.fn()} />
  );

  it('ImageTabNavBar renders properly', () => {
    const wrapper = shallow(component);
    const menu = wrapper.find('.menu');
    expect(menu.length).toBe(1);
    const tabs = menu.find('a');
    expect(tabs.length).toBe(2);
    expect(tabs.get(0).props.className).toEqual(' item');
    expect(tabs.get(1).props.className).toEqual('active item');
    expect(component.props.onTabChange).toHaveBeenCalledTimes(0);
    tabs.at(0).simulate('click');
    expect(component.props.onTabChange).toHaveBeenCalledTimes(1);
    tabs.at(1).simulate('click');
    expect(component.props.onTabChange).toHaveBeenCalledTimes(2);
  });

  it('ImageTabNavBar renders a snapshot properly', () => {
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
