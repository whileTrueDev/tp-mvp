import React, { memo } from 'react';
import SunEditor from 'suneditor/src/lib/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import EditorContainer from './sub/EditorContainer';
import InputField from './sub/InputField';

const useStyles = makeStyles((theme: Theme) => createStyles({
  editorContainer: {
    marginBottom: theme.spacing(2),
  },
}));

function TitleAndEditor(
  {
    editorRefFn, editor, initialContent = '',
    titleValue, onTitleChange,
  }: {
    editorRefFn: ((node: any) => void);
    editor: SunEditor|null;
    initialContent? : string;
    titleValue: string;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  },
): JSX.Element {
  const classes = useStyles();
  return (
    <>
      <InputField
        name="title"
        label="제목"
        maxLength={20}
        helperText="* 제목은 최대 20글자까지 가능합니다"
        placeholder="제목을 입력하세요"
        value={titleValue}
        onChange={onTitleChange}
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

export default memo(TitleAndEditor);
