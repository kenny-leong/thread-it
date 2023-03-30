import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPostById } from '../../store/post';
import { useModal } from "../../context/Modal";
import DeletePost from '../SubredditDetails/DeletePost';
import EditPost from '../SubredditDetails/EditPost';
import bannerImg from '../../static/placeholder-banner.png';
import { getComments, createComment } from '../../store/comment';
import DeleteComment from './DeleteComment';
import './PostDetails.css'






function PostDetails() {

    const { postId, subredditId } = useParams();
    const dispatch = useDispatch();
    const { setModalContent, closeModal } = useModal();
    const [comment, setComment] = useState("");

    const post = useSelector(state => state.post.postDetails);
    const allSubreddits = useSelector(state => state.subreddit.allSubreddits)
    const allUsers = useSelector(state => state.session.allUsers)
    const sessionUser = useSelector(state => state.session.user)
    const allComments = useSelector(state => state.comment.allComments)


    useEffect(() => {
        dispatch(getPostById(postId))
        dispatch(getComments(postId))
    }, [postId, subredditId]);


    if (!post || !allSubreddits || !allUsers || !allComments) return null;



    const commentArr = Object.values(allComments);

    function getTimeSincePostCreation(createdAt) {
        const postCreatedAt = new Date(createdAt);
        postCreatedAt.setHours(postCreatedAt.getHours() - 4);
        const now = new Date();
        const timeDiffInMs = now.getTime() - postCreatedAt.getTime();

        // Convert time difference from milliseconds to minutes and hours
        const timeDiffInMinutes = Math.floor(timeDiffInMs / 60000);
        const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
        const timeDiffInDays = Math.floor(timeDiffInHours / 24);


        // Get absolute value of timeDiffInHours
        const absTimeDiffInHours = Math.abs(timeDiffInHours);
        const absTimeDiffInDays = Math.abs(timeDiffInDays)

        // Return formatted time string
        if (absTimeDiffInDays >= 1) {
            return `${absTimeDiffInDays} day${absTimeDiffInDays === 1 ? '' : 's'}`;
        } else if (absTimeDiffInHours > 0) {
            return `${absTimeDiffInHours} hour${absTimeDiffInHours === 1 ? '' : 's'}`;
        }

        return `${timeDiffInMinutes} minute${timeDiffInMinutes === 1 ? '' : 's'}`;
    }


    // opens the DeleteComment component
    const openDeleteModal = (comment) => {
        setModalContent(<DeleteComment comment={comment}/>);
    };

    //opens the update post component
    const openEditModal = (post) => {
        setModalContent(<EditPost post={post}/>)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await dispatch(createComment(postId, comment))
        .then(() => {
            setComment('');
            dispatch(getComments(postId));
            closeModal();
        })
    }




    return (
        <div className='post-box component'>
            <div className='vote-bar component'>
                <i class="fa-solid fa-angles-up"></i>
                <span className='total-votes'>{post.upvotes - post.downvotes}</span>
                <i class="fa-solid fa-angles-down"></i>
            </div>
            <div className='post-content-area component'>
                <div className='post-feed-header-info'>
                    <div className='post-header-information'>
                        <Link to={`subreddits/${post.subreddit_id}`}>
                            <span className='subreddit-for-post'>{`r/${allSubreddits[post.subreddit_id].name}`}</span>
                        </Link>
                        <i class="fa-solid fa-circle"></i>
                        <span className='posted-by'>{`Posted by u/${allUsers[post.author_id].username} ${getTimeSincePostCreation(post.created_at)} ago`}</span>
                    </div>
                    {sessionUser && post.author_id === sessionUser.id && (
                        <div className='edit-delete-divs-post'>
                            <div className='edit-post-btn-container' onClick={() => openEditModal(post)}>
                                <span className='edit-delete-post-btn'><i class="fa-solid fa-ellipsis"></i></span>
                            </div>
                            <div className='delete-post-btn-container' onClick={() => openDeleteModal(post.id)}>
                                <span><i class="fa-solid fa-trash-can"></i></span>
                            </div>
                        </div>
                    )}
                </div>
                <Link to={`/subreddits/${post.subreddit_id}/posts/${post.id}`}>
                    <div className='feed-post-title-div'>
                        <span className='feed-post-title'>{post.title}</span>
                    </div>
                    {(post.content) && (
                        <div className='feed-post-text-content'>
                            <span className='post content'>{post.content}</span>
                        </div>
                    )}
                    {(post.image_url) && (
                        <div className='feed-post-div'>
                            <img className='feed-post-img'
                            alt='post-img'
                            src={post.image_url}
                            onError={(e) => {e.target.onerror = null; e.target.src=bannerImg}}
                            />
                        </div>
                    )}
                </Link>
                <div className='input-comment-div'>
                    <textarea
                            value={comment}
                            placeholder='What are your thoughts?'
                            className='sr-textarea-desc popup component'
                            onChange={(e) => setComment(e.target.value)}
                    />
                    <div className='create-comment-btn-div'>
                        <button className='create-comment-btn' onClick={handleSubmit}>Comment</button>
                    </div>
                </div>
                <div className='comment-display'>
                    {commentArr.map(comment => (
                        <div className='comment-box'>
                            <div className='username-comment-div'>
                                <div className='username-and-creation'>
                                    <span className='comment-username'>{`${allUsers[comment.author_id].username}`}</span>
                                    <i class="fa-solid fa-circle"></i>
                                    <span className='created-at-time'>{`${getTimeSincePostCreation(comment.created_at)} ago`}</span>
                                </div>
                                {sessionUser && comment.author_id === sessionUser.id && (
                                <div className='edit-delete-divs-post'>
                                    <div className='edit-post-btn-container' onClick={() => openEditModal(comment)}>
                                        <span className='edit-delete-post-btn'><i class="fa-solid fa-ellipsis"></i></span>
                                    </div>
                                    <div className='delete-post-btn-container' onClick={() => openDeleteModal(comment)}>
                                        <span><i class="fa-solid fa-trash-can"></i></span>
                                    </div>
                                </div>
                                )}
                            </div>
                            <div className='comment-content-div'>
                                <span className='comment-content-span'>{comment.content}</span>
                            </div>
                            <div className='vote-comment-icons'>
                                <i class="fa-solid fa-arrow-up"></i>
                                    <span className='net-votes-comment'>{comment.upvotes - comment.downvotes}</span>
                                <i class="fa-solid fa-arrow-down"></i>
                                <div className='reply-div'>
                                    <i class="fa-regular fa-message"></i>
                                    <span className='reply-comment'>Reply</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )


}



export default PostDetails;
