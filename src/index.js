import TranscriptEditor from './components/TranscriptEditor';
import TranscriptEditorBlock from './components/TranscriptEditorBlock';
import TranscriptEditorWord from './components/TranscriptEditorWord';
import TranscriptEditorSpace from './components/TranscriptEditorSpace';
import { TRANSCRIPT_WORD, TRANSCRIPT_SPACE } from './helpers/TranscriptEntities';
import convertFromTranscript from './helpers/convertFromTranscript';
import convertToTranscript from './helpers/convertToTranscript';
import convertToJSON from './helpers/convertToJSON';
import { withWords, withTime } from './helpers/decorators';

export default TranscriptEditor;
export {
  TranscriptEditorBlock,
  TranscriptEditorWord,
  TranscriptEditorSpace,
  TRANSCRIPT_WORD,
  TRANSCRIPT_SPACE,
  convertFromTranscript,
  convertToTranscript,
  convertToJSON,
  withWords,
  withTime,
};
