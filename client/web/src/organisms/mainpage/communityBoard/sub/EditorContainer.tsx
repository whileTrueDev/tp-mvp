import React, { useEffect } from 'react';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditor from 'suneditor/src/lib/core';

export default function EditorContainer({
  initialContent = 'sdfasd',
  setContent,
  editorRefFn,
  editor,
  style = { width: '100%', minHeight: '300px' },
  postId,
}: {
  initialContent?: string;
  setContent?: React.Dispatch<React.SetStateAction<string>>,
  editorRefFn?: (node: any) => void,
  editor?: SunEditor,
  style?: React.CSSProperties,
  postId? : number
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
    // editor.disabled();
    // editor.toolbar.hide();
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
