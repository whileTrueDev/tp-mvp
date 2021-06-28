import React, {
  useCallback, useRef,
} from 'react';
import 'suneditor/dist/css/suneditor.min.css';
import suneditor from 'suneditor';
import { ko } from 'suneditor/src/lang';
import plugins from 'suneditor/src/plugins';
import SunEditor from 'suneditor/src/lib/core';
import useMediaSize from './useMediaSize';

interface EditorContainerProps {
  style?: React.CSSProperties;
  className?: string;
}
interface useSunEditorReturnType{
  editorRef: React.MutableRefObject<SunEditor | null>,
  EditorContainer: (props: EditorContainerProps) => JSX.Element,
}

/**
 * @description suneditor 인스턴스 생성하기 위한 훅, 에디터 생성시 적용할 옵션도 여기서 적용할 수 있다
 * suneditor-react라는 리액트용 라이브러리가 존재하나 ref 적용안됨, lang옵션 적용 안됨 문제로
 * 그냥 suneditor사용함
 *
 * 
 * @return editorRef 
 * - suneditor객체가 담긴 React.mutableObject
 * - editorRef.current로 core object와 util에 접근할 수 있다
 * - 다음과 같이 사용
 * - editorRef.current.setContents(content) : db에서 가져온 contents를 에디터에 표시할 때
 * - editorRef.current.core.getContents(false) : 에디터에 작성된 html을 가져올 때
 *      
 * @return EditorContainer
 * - suneditor가 마운트된 textarea 컴포넌트
 *  <EditorContainer /> 와 같이 사용함.
 *  에디터 관련 조작은 editorRef.current로 가능
 * */
export default function useSunEditor(): useSunEditorReturnType {
  const editorRef = useRef<SunEditor|null>(null);
  const { isMobile } = useMediaSize();

  const refFn = useCallback((node) => {
    if (node !== null) {
      const buttonList = [
        ['bold', 'underline', 'italic'],
        ['align'],
        ['link', 'image', 'video', 'codeView'],
      ];
      const originButtonList = [
        ['undo', 'redo'],
        ['font', 'fontSize', 'formatBlock'],
        ['paragraphStyle', 'blockquote'],
        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
        ['fontColor', 'hiliteColor', 'textStyle'],
        ['removeFormat'],
        '/', // Line break
        ['outdent', 'indent'],
        ['align', 'horizontalRule', 'list', 'lineHeight'],
        ['table', 'link', 'image', 'video'],
        ['fullScreen', 'showBlocks', 'codeView'],
        ['preview'],
      ];
      const editorInstance = suneditor.create(node, {
        lang: ko,
        plugins,
        buttonList: isMobile ? buttonList : originButtonList,
        showPathLabel: false,
        resizingBar: false,
        imageUploadSizeLimit: 10485760,
        imageWidth: '256',
        imageHeight: '144',
      });
      editorRef.current = editorInstance;
    }
  }, [isMobile]);

  const EditorContainer = ({
    style = { width: '100%', minHeight: '400px' },
    className,
  }: EditorContainerProps): JSX.Element => (
    <div className={className}>
      <textarea ref={refFn} id="suneditor" style={style} />
    </div>
  );
  return {
    editorRef,
    EditorContainer,
  };
}
