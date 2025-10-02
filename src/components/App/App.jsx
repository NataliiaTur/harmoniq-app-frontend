import 'react-toastify/dist/ReactToastify.css';
import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { PrivateRoute } from './PrivateRoute.jsx';
import { RestrictedRoute } from './RestrictedRoute.jsx';

import { Layout } from '../Loyout/Loyout.jsx';
import { ToastContainer } from 'react-toastify';
import { HomePage } from '../../pages/HomePage/HomePage.jsx';
import { ScrollToTop } from '../ScrollToTop/ScrollToTop.jsx';

import ErrorPage from '../../pages/ErrorPage/ErrorPage';
import spinner from '../../assets/animations/spinner.webp';

const RegisterPage = lazy(() => import('../../pages/RegisterPage/RegisterPage'));
const LoginPage = lazy(() => import('../../pages/LoginPage/LoginPage'));
const UploadPhotoPage = lazy(() => import('../../pages/UploadPhotoPage/UploadPhotoPage'));
const ArticlesPage = lazy(() => import('../../pages/ArticlesPage/ArticlesPage'));
const ArticlePage = lazy(() => import('../../pages/ArticlePage/ArticlePage'));
const AuthorsPage = lazy(() => import('../../pages/AuthorsPage/AuthorsPage.jsx'));
const AuthorProfilePage = lazy(() => import('../../pages/AuthorProfilePage/AuthorProfilePage.jsx'));
const CreateArticlePage = lazy(() => import('../../pages/CreateArticlePage/CreateArticlePage.jsx'));
const AnalyticsPage = lazy(() => import('../../pages/AnalyticsPage/AnalyticsPage.jsx'));

import { LoaderPage } from '../Loader/LoaderPage/LoaderPage.jsx';
import { refreshThunk } from '../../redux/authSlice/authOperations.js';
import { selectUser } from '../../redux/authSlice/authSelectors.js';
import { selectSavedArticles } from '../../redux/usersSlice/usersSelectors.js';
import { setSavedArticles } from '../../redux/usersSlice/usersSlice.js';
import { useNavigate } from 'react-router-dom';
import { setNavigator } from '../../utils/navigateHelper.js';

// ⭐ ДОДАЙТЕ ЦЕЙ ІМПОРТ
import { analytics } from '../../utils/analytics.js';

export const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const savedArticles = useSelector(selectSavedArticles);
  const navigate = useNavigate();
  const location = useLocation(); // ⭐ ДОДАЙТЕ ЦЕ

  useEffect(() => {
    if (user?.savedArticles?.length > 0 && savedArticles.length === 0) {
      dispatch(setSavedArticles(user.savedArticles));
    }
  }, [user?.savedArticles, savedArticles.length, dispatch]);

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  // ⭐ ДОДАЙТЕ ЦЕЙ useEffect - ініціалізація аналітики
  useEffect(() => {
    analytics.init();
  }, []);

  // ⭐ ДОДАЙТЕ ЦЕЙ useEffect - трекінг переходів між сторінками
  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Suspense fallback={<LoaderPage />}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />

            <Route
              path="register"
              element={<RestrictedRoute redirectTo="/" component={<RegisterPage />} />}
            />
            <Route
              path="upload-photo"
              element={<RestrictedRoute redirectTo="/" component={<UploadPhotoPage />} />}
            />
            <Route
              path="login"
              element={<RestrictedRoute redirectTo="/" component={<LoginPage />} />}
            />

            <Route path="articles" element={<ArticlesPage />} />
            <Route path="articles/:articleId" element={<ArticlePage />} />

            <Route path="authors" element={<AuthorsPage />} />
            <Route path="authors/:authorId" element={<AuthorProfilePage />} />

            <Route
              path="create"
              element={<PrivateRoute redirectTo="/register" component={<CreateArticlePage />} />}
            />
            <Route
              path="create/:articleId"
              element={<PrivateRoute redirectTo="/register" component={<CreateArticlePage />} />}
            />
            <Route
          path="analytics"
          element={<PrivateRoute redirectTo="/login" component={<AnalyticsPage />} />}
          />
          </Route>
          <Route
            path="*"
            element={
              <ErrorPage
                code={404}
                message="Not found page"
                animation={spinner}
                showBackButton={true}
              />
            }
          />
          <Route
            path="/error"
            element={
              <ErrorPage
                code={500}
                message="Unexpected error"
                animation={spinner}
                showBackButton={true}
              />
            }
          />
        
        </Routes>
      </Suspense>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};
