import { useState, useCallback } from 'react';
import 'suneditor/dist/css/suneditor.min.css';
import suneditor from 'suneditor';
import { ko } from 'suneditor/src/lang';
import plugins from 'suneditor/src/plugins';
import SunEditor from 'suneditor/src/lib/core';

/**
 * @description suneditor 인스턴스 생성하기 위한 훅, 에디터 생성시 적용할 옵션도 여기서 적용할 수 있다
 * suneditor-react라는 리액트용 라이브러리가 존재하나 ref 적용안됨, lang옵션 적용 안됨 문제로
 * 그냥 suneditor사용함
 * 
 * 리턴값 [refFn, editor]
 * 
 * @return refFn (node) => void 
 * <textarea id="suneditor" ref={refFn}> 과 같이 사용함
 * suneditor가 마운트 될 노드를 전달받아 에디터를 생성하는 함수이다
 * 
 * @return editor : Suneditor
 * suneditor instance로 에디터 관련 여러 메서드 가지고 있다 http://suneditor.com/sample/html/out/document-user.html
 * editor.setContents(contents) -> 에디터 내용 등록
 * editor.core.getContents(false) -> 에디터 내용 html로 가져오기
 */
export default function useSunEditor(): [
  (node: any) => void,
  SunEditor
  ] {
  const [editor, setEditor] = useState<SunEditor>();

  const refFn = useCallback((node) => {
    if (node !== null) {
      const editorInstance = suneditor.create(node, {
        lang: ko,
        plugins,
        buttonList: [
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
        ],
        showPathLabel: false,
      });
      setEditor(editorInstance);
    }
  }, []);

  return [refFn, editor as SunEditor];
}
