document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    fetch(`https://food-blog.fl-power.no/wp-json/wp/v2/posts/${postId}?_embed`)
        .then(response => response.json())
        .then(post => {
            console.log(post);
            const blogPostContent = document.getElementById('blog-post-content');
            blogPostContent.innerHTML = `
                <h2>${post.title.rendered}</h2>
                ${post.content.rendered}
            `;
            document.title = `${post.title.rendered} | Blog of Foods`;

            const images = blogPostContent.querySelectorAll('img');
            images.forEach(img => {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';

                // Scale down image size for screens <= 768px
                if (window.innerWidth <= 768) {
                    img.style.width = '33.33%';
                }

                img.addEventListener('click', function () {
                    const modal = document.createElement('div');
                    modal.classList.add('modal');
                    const modalImg = document.createElement('img');
                    modalImg.src = this.src;
                    modal.appendChild(modalImg);
                    document.body.appendChild(modal);
                    modal.addEventListener('click', function () {
                        modal.remove();
                    });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching blog post:', error);
        });
});
