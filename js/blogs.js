document.addEventListener('DOMContentLoaded', function () {
    const postsPerPage = 10;
    let currentPage = 1;
    let totalPages = 1;

    fetchPosts('https://food-blog.fl-power.no/wp-json/wp/v2/posts?page=1')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const totalPagesHeader = response.headers.get('X-WP-TotalPages');
            if (totalPagesHeader) {
                totalPages = parseInt(totalPagesHeader);
            }
            return response.json();
        })
        .then(posts => {
            renderPosts(posts);
            if (currentPage < totalPages) {
                renderLoadMoreButton();
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });

    function fetchPosts(url) {
        return fetch(url);
    }

    function renderPosts(posts) {
        const postContainer = document.getElementById('post-container');

        if (!postContainer) {
            console.error('Post container not found');
            return;
        }

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2>${post.title.rendered}</h2>
                <div>${post.content.rendered}</div>
            `;
            postContainer.appendChild(postElement);

            const images = postElement.querySelectorAll('img');
            images.forEach(image => {
                image.style.maxWidth = '100%';
                image.style.height = 'auto';

                if (window.innerWidth <= 768) {
                    image.style.width = '45%';
                }
            });
        });
    }

    function renderLoadMoreButton() {
        const postContainer = document.getElementById('post-container');

        const loadMoreButton = document.createElement('button');
        loadMoreButton.textContent = 'Load More';
        loadMoreButton.classList.add('read-more-button');
        loadMoreButton.id = 'load-more-button';

        loadMoreButton.addEventListener('click', function () {
            currentPage++;
            const nextPageUrl = `https://food-blog.fl-power.no/wp-json/wp/v2/posts?page=${currentPage}`;

            fetchPosts(nextPageUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(newPosts => {
                    renderPosts(newPosts);
                    if (currentPage >= totalPages) {
                        loadMoreButton.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Error fetching next page of posts:', error);
                });
        });

        postContainer.appendChild(loadMoreButton);
    }
});
