import React from 'react';
import 'codemirror/lib/codemirror.css';

import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';

export default function ToastUiEditor(data) {
  const { handleContents } = data;
  const editorRef = React.createRef();

  function handleChange() {
    if (editorRef.current.getInstance().getHtml()) {
      const str = editorRef.current.getInstance().getHtml().toString();
      handleContents(str);
    }
  }

  return (
    <div>
      <Editor
        previewStyle="vertical"
        height="300px"
        initialEditType="wysiwyg"
        placeholder="글쓰기"
        onChange={handleChange}
        ref={editorRef}
      />
      {/* <button onClick={handleClick}>저장</button> */}
    </div>
  );
}
