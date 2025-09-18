'use client';

import React, { FC, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Alignment,
  Autoformat,
  Bold,
  Italic,
  Underline,
  BlockQuote,
  Base64UploadAdapter,
  CloudServices,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  PictureEditing,
  Indent,
  IndentBlock,
  Link,
  List,
  Font,
  Mention,
  Paragraph,
  PasteFromOffice,
  Table,
  TableColumnResize,
  TableToolbar,
  TextTransformation,
  SourceEditing,
  Code,
  RemoveFormat,
  Strikethrough,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

interface CustomCKEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  className?: string;
}

const CustomCKEditor: FC<CustomCKEditorProps> = ({ value = '', onChange, className }) => {
  useEffect(() => {
    // keep a light debug log when the incoming value changes
    // (helps when debugging hydration / controlled updates)
    // eslint-disable-next-line no-console
    console.log('CustomCKEditor value updated:', value?.slice(0, 120));
  }, [value]);

  return (
    <div className={className}>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
        licenseKey: 'GPL',
        plugins: [
          Autoformat,
          Alignment,
          BlockQuote,
          Bold,
          CloudServices,
          Code,
          Essentials,
          Heading,
          Image,
          ImageCaption,
          ImageResize,
          ImageStyle,
          ImageToolbar,
          ImageUpload,
          Base64UploadAdapter,
          Indent,
          IndentBlock,
          Italic,
          Link,
          Font,
          List,
          Mention,
          Paragraph,
          PasteFromOffice,
          PictureEditing,
          Table,
          TableColumnResize,
          TableToolbar,
          TextTransformation,
          Underline,
          SourceEditing,
          RemoveFormat,
          Strikethrough
        ],
      toolbar: {
        items: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          '|',
          'underline',
          'strikethrough',
          '|',
          'link',
          'uploadImage',
          'insertTable',
          'blockQuote',
          'code',
          '|',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'bulletedList',
          'numberedList',
          '|', 'alignment',
          '|',
          'outdent',
          'indent',
          'sourceEditing',
          '|', 'removeFormat',
        ],
        shouldNotGroupWhenFull: true,
      },

      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
          { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
          { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
          { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
          { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
        ],
      },

        image: {
          resizeOptions: [
            { name: 'resizeImage:original', label: 'Default image width', value: null },
            { name: 'resizeImage:50', label: '50% page width', value: '50' },
            { name: 'resizeImage:75', label: '75% page width', value: '75' },
          ],
          toolbar: [
            'imageTextAlternative',
            'toggleImageCaption',
            '|',
            'imageStyle:inline',
            'imageStyle:wrapText',
            'imageStyle:breakText',
            '|',
            'resizeImage',
          ],
           
        },

        
        
        link: { addTargetToExternalLinks: true, defaultProtocol: 'https://' },

        table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'] },
      }}
        onChange={(_event: any, editor: any) => {
          const data = editor.getData();
          if (onChange) onChange(data);
        }}
      onFocus={() => console.log('Editor focused')}
      onBlur={() => console.log('Editor blurred')}
      
      />
    </div>
  );
};

export default CustomCKEditor;
