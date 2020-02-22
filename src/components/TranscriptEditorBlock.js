import React from 'react';
import { EditorBlock } from 'draft-js';
import PropTypes from 'prop-types';

const TranscriptEditorBlock = (props) => {
/*   const { contentState } = props;
  const entity = contentState.getEntity(entityKey);
  const titleString = `${entity.data.start.toFixed(2)} - ${entity.data.end.toFixed(2)}`; */
  const characterList = props.block.getCharacterList();
  const contentState = props.contentState;
  const start = contentState.getEntity(characterList.first().entity).data.start
  const end = contentState.getEntity(characterList.last().entity).data.end
  const speakerSection = props.blockProps.showSpeakers ? (
    <div
      className="transcript-editor-speaker"
      contentEditable={false}
      style={{
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      Speaker {props.block.data.get('speaker') + 1} - {start + '-> ' + end}
    </div>
  ) : null;

  return (
    <div className="transcript-editor-block">
      {speakerSection}
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
