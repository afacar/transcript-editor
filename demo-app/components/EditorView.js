import React, { Component } from 'react';
import { Transcript } from 'transcript-model';

import TranscriptEditor, {
  convertFromTranscript,
  convertToTranscript,
  convertToJSON,
  withTime,
  withWords,
} from '../../src';
import VideoPlayer from './VideoPlayer';

import transcriptJson from '../assets/jeruselam_transcription.json';
import video from '../assets/jeruselam.mp4';

import '../../src/css/TranscriptEditor.css';

class EditorView extends Component {
  constructor(props) {
    super(props);
    const transcriptJson2 = convertToJSON(transcriptJson)
    const transcript = Transcript.fromJSON(transcriptJson2);
    const { editorState, speakers } = convertFromTranscript(transcript);

    this.state = {
      editorState,
      speakers,
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
    this.handleLoadTranscript = this.handleLoadTranscript.bind(this);
    this.loadTranscript = this.loadTranscript.bind(this);
    this.saveTranscript = this.saveTranscript.bind(this);
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

  handleLoadTranscript() {
    const file = this.fileInput.files[0];
    this.fileInput.value = '';

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

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-5">
            <div>
              <VideoPlayer 
              //thumbnail TODO Put Thumbnail of video, undefined for audio 
              src={video} onTimeUpdate={this.handleTimeUpdate} />
              <div>
                <input
                  type="file"
                  ref={(c) => {
                    this.fileInput = c;
                  }}
                  style={{ display: 'none' }}
                  onChange={this.handleLoadTranscript}
                />
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
                    onClick={() => {
                      this.editor.focus();
                    }}
                  >
                    Focus editor
                  </button>
                </div>
              </div>
              <div className="form-group mt-3 row">
                <label className="col-sm-4 col-form-label col-form-label-sm">Decorator</label>
                <div className="col-sm-8">
                  <select
                    value={this.state.decorator}
                    onChange={this.handleDecoratorChange}
                    className="form-control form-control-sm"
                    id="decoratorInput"
                  >
                    {Object.keys(this.state.decorators).map(decorator => (
                      <option value={decorator} key={decorator}>
                        {decorator}
                      </option>
                    ))}
                  </select>
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
          </div>
          <div className="col-7">
            <TranscriptEditor
              ref={(editor) => {
                this.editor = editor;
              }}
              editorState={this.state.decorators[this.state.decorator](this.state.editorState)}
              speakers={this.state.speakers}
              onChange={this.handleChange}
              showSpeakers={this.state.showSpeakers}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default EditorView;
