import React from 'react';
import 'codemirror/lib/codemirror.css';

import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';

export default function Write2() {
  const editorRef = React.createRef();
  const [, setState] = React.useState();
  function handleClick() {
    setState({
      content: editorRef.current.getInstance().getHtml(),
    });
  }

  return (
    <div>
      <Editor
        previewStyle="vertical"
        height="300px"
        initialEditType="wysiwyg"
        placeholder="글쓰기"
        // onChange={(event, editor) => {
        //   const data = editor.getData();
        //   console.log({ event, editor, data });
        // }}
        ref={editorRef}
      />
      <button onClick={handleClick}>저장</button>
    </div>
  );
}
