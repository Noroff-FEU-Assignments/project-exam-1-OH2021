document.addEventListener('DOMContentLoaded', function () {
    const postWrapper = document.getElementById('latest-posts-wrapper');
    let swiper;

    async function fetchPosts() {
        try {
            const response = await fetch('https://food-blog.fl-power.no/wp-json/wp/v2/posts?per_page=10&_embed');
            const posts = await response.json();
            displayPosts(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    function displayPosts(posts) {
        const swiperWrapper = document.getElementById('latest-posts-wrapper');

        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];

            const postElement = document.createElement('div');
            postElement.classList.add('swiper-slide');
            postElement.innerHTML = `
                <div class="post-content">
                    <h2>${post.title.rendered}</h2>
                    <p>${post.excerpt.rendered}</p>
                    <button class="read-more-button" data-postid="${post.id}">Read More</button>
                </div>
            `;

            swiperWrapper.appendChild(postElement);
        }

        swiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        document.querySelectorAll('.read-more-button').forEach(button => {
            button.addEventListener('click', goToBlogPage);
        });
    }

    function goToBlogPage(event) {
        const postId = event.target.getAttribute('data-postid');
        window.location.href = `specific-blog.html?id=${postId}`;
    }

    fetchPosts();
});