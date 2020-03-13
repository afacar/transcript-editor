import React from 'react';
import { EditorBlock } from 'draft-js';
import PropTypes from 'prop-types';

const TranscriptEditorBlock = (props) => {
  console.log('editorblock props', props);
  const characterList = props.block.getCharacterList();
  const contentState = props.contentState;
  //const start = contentState.getEntity(characterList.first().entity).data.start
  //const end = contentState.getEntity(characterList.last().entity).data.end
  const timestamp = props.blockProps.showSpeakers ? (
    <div
      className="transcript-editor-speaker"
      contentEditable={false}
      style={{
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      Time: {props.block.data.get('timestamp')}
    </div>
  ) : null;

  return (
    <div className="transcript-editor-block">
      {timestamp}
      <div className="transcript-editor-text">
        <EditorBlock {...props} />
      </div>
    </div>
  );
};

TranscriptEditorBlock.propTypes = {
  block: PropTypes.node.isRequired,
  blockProps: PropTypes.shape({
    showSpeakers: PropTypes.bool,
  }).isRequired,
};

export default TranscriptEditorBlock;
