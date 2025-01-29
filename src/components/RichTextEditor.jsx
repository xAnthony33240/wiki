import { Editor } from '@tinymce/tinymce-react';

export function RichTextEditor({ value, onChange }) {
  return (
    <Editor
      apiKey="64nwgohgxqpf7d8xyk54ulrf7w068i1keh4n0xzda18trp2r"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image media | help',
        content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px }',
        language: 'fr_FR',
        images_upload_handler: function (blobInfo, progress) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blobInfo.blob());
            reader.onload = () => {
              resolve(reader.result);
            };
            reader.onerror = (error) => reject(error);
          });
        }
      }}
    />
  );
}
