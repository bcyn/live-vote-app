import React from 'react';
import ReactDOM from 'react-dom';
import Voting from './components/Voting';

const pair = ['Trainspotting', '14 Days Later'];

ReactDOM.render(
  <Voting pair={pair} />,
  document.getElementById('app')
)