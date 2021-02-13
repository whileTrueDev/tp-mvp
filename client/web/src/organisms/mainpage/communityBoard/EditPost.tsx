import { TextField } from '@material-ui/core';
import React from 'react';
import SunEditor from 'suneditor/src/lib/core';
import EditorContainer from './sub/EditorContainer';

export default function EditPost(
  {
    editorRefFn, editor, postId, initialContent,
  }: {
    editorRefFn?: ((node: any) => void) | undefined;
    editor?: SunEditor | undefined;
    postId: number;
    initialContent: string;
  },
): JSX.Element {
  return (
    <>
      <TextField
        variant="outlined"
        name="title"
        label="제목"
      />
      <EditorContainer
        initialContent={initialContent}
        postId={postId}
        editorRefFn={editorRefFn}
        editor={editor}
      />
    </>
  );
}
