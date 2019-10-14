import React from 'react';
import { shallow } from 'enzyme';
import App from '../../App';
import '../../setupTests';

it('App renders properly without crashing', () => {
  const wrapper = shallow(<App />);
});