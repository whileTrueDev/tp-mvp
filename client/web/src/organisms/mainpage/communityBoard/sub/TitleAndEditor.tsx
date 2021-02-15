import { TextField } from '@material-ui/core';
import React from 'react';
import SunEditor from 'suneditor/src/lib/core';
import EditorContainer from './EditorContainer';

export default function TitleAndEditor(
  {
    titleRef, editorRefFn, editor, initialContent = '',
  }: {
    titleRef? : any;
    editorRefFn: ((node: any) => void);
    editor: SunEditor;
    initialContent? : string;
  },
): JSX.Element {
  return (
    <>
      <TextField
        variant="outlined"
        name="title"
        label="제목"
        inputRef={titleRef}
        inputProps={{ maxLength: 20 }}
      />
      <EditorContainer
        editorRefFn={editorRefFn}
        editor={editor}
        initialContent={initialContent}
      />
    </>
  );
}
