import { supabase } from './supabaseClient';

// Fonction pour charger les articles depuis Supabase
export const loadArticles = async () => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors du chargement des articles:', error);
    return [];
  }
};

// Fonction pour sauvegarder les articles dans Supabase
export const saveArticles = async (articles) => {
  try {
    const { error } = await supabase
      .from('articles')
      .upsert(
        articles.map(article => ({
          ...article,
          updated_at: new Date().toISOString()
        })),
        { onConflict: 'slug' }
      );

    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des articles:', error);
    // Fallback vers localStorage en cas d'erreur
    localStorage.setItem('wiki_articles', JSON.stringify(articles));
  }
};

// Fonction pour mettre à jour un article spécifique
export const updateArticle = async (articles, slug, updatedArticle) => {
  try {
    const { error } = await supabase
      .from('articles')
      .upsert({
        ...updatedArticle,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

    // Mettre à jour la liste locale des articles
    const updatedArticles = articles.map(article => 
      article.slug === slug ? { ...article, ...updatedArticle } : article
    );

    return updatedArticles;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    // Fallback vers la version locale en cas d'erreur
    const updatedArticles = articles.map(article => 
      article.slug === slug ? { ...article, ...updatedArticle } : article
    );
    localStorage.setItem('wiki_articles', JSON.stringify(updatedArticles));
    return updatedArticles;
  }
};
