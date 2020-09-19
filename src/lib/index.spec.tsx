import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import { configure, shallow } from 'enzyme'
import test from 'ava'

import { Placeholder } from '.'

configure({ adapter: new Adapter() })
test('Placeholder', t => {
	const rendered = shallow(<Placeholder />)
	t.is(rendered.render().text(), 'THIS IS A STARTER. IMPLEMENT SOMETHING.')
})
