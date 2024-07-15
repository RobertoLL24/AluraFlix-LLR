document.addEventListener('DOMContentLoaded', () => {
    const newVideoBtn = document.getElementById('new-video-btn');
    const newVideoSection = document.getElementById('new-video-section');
    const videoContainer = document.getElementById('video-container');
    const newVideoForm = document.getElementById('new-video-form');

    // Load videos from local storage
    const loadVideos = () => {
        const videos = JSON.parse(localStorage.getItem('videos')) || [];
        videos.forEach(video => addVideoToDOM(video));
    };

    // Save videos to local storage
    const saveVideos = (videos) => {
        localStorage.setItem('videos', JSON.stringify(videos));
    };

    // Add video to DOM
    const addVideoToDOM = (video) => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video-container');
        videoElement.innerHTML = `
            <video controls width="100%" poster="${video.imageUrl}">
                <source src="${video.videoUrl}" type="video/mp4">
                Tu navegador no soporta la reproducción de video.
            </video>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.category}</p>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Borrar</button>
            </div>
            <p>${video.description}</p>
        `;
        videoContainer.appendChild(videoElement);

        // Ensure video is interactive
        const videoTag = videoElement.querySelector('video');
        videoTag.addEventListener('canplay', () => {
            videoTag.controls = true;
        });
    };

    // Handle form submission
    newVideoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value;
        const imageUrl = document.getElementById('image-url').value;
        const videoUrl = document.getElementById('video-url').value;
        const description = document.getElementById('description').value;

        const video = { title, category, imageUrl, videoUrl, description };
        addVideoToDOM(video);

        const videos = JSON.parse(localStorage.getItem('videos')) || [];
        videos.push(video);
        saveVideos(videos);

        newVideoForm.reset();
        newVideoSection.style.display = 'none';
    });

    // Handle delete and edit buttons
    videoContainer.addEventListener('click', (e) => {
        const videos = JSON.parse(localStorage.getItem('videos')) || [];

        if (e.target.classList.contains('delete-btn')) {
            const videoElement = e.target.parentElement.parentElement;
            const title = videoElement.querySelector('h3').innerText;
            const updatedVideos = videos.filter(video => video.title !== title);
            saveVideos(updatedVideos);
            videoElement.remove();
        }

        if (e.target.classList.contains('edit-btn')) {
            const videoElement = e.target.parentElement.parentElement;
            const title = videoElement.querySelector('h3').innerText;
            const video = videos.find(video => video.title === title);

            document.getElementById('title').value = video.title;
            document.getElementById('category').value = video.category;
            document.getElementById('image-url').value = video.imageUrl;
            document.getElementById('video-url').value = video.videoUrl;
            document.getElementById('description').value = video.description;

            newVideoSection.style.display = 'block';

            const updatedVideos = videos.filter(v => v.title !== title);
            saveVideos(updatedVideos);
            videoElement.remove();
        }
    });

    newVideoBtn.addEventListener('click', () => {
        newVideoSection.style.display = 'block';
    });

    loadVideos();
});
