import s from './ArticlePage.module.css';
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticleById, fetchAllArticles } from '../../redux/articlesSlice/articlesOperation';
import { LoaderPage } from '../../components/Loader/LoaderPage/LoaderPage';
import { Container } from '../../components/Container/Container';
import DOMPurify from 'dompurify';
import {
  selectCurrentArticle,
  selectError,
  selectIsLoading,
  selectArticles,
} from '../../redux/articlesSlice/articlesSelectors';
import { RecommendedArticles } from '../../components/RecommendedArticles/RecommendedArticles';

const ArticlePage = () => {
  const { articleId } = useParams();
  const dispatch = useDispatch();

  const location = useLocation();

  const currentArticle = useSelector(selectCurrentArticle);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const recommended = useSelector(selectArticles);

  const from = typeof location.state?.from === 'string' ? location.state.from : '/articles';

  const isHTML = (str) => /<\/?[a-z][\s\S]*>/i.test(str);
  const article = currentArticle?.data || currentArticle;

  useEffect(() => {
    dispatch(fetchAllArticles({ filter: 'popular', limit: 3 }));
    dispatch(fetchArticleById(articleId));
  }, [dispatch, articleId]);

  // ⭐ ДОДАЙТЕ ЦЕЙ useEffect - трекінг перегляду статті
  useEffect(() => {
    if (article && article._id && article.ownerId) {
      analytics.trackArticleView(article._id, article.ownerId);
    }
  }, [article]); // трекаємо коли стаття завантажилась

  if (isLoading) return <LoaderPage />;
  if (error) return <p>Помилка: {error}</p>;
  if (!article) return <p>Статтю не знайдено</p>;

  return (
    <article className={s.articlePage}>
      <Container>
        <h2 className={s.articleTitle}>{article.title}</h2>
        <div className={s.articleImgWrapper}>
          {article.img && <img src={article.img} alt={article.title} className={s.articleImg} />}
        </div>
        <div className={s.content}>
          <div className={s.articleText}>
            {isHTML(article.article) ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(article.article),
                }}
              />
            ) : (
              article.article.split('\n').map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
            )}
          </div>

          <RecommendedArticles
            currentArticle={currentArticle}
            recommended={recommended}
            from={from}
          />
        </div>
      </Container>
    </article>
  );
};

export default ArticlePage;
