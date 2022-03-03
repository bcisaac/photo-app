// Get post data from api endpoint (/api/posts?limit=10)
// when that data arrives build a bunch of html cards
// update the container with the HTML

const post2Html = post => {
    return `
        <section class="card" id=${post.id}>
            <div>
                <h1>${post.user.username}</h1>
                <i class="fas fa-ellipsis-h"></i>
            </div>
            <img class="post-image" alt="${post.user.username}'s post from ${post.display_time}" src=${post.image_url}>
            <div>
                <div class="left-group">
                    <button class="like" 
                    data-post-id="${post.id}"
                    data-user-like-id="${post.current_user_like_id}" 
                    aria-label="Like"
                    aria-checked="${!post.current_user_like_id ? 'false' : 'true'}"
                    onclick="toggleLike(event)">
                        <i class="fa${!post.current_user_like_id ? 'r' : 's'} fa-heart"></i>
                    </button>
                    <button class="comment"
                    onclick="showPostDetail(event)"
                    data-post-id="${post.id}">
                        <i class="far fa-comment"></i>
                    </button>
                    <i class="far fa-paper-plane"></i>
                </div>
                <button class="bookmark" 
                    data-post-id="${post.id}"
                    data-user-bookmark-id="${post.current_user_bookmark_id}" 
                    aria-label="Bookmark"
                    aria-checked="${!post.current_user_bookmark_id ? 'false' : 'true'}"
                    onclick="toggleBookmark(event)">
                        <i class="fa${!post.current_user_bookmark_id ? 'r' : 's'} fa-bookmark"></i>
                    </button>
                
            </div>
            <div id="${post.id}-likes">
                <h2>${post.likes.length} like${post.likes.length!=1 ? 's' : ''}</h2>
            </div>
            <p class="caption"><strong>${post.user.username}</strong> ${post.caption} </p>
            <article class="comments" id="post-${post.id}-comments">
                ${
                    comments2Html(post.comments, post)
                }
            </article>
            <p class="timestamp">${ post.display_time }</p>
            <div>
                <div class="post-comment">
                    <div class=input-holder>
                        <input class="comment-input" type="text" aria-label="Add a comment" placeholder="Add a comment...">
                    </div>
                    <button data-post-id="${post.id}" onclick="addComment(event)" class="post-button">Post</button>
                </div>
                
            </div>
        </section>
        `;
};

const toggleLike = (ev) => {
    console.log('button-clicked')
    const elem = ev.currentTarget
    if (elem.getAttribute('aria-checked') === 'false') {
        // issue post request
        likePost(elem.dataset.postId, elem)
        
    } else {
        // issue delete request
        unLikePost(elem.dataset.postId, elem.dataset.userLikeId, elem)
        
    }
    redrawLikes(elem.dataset.postId)

    
}

const redrawLikes = postId => {
    fetch(`/api/posts/${postId}`, {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => {
            console.log(document.querySelector(`#${data.id}-likes`))
            document.querySelector(`#${data.id}.likes`).innerHTML = `<h2>${data.likes.length} like${data.likes.length!=1 ? 's' : ''}</h2>`
        })  
}

const likePost = (postId, elem) => {
    fetch(`/api/posts/${postId}/likes/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = `<i class="fas fa-heart"></i>`
            elem.setAttribute('aria-checked', 'true')
            elem.setAttribute('data-user-like-id', data.id)
        });
}

const unLikePost = (postId, userLikeId, elem) => {
    const deleteURL = `/api/posts/${postId}/likes/${userLikeId}`

    fetch(deleteURL, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.innerHTML = `<i class="far fa-heart"></i>`
        elem.setAttribute('aria-checked', 'false')
        elem.setAttribute('data-user-like-id', undefined)
    });
}

const toggleBookmark = (ev) => {
    console.log('button-clicked')
    const elem = ev.currentTarget
    if (elem.getAttribute('aria-checked') === 'false') {
        // issue post request
        bookmarkPost(elem.dataset.postId, elem)

        
    } else {
        // issue delete request
        unBookmarkPost(elem.dataset.userBookmarkId, elem)
    }
}

const bookmarkPost = (postId, elem) => {
    const postData = {
        "post_id": postId
    };
    fetch(`/api/bookmarks/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = `<i class="fas fa-bookmark"></i>`
            elem.setAttribute('aria-checked', 'true')
            elem.setAttribute('data-user-bookmark-id', data.id)
        });
}

const unBookmarkPost = (bookmarkId, elem) => {
    const deleteURL = `/api/bookmarks/${bookmarkId}`

    fetch(deleteURL, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.innerHTML = `<i class="far fa-bookmark"></i>`
        elem.setAttribute('aria-checked', 'false')
        elem.setAttribute('data-user-bookmark-id', undefined)
    });

}

const addComment = (ev) => {
    const elem = ev.currentTarget
    inputElement = elem.previousElementSibling.querySelector('input')
    const comment = inputElement.value;
    const postId = elem.dataset.postId
    console.log(postId)

    // make a API call
    const postData = {
        "post_id": postId,
        "text": comment
    }
    fetch(`api/comments/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(comment => {
        console.log(comment);
    })
    
    redrawComments(postId)

}

const redrawComments = (postId) => {
    fetch(`http://127.0.0.1:5000/api/posts/${postId}`, {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        console.log(document.querySelector(`#post-${data.id}-comments`))
        document.querySelector(`#post-${data.id}-comments`).innerHTML = comments2Html(data.comments, data)
        console.log(data.comments.length)
    })

    // fetch("http://127.0.0.1:5000/api/posts/108", {
    //     method: "GET",
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    // });

}


const comments2Html = (comments, post) => {

    let html = ``
    
    if (comments && comments.length>1) {
        const lastComment = comments[comments.length - 1]
        html += `
            <button class="view-comments" onclick="showPostDetail(event)" data-post-id="${post.id}"> View all ${post.comments.length} comments</button>
            <p><strong>${lastComment.user.username}</strong> ${lastComment.text} <span class="comment-timestamp">${lastComment.display_time} </span></p>
        `
        
    }

    else if (comments && comments.length==1) {
        html+= `
        <p><strong>${comments[0].user.username}</strong> ${comments[0].text} <span class="comment-timestamp">${comments[0].display_time} </span></p>
        `
    }

    return html
}

const comment2Html = comment => {

    return `
    <p><strong>${comment.user.username}</strong> ${comment.text} <span class="comment-timestamp">${comment.display_time} </span></p>
    `
}

destroyModal = (ev) => {
    let returnLoc = ev.currentTarget.dataset.return
    console.log(returnLoc)
    document.querySelector('#modal-container').innerHTML = "";
    document.querySelector(`#${returnLoc} > button`).focus();
    
}

const showPostDetail = ev => {
    const postId = ev.currentTarget.dataset.postId;
    let returnLoc = `post-${postId}-comments`
    fetch(`/api/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            const html = `
            <div class="modal-bg">
                <button id="close-modal" data-return=${returnLoc} onclick="destroyModal(event)">Close</button>
                <div class="modal">
                    <div class="modal-img-container" style="background-image:url(${post.image_url})">
                    </div>
                    <div class = "modal-comments">
                        <article class="comments">
                            <p><strong>${post.user.username}</strong> ${post.caption} </p> 
                            ${
                                post.comments.map(comment2Html).join("")
                            }
                        </article>
                    </div>
                </div>
            </div>
            `
            document.querySelector('#modal-container').innerHTML = html;
            document.querySelector('#close-modal').focus()
        })
    
}

const suggestionHeader = () => {
    `
    <header>
        <img class="profile-pic" alt="your profile pic" src={{user.profile_url}}>
        <h1>{{ user.username }}</h1>
    </header>
    `
}

const story2Html = story => {
    // return `
    //     <section>
    //         <img class="profile-pic" alt="${story.user.username}'s profile pic" src=${story.user.thumb_url}>
    //         <p>${story.user.username}</p>
    //     </section>
    // `
        return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
        `
    ;
};

const user2html = user => {
    return `
        <section>
            <img class="profile-pic" alt= "${user.username}'s profile pic" src=${user.thumb_url}>
            <div class="suggest-text">
                <h2>${user.username}</h2>
                <h3>suggested for you</h3>
            </div>
            <div>
                <button class=follow 
                aria-label="Follow"
                aria-checked="false"
                data-user-id="${user.id}" 
                onclick="toggleFollow(event);">follow</button>
            </div>
        </section>
            `
}

const toggleFollow = (ev) => {
    console.log(ev)
    const elem = ev.currentTarget
    if (elem.getAttribute('aria-checked') === 'false') {
        // issue post request
        followUser(elem.dataset.userId, elem)
        
    } else {
        // issue delete request
        unfollowUser(elem.dataset.followingId, elem)
    }
}

const followUser = (userId, elem) => {
    const postData = {
        "user_id": userId
    };
    
    fetch("/api/following/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = 'unfollow'
            elem.classList.add('unfollow');
            elem.classList.remove('follow');
            elem.setAttribute('aria-checked', 'true')
            // in the event that we want to unfollow 
            elem.setAttribute('data-following-id', data.id);


        });
}

const unfollowUser = (followingId, elem) => {
    const deleteURL = `/api/following/${followingId}`

    fetch(deleteURL, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.innerHTML = 'follow'
        elem.classList.add('follow');
        elem.classList.remove('unfollow');
        elem.setAttribute('aria-checked', 'false')
        // in the event that we want to unfollow 
        elem.removeAttribute('data-following-id');
    });

}

// fetch data from your API endpoint:
const displayPosts = () => {
    fetch('/api/posts/?limit=10')
        .then(response => response.json())
        .then(posts => {
            const html = posts.map(post2Html).join('\n');
            document.querySelector('.posts').innerHTML = html;
        })
};

const displaySuggestions = () => {
    fetch('/api/suggestions/')
    .then(response => response.json())
    .then(users => {
        const html = users.map(user2html).join('\n');
        document.querySelector('.rec-panel').innerHTML = html;
    })
}

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};



const initPage = () => {
    displayStories();
    displayPosts();
    displaySuggestions()
};

// invoke init page to display stories:
initPage();