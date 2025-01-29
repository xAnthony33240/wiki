import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import { SearchBar } from './components/SearchBar'
import { ArticlePage } from './pages/ArticlePage'
import { AddCategoryModal } from './components/AddCategoryModal'
import { useTheme } from './hooks/useTheme'
import { loadArticles, saveArticles } from './services/articleService'
import './App.css'

function Header({ onSearch }) {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <header>
      <div className="header-content">
        <Link to="/" className="home-link">
          <h1>Wiki Entreprise</h1>
        </Link>
        <SearchBar onSearch={onSearch} />
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}

function BackButton() {
  return (
    <Link to="/" className="back-button">
      Retour à l'accueil
    </Link>
  );
}

function CategoryCard({ category, onAddPage }) {
  return (
    <div className="category-card">
      <div className="category-header">
        <div className="category-title">
          <span className="category-icon">{category.icon}</span>
          {category.title}
        </div>
        <button 
          className="add-page-button"
          onClick={() => onAddPage(category)}
          aria-label="Ajouter une page"
        >
          +
        </button>
      </div>
      <ul className="category-items">
        {category.items.map((item) => (
          <li key={item.slug} className="category-item">
            <Link to={`/article/${item.slug}`}>
              <span>•</span>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function HomePage({ categories, onAddCategory, onAddPage, searchResults }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('category')
  const [selectedCategory, setSelectedCategory] = useState(null)

  const handleAddClick = (category = null) => {
    if (category) {
      setModalType('page')
      setSelectedCategory(category)
    } else {
      setModalType('category')
    }
    setModalOpen(true)
  }

  const handleAdd = (item) => {
    if (modalType === 'category') {
      onAddCategory(item)
    } else {
      onAddPage(selectedCategory, item)
    }
    setModalOpen(false)
  }

  return (
    <div className="content-wrapper">
      <main>
        <h1 className="main-title">Base de Connaissances Entreprise</h1>
        <p className="main-description">
          Accédez à toutes les ressources, guides et documentation dont vous avez
          besoin pour exceller dans votre travail.
        </p>

        <div className="categories-section">
          <div className="section-header">
            <h2 className="section-title">Catégories</h2>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard
                key={category.title}
                category={category}
                onAddPage={() => handleAddClick(category)}
              />
            ))}
          </div>
        </div>

        <button 
          className="add-category-button"
          onClick={() => handleAddClick()}
          aria-label="Ajouter une catégorie"
        >
          +
        </button>

        <AddCategoryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={handleAdd}
          type={modalType}
        />
      </main>
    </div>
  )
}

function App() {
  const { isDark, toggleTheme } = useTheme();
  const [categories, setCategories] = useState([
    {
      title: 'Domaines',
      icon: '🌐',
      items: [
        { 
          title: 'Guide Complet de Configuration DNS', 
          slug: 'guide-dns',
          content: `
# Guide Complet de Configuration DNS

La configuration DNS est une partie essentielle de la gestion des domaines. Voici les étapes principales :

## Points Clés

- Configuration des enregistrements A
- Configuration des enregistrements MX
- Gestion des sous-domaines
- Sécurité DNS

## Bonnes Pratiques

1. Toujours faire une sauvegarde avant les modifications
2. Tester dans un environnement de staging
3. Documenter tous les changements
4. Vérifier la propagation DNS

## Outils Recommandés

- dig
- nslookup
- DNS Checker
- Cloudflare DNS Manager
          `
        },
        { 
          title: 'Configuration SSL/TLS', 
          slug: 'config-ssl-tls',
          content: `
# Configuration SSL/TLS

La sécurisation de vos connexions est cruciale. Voici comment configurer SSL/TLS correctement.

## Étapes de Configuration

1. Obtenir un certificat SSL
2. Installer le certificat
3. Configurer le serveur web
4. Tester la configuration

## Meilleures Pratiques

- Utiliser TLS 1.3
- Renouveler les certificats à temps
- Configurer HSTS
- Tester régulièrement la sécurité
          `
        }
      ]
    },
    {
      title: 'Procédures Internes',
      icon: '📝',
      items: [
        { 
          title: "Processus d'Onboarding des Nouveaux Employés", 
          slug: 'onboarding',
          content: `
# Processus d'Onboarding des Nouveaux Employés

L'intégration des nouveaux employés est cruciale pour leur succès. Voici les étapes à suivre :

## Étapes d'Onboarding

1. Préparation avant l'arrivée
2. Accueil et présentation
3. Formation et accompagnement
4. Suivi et évaluation

## Meilleures Pratiques

- Créer un plan d'onboarding personnalisé
- Fournir des ressources et des outils nécessaires
- Encourager la communication ouverte
- Évaluer et ajuster le processus
          `
        },
        { 
          title: 'Meilleures Pratiques de Sécurité', 
          slug: 'security-best-practices',
          content: `
# Meilleures Pratiques de Sécurité

La sécurité est une priorité absolue. Voici les meilleures pratiques à suivre :

## Pratiques de Sécurité

- Utiliser des mots de passe forts
- Activer l'authentification à deux facteurs
- Mettre à jour régulièrement les logiciels
- Faire des sauvegardes régulières
          `
        }
      ]
    },
    {
      title: 'Formation Produit',
      icon: '📚',
      items: [
        { 
          title: 'Guide Utilisateur - Fonctionnalités de Base', 
          slug: 'user-guide',
          content: `
# Guide Utilisateur - Fonctionnalités de Base

Ce guide vous aidera à comprendre les fonctionnalités de base de notre produit.

## Fonctionnalités de Base

- Navigation dans l'interface
- Gestion des utilisateurs
- Configuration des paramètres
- Utilisation des outils

## Meilleures Pratiques

- Lire attentivement la documentation
- Explorer les fonctionnalités
- Demander de l'aide si nécessaire
- Partager vos connaissances
          `
        },
        { 
          title: 'FAQ - Questions Fréquentes', 
          slug: 'faq',
          content: `
# FAQ - Questions Fréquentes

Voici les réponses aux questions les plus fréquentes.

## Questions Fréquentes

- Qu'est-ce que notre produit ?
- Comment s'inscrire ?
- Comment se connecter ?
- Comment obtenir de l'aide ?

## Meilleures Pratiques

- Lire attentivement les questions et réponses
- Rechercher des informations supplémentaires si nécessaire
- Contacter le support si vous avez des questions
- Partager vos connaissances
          `
        }
      ]
    },
    {
      title: 'Technologies',
      icon: '💻',
      items: [
        { 
          title: 'Guide Frontend React', 
          slug: 'react-guide',
          content: `
# Guide Frontend React

Ce guide vous aidera à comprendre les bases de React.

## Bases de React

- Composants
- États
- Props
- Hooks

## Meilleures Pratiques

- Lire attentivement la documentation
- Explorer les fonctionnalités
- Demander de l'aide si nécessaire
- Partager vos connaissances
          `
        },
        { 
          title: 'Déploiement avec Docker', 
          slug: 'docker-deploy',
          content: `
# Déploiement avec Docker

Ce guide vous aidera à comprendre comment déployer votre application avec Docker.

## Étapes de Déploiement

1. Créer un Dockerfile
2. Construire l'image
3. Déployer l'image
4. Configurer les services

## Meilleures Pratiques

- Lire attentivement la documentation
- Explorer les fonctionnalités
- Demander de l'aide si nécessaire
- Partager vos connaissances
          `
        }
      ]
    }
  ])

  const handleSearch = (query) => {
    if (!query.trim()) {
      return [];
    }

    const results = categories.flatMap(category => 
      category.items.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
        const contentMatch = item.content && item.content.toLowerCase().includes(query.toLowerCase());
        return titleMatch || contentMatch;
      })
    );

    return results;
  };

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const handleAddPage = (category, newPage) => {
    setCategories(categories.map(cat => 
      cat.title === category.title
        ? { ...cat, items: [...cat.items, newPage] }
        : cat
    ));
  };

  const handleUpdateArticle = (updatedArticles) => {
    const newCategories = categories.map(category => ({
      ...category,
      items: category.items.map(item => {
        const updatedArticle = updatedArticles.find(a => a.slug === item.slug);
        return updatedArticle || item;
      })
    }));
    setCategories(newCategories);
    saveArticles(updatedArticles);
  };

  const allArticles = categories.flatMap(category => category.items);

  useEffect(() => {
    const savedArticles = loadArticles();
    if (savedArticles.length > 0) {
      const updatedCategories = categories.map(category => ({
        ...category,
        items: category.items.map(item => {
          const savedArticle = savedArticles.find(a => a.slug === item.slug);
          return savedArticle ? savedArticle : item;
        })
      }));
      setCategories(updatedCategories);
    }
  }, []);

  return (
    <Router>
      <div className="wiki-container" data-theme={isDark ? 'dark' : 'light'}>
        <Header onSearch={handleSearch} />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={
              <HomePage 
                categories={categories}
                onAddCategory={handleAddCategory}
                onAddPage={handleAddPage}
                searchResults={[]}
              />
            } />
            <Route path="/article/:slug" element={
              <div className="article-page">
                <div className="article-navigation">
                  <BackButton />
                  <ArticlePage 
                    articles={allArticles}
                    onArticlesUpdate={handleUpdateArticle}
                  />
                </div>
              </div>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App
