import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import s from './ButtonAddToBookmarks.module.css';
import { selectSavedArticles, selectSaveLoading } from '../../redux/usersSlice/usersSelectors.js';
import { removeSavedArticle, saveArticle } from '../../redux/usersSlice/usersOperations.js';
import { Loader } from '../Loader/Loader.jsx';
import sprite from '../../assets/icons/sprite.svg';
import { selectIsLoggedIn, selectUser } from '../../redux/authSlice/authSelectors.js';
import ModalError from '../ModalErrorSave/ModalErrorSave.jsx';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { toast } from 'react-toastify';
// ⭐ ДОДАЙТЕ ЦЕЙ ІМПОРТ
import { analytics } from '../../utils/analytics';

const ButtonAddToBookmarks = ({
  articleId,
  ownerId,
  className,
  addBtnArticlePageActive,
  isArticlePage,
  userId,
}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const savedArticles = useSelector(selectSavedArticles);
  const isSaved = savedArticles.includes(articleId);
  const loading = useSelector(selectSaveLoading(articleId));
  const user = useSelector(selectUser);
  const isOwner = (user && ownerId === user._id) || ownerId === userId;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
      return;
    }

    try {
      if (isSaved) {
        await dispatch(removeSavedArticle(articleId)).unwrap();
        // ⭐ ТРЕКІНГ ВИДАЛЕННЯ З ОБРАНИХ
        analytics.trackRemoveFromFavorites(articleId, ownerId);
      } else {
        await dispatch(saveArticle(articleId)).unwrap();
        // ⭐ ТРЕКІНГ ДОДАВАННЯ В ОБРАНІ
        analytics.trackAddToFavorites(articleId, ownerId);
      }
    } catch (error) {
      toast.error('Failed to update saved articles. Please try again.');
      console.error('Article processing error:', error);
    }
  };

  return (
    <div className={className}>
      {isOwner ? (
        <Link to={`/create/${articleId}`} className={s.addBtn}>
          <svg className={s.editIcon} width="24px" height="24px">
            <use href={`${sprite}#icon-edit-article`} />
          </svg>
        </Link>
      ) : (
        <button
          className={clsx(s.addBtn, {
            [s.addBtnActive]: isSaved,
            [addBtnArticlePageActive]: isSaved,
          })}
          type="button"
          onClick={handleClick}
          disabled={loading}
        >
          {isArticlePage && <p className={s.addBtnText}>{isSaved ? 'Remove' : 'Save'}</p>}
          {loading ? (
            <Loader className={s.loader} size="24" />
          ) : (
            <svg className={s.addIcon} width="24px" height="24px">
              <use href={`${sprite}#icon-bookmark-alternative`} />
            </svg>
          )}
        </button>
      )}

      <ModalError isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ButtonAddToBookmarks;