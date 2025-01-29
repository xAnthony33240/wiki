import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TINYMCE_API_KEY = '64nwgohgxqpf7d8xyk54ulrf7w068i1keh4n0xzda18trp2r';

export function AddCategoryModal({ isOpen, onClose, onAdd, type }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setIcon('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    if (type === 'category' && !icon.trim()) {
      setError('L\'icône est requise pour une catégorie');
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (type === 'category') {
      onAdd({
        title: title.trim(),
        icon: icon.trim(),
        items: []
      });
    } else {
      onAdd({
        title: title.trim(),
        content: content,
        slug
      });
    }

    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{type === 'category' ? 'Nouvelle Catégorie' : 'Nouvelle Page'}</h2>
              <button onClick={onClose} className="close-button" aria-label="Fermer">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Titre</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entrez un titre"
                  className="form-input"
                />
              </div>
              {type === 'category' ? (
                <div className="form-group">
                  <label htmlFor="icon">Icône</label>
                  <input
                    type="text"
                    id="icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Exemple: 🌐"
                    className="form-input"
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="content">Contenu</label>
                  <Editor
                    apiKey={TINYMCE_API_KEY}
                    value={content}
                    onEditorChange={(newContent) => setContent(newContent)}
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | image | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      images_upload_handler: async function (blobInfo, progress) {
                        return new Promise((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            resolve(e.target.result);
                          };
                          reader.readAsDataURL(blobInfo.blob());
                        });
                      }
                    }}
                  />
                </div>
              )}
              {error && <div className="error-message">{error}</div>}
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {type === 'category' ? 'Créer la catégorie' : 'Créer la page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
