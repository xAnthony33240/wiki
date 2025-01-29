import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { updateArticle } from '../services/articleService';
import { ImageModal } from '../components/ImageModal';

const articles = {
  'guide-dns': {
    title: 'Guide Complet de Configuration DNS',
    content: `
# Guide de Configuration DNS

## Introduction
Ce guide vous aidera à comprendre et configurer correctement vos enregistrements DNS.

## Les types d'enregistrements DNS
- A Record : Fait correspondre un nom d'hôte à une adresse IPv4
- CNAME : Crée un alias vers un autre nom d'hôte
- MX : Définit les serveurs de messagerie pour un domaine
- TXT : Stocke des informations textuelles dans le DNS

## Étapes de configuration
1. Connectez-vous à votre gestionnaire DNS
2. Sélectionnez votre domaine
3. Ajoutez ou modifiez les enregistrements nécessaires
4. Vérifiez la propagation DNS

## Bonnes pratiques
- Utilisez des TTL appropriés
- Documentez vos modifications
- Faites des sauvegardes
- Testez avant de mettre en production
    `,
    slug: 'guide-dns'
  },
  // Autres articles...
};

const TINYMCE_API_KEY = '64nwgohgxqpf7d8xyk54ulrf7w068i1keh4n0xzda18trp2r';

export function ArticlePage({ articles, onArticlesUpdate }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [article, setArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const currentArticle = articles.find(a => a.slug === slug);
    if (currentArticle) {
      setArticle(currentArticle);
      setTitle(currentArticle.title);
      setContent(currentArticle.content);
    }
  }, [slug, articles]);

  useEffect(() => {
    if (!isEditing && contentRef.current) {
      const images = contentRef.current.getElementsByTagName('img');
      Array.from(images).forEach(img => {
        img.style.cursor = 'pointer';
        img.onclick = () => setSelectedImage({
          src: img.src,
          alt: img.alt || 'Image'
        });
      });
    }
  }, [isEditing, content]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const updatedArticle = {
        ...article,
        title,
        content,
        slug: newSlug,
        lastModified: new Date().toISOString()
      };

      const updatedArticles = await updateArticle(articles, slug, updatedArticle);
      onArticlesUpdate(updatedArticles);
      setIsEditing(false);

      if (newSlug !== slug) {
        navigate(`/article/${newSlug}`);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!article) {
    return <div>Article non trouvé</div>;
  }

  return (
    <div className="article-container">
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="article-title-input"
            placeholder="Titre de l'article"
          />
          <Editor
            apiKey={TINYMCE_API_KEY}
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
            init={{
              height: 500,
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
          <div className="article-actions">
            <button 
              onClick={handleSave} 
              className="save-button"
              disabled={isSaving}
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">
              Annuler
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="article-title">{article.title}</h1>
          <div 
            ref={contentRef}
            className="article-content" 
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
          <button onClick={() => setIsEditing(true)} className="floating-edit-button" aria-label="Modifier l'article">
            ✏️
          </button>
        </>
      )}
      {selectedImage && (
        <ImageModal
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
