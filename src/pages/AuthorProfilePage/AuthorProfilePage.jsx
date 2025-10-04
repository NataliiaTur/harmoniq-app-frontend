import s from './AuthorProfilePage.module.css';
import clsx from 'clsx';
import { Loader } from '../../components/Loader/Loader.jsx';
import { Container } from '../../components/Container/Container.jsx';
import { AuthorsList } from '../../components/AuthorList/AuthorList.jsx';
import ArticlesList from '../../components/ArticlesList/ArticlesList.jsx';
import { LoaderPage } from '../../components/Loader/LoaderPage/LoaderPage.jsx';
import { NothingFoundItemsInProfile } from '../../components/NothingFoundItemsInProfile/NothingFoundItemsInProfile.jsx';
import EditProfile from '../../components/EditProfile/EditProfile.jsx';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectProfileUser,
  selectVisibleSavedArticles,
  selectIsLoading,
  selectFollowing,
} from '../../redux/usersSlice/usersSelectors.js';
import { selectUser } from '../../redux/authSlice/authSelectors.js';
import {
  fetchUserById,
  fetchSavedArticles,
  fetchFollowingByUserId,
} from '../../redux/usersSlice/usersOperations.js';
import SubscribeButton from '../../components/SubscribeButton/SubscribeButton.jsx';
import { selectArticlesByOwner } from '../../redux/articlesSlice/articlesSelectors.js';
import { fetchArticlesByOwnerId } from '../../redux/articlesSlice/articlesOperation.js';

const AuthorProfilePage = () => {
  const [activeTab, setActiveTab] = useState('myArticles');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const dispatch = useDispatch();
   const navigate = useNavigate(); // ⭐ ДОДАЙТЕ
  const { authorId } = useParams();

  const profileUser = useSelector(selectProfileUser);
  const currentUser = useSelector(selectUser);
  const myArticles = useSelector(selectArticlesByOwner);
  const savedArticles = useSelector(selectVisibleSavedArticles);
  const following = useSelector(selectFollowing);
  const isLoading = useSelector(selectIsLoading);
  const ownProfile = (profileUser?.id || profileUser?._id) === currentUser?._id;
  const name = profileUser?.name.split(' ');

  let articlesInfoText = '';

  if (activeTab === 'myArticles') {
    articlesInfoText = `${profileUser?.articlesAmount || 0} Articles`;
  } else if (activeTab === 'savedArticles') {
    articlesInfoText = `${savedArticles?.length || 0} saved Articles`;
  } else if (activeTab === 'subscribers') {
    articlesInfoText = `${following?.length || 0} Subscriptions`;
  } else if (activeTab === 'analytics') {
    articlesInfoText = 'View your statistics';
  }

  const handleTabClick = (tab) => {
    if (tab === 'analytics') {
      navigate('/analytics'); 
      return;
    }

    setActiveTab(tab);
    if (tab === 'myArticles' && ownProfile) {
      dispatch(fetchArticlesByOwnerId(authorId));
    } else if (tab === 'myArticles' && !ownProfile) {
      dispatch(fetchArticlesByOwnerId(authorId));
    } else if (tab === 'savedArticles') {
      dispatch(fetchSavedArticles(authorId));
    } else if (tab === 'subscribers') {
      dispatch(fetchFollowingByUserId(authorId));
    }
  };

  const handleClickEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  useEffect(() => {
    if (authorId) {
      const loadInitialData = async () => {
        setIsInitialLoading(true);
        setActiveTab('myArticles');
        await Promise.all([
          dispatch(fetchUserById(authorId)),
          dispatch(fetchArticlesByOwnerId(authorId)),
        ]);
        setIsInitialLoading(false);
      };
      loadInitialData();
    }
  }, [authorId, dispatch]);

  return isInitialLoading ? (
    <LoaderPage />
  ) : (
    <section className={s.profilePage}>
      <Container className={s.container}>
        {ownProfile ? (
          <h2 className={s.title}>My Profile</h2>
        ) : (
          <h2 className={s.title}>Author Profile</h2>
        )}
        <div className={s.header}>
          <img src={profileUser?.avatar} alt="Author Avatar" className={s.avatar} />
          <div className={s.info}>
            <div className={s.infoNameWrapper}>
              <div className={s.nameWrapper}>
                <p className={s.name}>{name?.[0]}</p>
                <p className={s.name}>{name?.[1]}</p>
              </div>
              {!ownProfile ? (
                <p className={s.articles}>{profileUser?.articlesAmount || 0} articles</p>
              ) : (
                <p className={s.articles}>{articlesInfoText}</p>
              )}
            </div>
            {ownProfile ? (
              <button className={s.btnEdit} onClick={handleClickEditProfile}>
                Edit profile
              </button>
            ) : (
              <SubscribeButton authorId={authorId} />
            )}
          </div>
        </div>
        {ownProfile === true && (
          <div className={s.tabs}>
            <button
              className={clsx(s.tabBtn, activeTab === 'myArticles' && s.activeTab)}
              onClick={() => handleTabClick('myArticles')}
            >
              My Articles
            </button>
            <button
              className={clsx(s.tabBtn, activeTab === 'savedArticles' && s.activeTab)}
              onClick={() => handleTabClick('savedArticles')}
            >
              Saved Articles
            </button>
            <button
              className={clsx(s.tabBtn, activeTab === 'subscribers' && s.activeTab)}
              onClick={() => handleTabClick('subscribers')}
            >
              Subscribers
            </button>
            <button 
            className={clsx(s.tabBtn, activeTab === 'analytics' && s.activeTab)}
        onClick={() => handleTabClick('analytics')}
      >
        Analytics
      </button>
          </div>
        )}

        {isLoading ? (
          <div className={s.loaderContainer}>
            <Loader />
          </div>
        ) : (
          <>
            {activeTab === 'myArticles' &&
              (myArticles.length === 0 ? (
                <NothingFoundItemsInProfile
                  description={'No articles yet.'}
                  link={'articles'}
                  linkText={'Go to articles'}
                />
              ) : (
                <ArticlesList articles={myArticles} />
              ))}

            {activeTab === 'savedArticles' &&
              (savedArticles.length === 0 ? (
                <NothingFoundItemsInProfile
                  description={'No saved articles yet.'}
                  link={'articles'}
                  linkText={'Go to articles'}
                />
              ) : (
                <ArticlesList articles={savedArticles} />
              ))}

            {activeTab === 'subscribers' &&
              (following.length === 0 ? (
                <NothingFoundItemsInProfile
                  description="No subscribers yet."
                  link="authors"
                  linkText="Go to authors"
                />
              ) : (
                <AuthorsList authors={following} />
              ))}
          </>
        )}
      </Container>
      {isEditProfileOpen && (
        <EditProfile
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          userInfo={profileUser}
        />
      )}
    </section>
  );
};

export default AuthorProfilePage;
