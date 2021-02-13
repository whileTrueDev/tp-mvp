import React from 'react';
import { TextField } from '@material-ui/core';
import SunEditor from 'suneditor/src/lib/core';
import EditorContainer from './sub/EditorContainer';

export default function WritePost(
  { editorRefFn, editor }: {
    editorRefFn?: ((node: any) => void) | undefined;
    editor?: SunEditor | undefined;
  },
): JSX.Element {
  return (
    <>
      <div>
        <TextField
          variant="outlined"
          label="닉네임"
          name="nickname"
        />
        <TextField
          variant="outlined"
          type="password"
          name="password"
          label="비밀번호"
        />
      </div>

      <TextField
        variant="outlined"
        name="title"
        label="제목"
      />
      <EditorContainer
        editorRefFn={editorRefFn}
        editor={editor}
      />
    </>
  );
}
