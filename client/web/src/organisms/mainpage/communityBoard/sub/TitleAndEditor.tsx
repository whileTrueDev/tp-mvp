import React from 'react';
import SunEditor from 'suneditor/src/lib/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import EditorContainer from './EditorContainer';
import InputField from './InputField';

const useStyles = makeStyles((theme: Theme) => createStyles({
  editorContainer: {
    marginBottom: theme.spacing(2),
  },
}));

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
  const classes = useStyles();
  return (
    <>
      <InputField
        name="title"
        label="제목"
        inputRef={titleRef}
        maxLength={20}
        helperText="* 제목은 최대 20글자까지 가능합니다"
        placeholder="제목을 입력하세요"
      />
      <EditorContainer
        editorRefFn={editorRefFn}
        editor={editor}
        initialContent={initialContent}
        className={classes.editorContainer}
      />
    </>
  );
}
