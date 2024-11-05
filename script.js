document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.getElementById("postForm");
    const postContent = document.getElementById("postContent");
    const feed = document.getElementById("feed");

    // Function to render posts
    const renderPosts = (posts) => {
        feed.innerHTML = "";  // Clear feed
        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            postElement.innerHTML = `
                <div class="post-content">${post.content}</div>
                <div class="timestamp">${post.timestamp}</div>
            `;

            feed.appendChild(postElement);  // Add post to the feed
        });
    };

    // Fetch posts from server
    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            const data = await response.json();
            renderPosts(data.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Handle form submission
    postForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const content = postContent.value.trim();
        if (content) {
            try {
                const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content })
                });

                if (response.ok) {
                    postContent.value = "";  // Clear the textarea
                    fetchPosts();  // Refresh the feed
                }
            } catch (error) {
                console.error('Error posting:', error);
            }
        }
    });

    // Load posts when the page is ready
    fetchPosts();
});