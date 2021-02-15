import React, { useEffect } from 'react';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditor from 'suneditor/src/lib/core';

function EditorContainer({
  initialContent = '',
  editorRefFn,
  editor,
  style = { width: '100%', minHeight: '300px' },
}: {
  initialContent?: string;
  editorRefFn: (node: any) => void,
  editor: SunEditor,
  style?: React.CSSProperties,
}): JSX.Element {
  // editor가 변경될때만 실행 
  useEffect(() => () => {
    if (editor) {
      editor.destroy();
    }
  }, [editor]);

  // initialContent 변경될 때 실행
  useEffect(() => {
    if (!editor) return;
    editor.setContents(initialContent);
  }, [initialContent, editor]);

  return (
    <div>
      <textarea
        id="sun-editor"
        style={style}
        ref={editorRefFn}
      />
    </div>
  );
}

export default EditorContainer;
