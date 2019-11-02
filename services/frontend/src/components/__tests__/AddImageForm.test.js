import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import AddImageForm from '../AddImageForm';
import '../../setupTests';

const onButtonClick = jest.fn();

it('AddImageForm renders properly', () => {
  const wrapper = shallow(<AddImageForm onButtonClick={onButtonClick} />);
  const form = wrapper.find('form');
  expect(form.length).toBe(1);
  const fields = form.find('.input-field');
  expect(fields.length).toBe(2);
  expect(fields.get(0).props.children.type).toBe('input');
  expect(fields.get(0).props.children.props.name).toBe('image_file');
  expect(fields.get(1).props.children.type).toBe('input');
  expect(fields.get(1).props.children.props.name).toBe('image_url');
  expect(onButtonClick).toHaveBeenCalledTimes(0);

  const image_url = form.find('input[name="image_url"]');
  image_url.simulate('change', { target: { name: 'image_url', value: 'abc' } });
  const button = form.find('button');
  button.simulate('click', { preventDefault: () => {} });
  expect(onButtonClick).toHaveBeenCalledTimes(1);

  const image_file = form.find('input[name="image_file"]');
  image_file.simulate('change', { target: { files: ['file_1'] } });
  image_url.simulate('change', { target: { name: 'image_url', value: '' } });
  button.simulate('click', { preventDefault: () => {} });
  expect(onButtonClick).toHaveBeenCalledTimes(2);
});

it('AddImageForm renders a snapshot properly', () => {
  const tree = renderer
    .create(
      <Router location="/">
        <AddImageForm onButtonClick={jest.fn()} />
      </Router>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
