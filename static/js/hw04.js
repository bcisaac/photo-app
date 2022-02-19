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

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

const likeunlike = ev => {
    console.log('button-clicked')
}

// Get post data from api endpoint (/api/posts?limit=10)
// when that data arrives build a bunch of html cards
// update the container with the HTML

const post2Html = post => {
    return `
        <section class="card">
            <div>
                <h1>${post.user.username} - ${post.current_user_like_id} - ${post.current_user_bookmark_id} </h1>
                <i class="fas fa-ellipsis-h"></i>
            </div>
            <img class="post-image" alt="${post.user.username}'s post from ${post.display_time}" src=${post.image_url}>
            <div>
                <div class="left-group">
                    <button onclick="likeunlike(event)">
                        <i class="fa${!post.current_user_like_id ? 'r' : 's'} fa-heart"></i>
                    </button>
                        <i class="far fa-comment"></i>
                    <i class="far fa-paper-plane"></i>
                </div>
                <i class="fa${!post.current_user_bookmark_id ? 'r' : 's'} fa-bookmark"></i>
            </div>
            <div class="likes">
                <h2>${post.likes.length} like${post.likes.length!=1 ? 's' : ''}</h2>
            </div>
            <article class="comments">
                <p><strong>${post.user.username}</strong> ${post.caption} <a href="#">more</a></p> 
                ${
                    comments2Html(post.comments, post)
                }
            </article>
            <p class="timestamp">${ post.display_time }</p>
            <div>
                <div class="left-group">
                    <i class="far fa-smile"></i>
                    <h3>Add a comment...</h3>
                </div>
                <a href="#"><h4>Post</h4></a>
            </div>
        </section>
        `;
};

const comments2Html = (comments, post) => {
    if(comments.length==1) {
        return `
            <p><strong>${comments[0].user.username}</strong> ${comments[0].text} </p>
    `
    }
    else if (comments.length==0) {
        return ``
    }
    else {
        return `
            <a href="#"> View all ${post.comments.length} comments</a>
            <p><strong>${comments[0].user.username}</strong> ${comments[0].text} </p>
        `
    }
}

const suggestionHeader = () => {
    `
    <header>
        <img class="profile-pic" alt="your profile pic" src={{user.profile_url}}>
        <h1>{{ user.username }}</h1>
    </header>
    `
}

const toggleFollow = (ev) => {
    console.log(ev)
    const elem = ev.currentTarget
    console.log(elem.dataset.userId)
    console.log(elem.innerHTML)
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
        console.log(users)
        const html = users.map(user2html).join('\n');
        document.querySelector('.rec-panel').innerHTML = html;
    })
}



const initPage = () => {
    displayStories();
    displayPosts();
    displaySuggestions()
};

// invoke init page to display stories:
initPage();