import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from './CkEditor';

export default function PrettyEditor() {
  return (
    <div className="App">
      <h2>Using CKEditor 5 build in React</h2>
      <CKEditor
        editor={ClassicEditor}
        data="<p>Hello from CKEditor 5!</p>"
        type="inline"
        // onInit={(editor) => {
        //   editor.plugins.get('FileRepository').createUploadAdapter = function (loader) {
        //     return new Base64UploadAdapter(loader);
        //   };
        // }}
        config={{
          // ckfinder: {
          // // Upload the images to the server using the CKFinder QuickUpload command.
          //   uploadUrl: '/feature-suggestion',
          // },
          // fileUploadUrl = '/feature-suggestion/write',
        }}
        // onInit={(editor) => {
        //   // You can store the "editor" and use when it is needed.
        //   // console.log('Editor is ready to use!', editor);
        // }}
        // onReady={(editor) => {
        //   // You can store the "editor" and use when it is needed.
        //   // console.log('Editor is ready to use!', editor);
        // }}
        // onChange={(event, editor) => {
        //   // const data = editor.getData();
        //   // console.log({ event, editor, data });
        // }}
        // onBlur={(event, editor) => {
        //   // console.log('Blur.', editor);
        // }}
        // onFocus={(event, editor) => {
        //   // console.log('Focus.', editor);
        // }}
      />
    </div>
  );
}
