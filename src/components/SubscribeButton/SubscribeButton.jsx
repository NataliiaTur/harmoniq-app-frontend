import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/authSlice/authSelectors';
import { addFollower, deleteFollower } from '../../redux/usersSlice/usersOperations';
import { analytics } from '../../utils/analytics.js';
import s from './SubscribeButton.module.css';

const SubscribeButton = ({ authorId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const [isFollowingLocal, setIsFollowingLocal] = useState(false);

  useEffect(() => {
    setIsFollowingLocal(currentUser?.following.includes(authorId));
  }, [currentUser?.following, authorId]);

  const handleClickSubscribe = async () => {
    console.log('About to track follow for:', authorId);
    setIsFollowingLocal(true); 
    await dispatch(addFollower(authorId));
    analytics.trackFollow(authorId);
    console.log('Follow tracked');
  };

  const handleClickUnsubscribe = async () => {
    setIsFollowingLocal(false);
    await dispatch(deleteFollower(authorId));
    analytics.trackUnfollow(authorId);
  };

  return isFollowingLocal ? (
    <button className={s.btnSubscribe} onClick={handleClickUnsubscribe}>
      Unsubscribe
    </button>
  ) : (
    <button className={s.btnSubscribe} onClick={handleClickSubscribe}>
      Subscribe
    </button>
  );
};

export default SubscribeButton;
