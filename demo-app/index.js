import React from 'react';
import ReactDOM from 'react-dom';

import EditorView from './components/EditorView';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Container } from 'react-bootstrap';

ReactDOM.render(
  <Container>
    <h1>Transcript Editor</h1>
    <EditorView />
  </Container>,
  document.getElementById('root'),
);
