import React, { Component } from 'react';
import { Transcript } from 'transcript-model';
import { EditorState } from "draft-js";
import TranscriptEditor, {
  convertFromTranscript,
  convertToTranscript,
  convertToJSON,
  withTime,
  withWords,
} from '../../src';
import VideoPlayer from './VideoPlayer';

import transcriptJson from '../assets/jeruselam_transcription.json';
import { Col, Row } from "react-bootstrap";
import '../../src/css/TranscriptEditor.css';

class EditorView extends Component {
  constructor(props) {
    super(props);
    const transcriptJson2 = convertToJSON(transcriptJson)
    const transcript = Transcript.fromJSON(transcriptJson2);
    const { editorState, speakers } = convertFromTranscript(transcript);

    this.state = {
      editorState: EditorState.createEmpty(),
      speakers,
      videoSrc: null,
      currentTime: 0,
      showSpeakers: true,
      decorator: 'withTime',
      decorators: {
        withTime: editorStateToBeDecorated =>
          withTime(editorStateToBeDecorated, this.state.currentTime),
        withWords: editorStateToBeDecorated => withWords(editorStateToBeDecorated),
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDecoratorChange = this.handleDecoratorChange.bind(this);
    this.handleShowSpeakersChange = this.handleShowSpeakersChange.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handleLoadVideo = this.handleLoadVideo.bind(this);
    this.loadTranscript = this.loadTranscript.bind(this);
    this.saveTranscript = this.saveTranscript.bind(this);
    this.insertTime = this.insertTime.bind(this);
  }

  componentDidMount() {
    this.editor.focus();
  }

  handleChange({ editorState, speakers }) {
    this.setState({
      editorState,
      speakers,
    });
  }

  handleDecoratorChange({ target: { value } }) {
    this.setState({ decorator: value });
  }

  handleShowSpeakersChange({ target: { checked } }) {
    this.setState({ showSpeakers: checked });
  }

  handleTimeUpdate(time) {
    this.setState({ currentTime: time });
  }

  handleLoadVideo() {
    const file = this.mediaInput.files[0];
    this.mediaInput.value = '';

    const objURL = URL.createObjectURL(file)
    console.log('objURL', objURL)
    this.setState({ videoSrc: objURL })
    return;
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const transcriptJSONString = event.target.result;
      const transcriptJSON = JSON.parse(transcriptJSONString);
      const transcript = Transcript.fromJSON(transcriptJSON);
      const { editorState, speakers } = convertFromTranscript(transcript);

      this.setState({
        editorState,
        speakers,
      });
    };

    fileReader.readAsText(file);
  }

  loadTranscript() {
    this.fileInput.click();
  }

  saveTranscript() {
    const transcript = convertToTranscript(
      this.state.editorState.getCurrentContent(),
      this.state.speakers,
    );

    const blob = new Blob([JSON.stringify(transcript.toJSON(), null, 2)], {
      type: 'application/json;charset=utf-8',
    });

    window.open(URL.createObjectURL(blob));
  }

  insertTime() {
    console.log('insert time is ', this.state.currentTime);
    const editorState = this.state.editorState
    const selectionState = editorState.getSelection();
    const startKey = selectionState.getStartKey();
    const selectedBlock = editorState.getCurrentContent().getBlockForKey(startKey);
    console.log('and selectedBlock ', selectedBlock);

  }

  render() {
    return (
      <Row className="row-container">
        <Col xs={5}>
          <div>
            <VideoPlayer
              src={this.state.videoSrc}
              onTimeUpdate={this.handleTimeUpdate} />
            <div>
              <input
                type="file"
                ref={(c) => { this.mediaInput = c; }}
                onChange={this.handleLoadVideo}
                accept="audio/*, video/*"
              />
              or
                <button
                onClick={this.getURL}
                type="button"
                className="btn btn-primary mr-2 btn-sm"
              >
                Enter URL
                  </button>
              <div className="btn-toolbar mt-2">
                <button
                  onClick={this.loadTranscript}
                  type="button"
                  className="btn btn-primary mr-2 btn-sm"
                >
                  Load transcript
                  </button>

                <button
                  onClick={this.saveTranscript}
                  type="button"
                  className="btn btn-primary mr-2 btn-sm"
                >
                  Save transcript
                  </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={this.insertTime}
                >
                  Insert Time
                  </button>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label col-form-label-sm">Show speakers</label>
              <div className="col-sm-8">
                <input
                  type="checkbox"
                  checked={this.state.showSpeakers}
                  onChange={this.handleShowSpeakersChange}
                />
              </div>
            </div>
          </div>
        </Col>
        <Col xs={7} className="editor-column">
          <TranscriptEditor
            ref={(editor) => { this.editor = editor; }}
            editorState={this.state.editorState}
            speakers={this.state.speakers}
            timestamp={this.state.currentTime}
            onChange={this.handleChange}
            showSpeakers={this.state.showSpeakers}
          />
        </Col>
      </Row>
    );
  }
}

export default EditorView;
