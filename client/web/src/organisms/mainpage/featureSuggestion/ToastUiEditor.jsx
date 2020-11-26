import React from 'react';
import 'codemirror/lib/codemirror.css';

import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';

export default function ToastUiEditor(data) {
  const {
    state, previousContents, handleContents,
  } = data;
  const editorRef = React.createRef();

  function handleFocus() {
    const str = editorRef.current.getInstance().getHtml();
    handleContents(str);
  }

  React.useEffect(() => {
    if (previousContents !== '') {
    //  console.log(previousContents);
      // console.log('previous content exist ? :', previousContents);
    }
  }, [previousContents]);

  return (
    <div>
      {(previousContents && state) ? (
        <Editor
          previewStyle="vertical"
          height="500px"
          initialEditType="wysiwyg"
          initialValue={previousContents}
          onBlur={handleFocus}
          ref={editorRef}
        />
      ) : (
        <div>
          <Editor
            previewStyle="vertical"
            height="500px"
            initialEditType="wysiwyg"
            initialValue=""
            onBlur={handleFocus}
            ref={editorRef}
          />
        </div>
      )}
    </div>
  );
}
