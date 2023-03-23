

// ----------------------------------- action creators ----------------------------------------

const loadAllSR = (subreddits) => ({
    type: 'LOAD_SUBREDDITS',
    subreddits
});

const loadSingleSR = (subreddit) => ({
    type: 'LOAD_SINGLE_SR',
    subreddit
});

const loadSubredditPosts = (posts) => ({
    type: 'LOAD_SUBREDDIT_POSTS',
    posts
});

// const addPostToSubreddit = (post) => ({
//     type: 'ADD_POST_TO_SUBREDDIT',
//     post
// });

const addSubreddit = (subreddit) => ({
    type: 'ADD_SUBREDDIT',
    subreddit
});

const removeSubreddit = (subredditId) => ({
    type: 'REMOVE_SUBREDDIT',
    subredditId,
  });

const updateSubreddit = (subreddit) => ({
    type: 'UPDATE_SUBREDDIT',
    subreddit
});



// -------------------------------------- thunk action creators -----------------------------------


// GET ALL SUBREDDITS
export const getAllSR = () => async (dispatch) => {
    const res = await fetch('/api/subreddits');

    if (res.ok) {
        const allSubreddits = await res.json();
        dispatch(loadAllSR(allSubreddits))
    }
};


// GET SPECIFIC SUBREDDIT BY SUBREDDIT ID
export const getSingleSR = (subredditId) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/${subredditId}`);

    if (res.ok) {
        const subreddit = await res.json();
        dispatch(loadSingleSR(subreddit))
    }
};

// GETS ALL POSTS FOR A GIVEN SUBREDDIT ID
export const getSubredditPosts = (subredditId) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/${subredditId}/posts`);

    if (res.ok) {
      const posts = await res.json();
      dispatch(loadSubredditPosts(posts));
    }
};


// CREATE A NEW SUBREDDIT
export const createSubreddit = ({ name, description, profile_picture, banner_image }) => async dispatch => {
    const res = await fetch('/api/subreddits', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            description,
            profile_picture,
            banner_image,
        })
    });

    if (res.ok) {
        const newSubreddit = await res.json();
        dispatch(addSubreddit(newSubreddit));
        return newSubreddit;
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) return data.errors
    } else {
        return ['An error occurred. Please try again.']
    }
};


// UPDATE AN EXISTING SUBREDDIT
export const editSubreddit = ({ id, name, description, profile_picture, banner_image }) => async dispatch => {
    const res = await fetch(`/api/subreddits/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            description,
            profile_picture,
            banner_image,
        })
    });

    if (res.ok) {
        const updatedSubreddit = await res.json();
        dispatch(updateSubreddit(updatedSubreddit));
        return updatedSubreddit;
    } else if (res.status < 500) {
        const data = await res.json();
        if (data.errors) return data.errors
    } else {
        return ['An error occurred. Please try again.']
    }
};


// DELETE A SUBREDDIT
export const deleteSubreddit = (subredditId) => async (dispatch) => {
    const res = await fetch(`/api/subreddits/${subredditId}`, {
        method: 'DELETE',
    });

    if (res.ok) {
      dispatch(removeSubreddit(subredditId));
    }
};






// CREATE A POST WITHIN A SPECIFIC SUBREDDIT
// export const createPostInSubreddit = (subredditId, title, content) => async (dispatch) => {
//     const res = await fetch(`/api/subreddits/${subredditId}/create_post`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ title, content }),
//     });

//     if (res.ok) {
//       const post = await res.json();
//       dispatch(addPostToSubreddit(post));
//     }
// };



// ---------------------------------------- subreddit reducer ----------------------------------------


const initialState = {}



const subredditReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_SUBREDDITS':
            const allSubreddits = {};
            const subredditArr = action.subreddits;
            subredditArr.forEach(subreddit => {
                allSubreddits[subreddit.id] = subreddit
            });
            return {
                ...state,
                allSubreddits: allSubreddits
            }
        case 'LOAD_SINGLE_SR':
            const oneSubreddit = action.subreddit;
            return {
                ...state,
                singleSubreddit: oneSubreddit
            }
        case 'ADD_SUBREDDIT':
            return {
                ...state,
                singleSubreddit: {
                    ...action.subreddit
                }
            }
        case 'UPDATE_SUBREDDIT':
            return {
                ...state,
                singleSubreddit: {
                    ...action.subreddit
                }
            }
        case 'REMOVE_SUBREDDIT':
            const newState = {...state};
            return newState;
        default:
            return state;
    }
}

export default subredditReducer;
