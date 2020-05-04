import React from 'react'
import Link from 'next/link'
import { createShallow } from '@material-ui/core/test-utils'
import MCard from '@material-ui/core/Card'

import { Card } from './Card'

describe('<Card />', () => {
  const shallow = createShallow()

  it('render <Card /> component', () => {
    const wrapper = shallow(<Card title="test title" />)
    expect(wrapper.exists(Link))
    expect(wrapper.exists(MCard))
    expect(wrapper.find(MCard).text()).toEqual('test title')
  })
})
