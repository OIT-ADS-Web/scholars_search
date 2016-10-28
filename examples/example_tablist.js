require('dotenv').config();

import _ from 'lodash'

import { tabList } from '../src/components/TabPicker'


_.each(tabList, function(value, key) {
  console.log(key)
  console.log(value)
})

