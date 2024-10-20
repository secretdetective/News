const loadModal = document.getElementById('loadModal');
window.addEventListener('load', () => {
  loadModal.style.display = 'block';
});
document.getElementById('closeBtn').addEventListener('click', () => {
  loadModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if(!loadModal.contains(e.target)){
  loadModal.style.display = 'none';
  }
});
document.getElementById('signUp').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  if(email.trim() === ''){
    alert('Please fill out the email field');
  } else if(!email.includes('@') || !email.includes('.')){
    alert('Invalid Email');
  }else {
  alert(`You will now receive notifications about our news update with ${email}`);
  }
});

/*document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
});*/
const year = new Date().getFullYear();
document.getElementById('year').textContent = year;

const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('dark-mode');
    
}


darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    darkModeToggle.textContent = darkModeToggle.textContent === 'Light Mode' ? 'Dark Mode' : 'Light Mode';
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        localStorage.setItem('dark-mode', 'disabled');
    }
});


const articles = [
    { title: 'Breaking News: Major Event', description: 'This is a short description of the news article...', image: 'homepol.png', link: 'pol.html' },
    {title: 'The Health Sector', description: 'An analysis in health and wellbeing of individuals in Akwa Ibom State', image: 'health.jpg', link: 'health.html'},
    { title: 'Tech News: New Smartphone Launch', description: 'Details about the latest smartphone...', image: 'iphone.jpg', link: 'tech.html' },
    { title: 'Sports Update: Soccer Championship', description: 'The latest results from the soccer championship...', image: 'sport.jpg', link: 'sport.html' },
    { title: 'Entertainment: New Movie Release', description: 'A popular movie is being released this week...', image: 'movie.jpg', link: 'enter.html' },
    { title: 'Global Economy: Market Analysis', description: 'An analysis of the current economic state...', image: 'market.jpg', link: 'business.html' },
    
    {title: 'More News coming in', description: 'Stay tuned for lastest info and posts...', image: 'logo.jpg', link: '#postsCreated'}
   
];


function renderArticles(filteredArticles) {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = ''; 

  
    filteredArticles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('news-article');

        articleElement.innerHTML = `
            <img src="${article.image}" alt="${article.title}">
            <div class="content">
                <h3>${article.title}</h3>
                <p>${article.description}</p><br>
                <button style ="background: #0073e6" onclick="window.location.href='${article.link}'">Read More</button><br>
            </div>
        `;
        newsList.appendChild(articleElement);
    });
}


renderArticles(articles);


const searchInput = document.getElementById('search');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

   
    const filteredArticles = articles.filter(article => {
      const newsDiv = document.querySelector('.news-div');
        return article.title.toLowerCase().includes(searchTerm) || article.description.toLowerCase().includes(searchTerm);
          
    });

   
    renderArticles(filteredArticles);
});



const apiKey = '$2a$10$oo/LK9/lQoT1O6vWn.kJjOBkldI40cSgnngqyKEeO.AL7jhjQBKxS'; 
const binId = '66ece8dcacd3cb34a887c5eb';
const jsonBinUrl = `https://api.jsonbin.io/v3/b/${binId}`;
const postsContainer = document.getElementById('postsContainer');
const postModal = document.getElementById('postModal');
const modalMessage = document.getElementById('modalMessage');
const modalFooter = document.getElementById('modalFooter');
const spinnerOverlay = document.getElementById('spinnerOverlay');
const spinner = document.getElementById('spinner');

const correctPin = '1938';
let isAdmin = false;


if (localStorage.getItem('adminPin') === correctPin) {
    isAdmin = true;
}

document.getElementById('closeNews').addEventListener('click', () => {
  postModal.style.display = 'none';
});

function showSpinner() {
    spinnerOverlay.style.display = 'block';
    spinner.style.display = 'block';
}


function hideSpinner() {
    spinnerOverlay.style.display = 'none';
    spinner.style.display = 'none';
}

document.getElementById('submitPostButton').addEventListener('click', () => {
    postModal.style.display = 'flex';
    modalMessage.textContent = ''; 
    modalFooter.textContent = ''; 
});


document.getElementById('submitPost').addEventListener('click', () => {
    const adminName = document.getElementById('adminName').value;
    const postTitle = document.getElementById('postTitle').value;
    const postContent = document.getElementById('postContent').value;
    

    if (postContent.trim() === '' || adminName.trim() === '' || postTitle.trim() === '') {
        alert('Please fill in all fields.');
        return;
    }

    let inputPin = correctPin;

    if (!isAdmin) {
        inputPin = prompt("Enter your PIN:");
        if (inputPin !== correctPin) {
            modalMessage.textContent = 'Incorrect PIN';
            return;
        }

       
        localStorage.setItem('adminPin', inputPin);
        isAdmin = true;
    }

    const newPost = {
        title: postTitle,
        text: postContent,
        name: adminName,
        timestamp: new Date().toISOString()
    };

 
    showSpinner();
    fetch(jsonBinUrl, {
        method: 'GET',
        headers: {
            'X-Master-Key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const posts = data.record.posts || [];
        posts.push(newPost);

       
        return fetch(jsonBinUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify({ posts })
        });
    })
    .then(() => {
        document.getElementById('postContent').value = '';
        loadPosts();
        modalFooter.textContent = `Posted by ${adminName} at ${new Date().toLocaleTimeString()}`;
        postModal.style.display = 'none'; 
    })
    .finally(() => hideSpinner())
    .catch(error => console.error('Error posting:', error));
});


function loadPosts() {
    showSpinner();
    fetch(jsonBinUrl, {
        method: 'GET',
        headers: {
            'X-Master-Key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const posts = data.record.posts || [];
        postsContainer.innerHTML = '<h2>Posts 📌📌</h2>';

        if (posts.length === 0) {
            postsContainer.innerHTML += '<p>No posts yet.</p>';
        } else {
            posts.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.id = "postsCreated";
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.text}</p><br>
                    <small class="postName">Posted by ${post.name}<br> ${timeAgo(post.timestamp)}</small>
                `;
                
               
                if (isAdmin) {
                    const buttons = document.createElement('div');
                    buttons.className = 'edit-delete-buttons';
                    buttons.innerHTML = `
                        <button class="edit" onclick="editPost(${index})">Edit</button>
                        <button class="delete" onclick="deletePost(${index})">Delete</button>
                    `;
                    postElement.appendChild(buttons);
                }

                postsContainer.appendChild(postElement);
            });
        }
    })
    .finally(() => hideSpinner())
    .catch(error => console.error('Error fetching posts:', error));
}


function timeAgo(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const seconds = Math.floor((now - postTime) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (const unit in intervals) {
        const interval = intervals[unit];
        if (seconds >= interval) {
            const count = Math.floor(seconds / interval);
            return `${count} ${unit}${count !== 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

function editPost(index) {
    const postToEdit = prompt("Enter your edited content:");
    if (postToEdit) {
        fetch(jsonBinUrl, {
            method: 'GET',
            headers: {
                'X-Master-Key': apiKey
            }
        })
        .then(response => response.json())
        .then(data => {
            const posts = data.record.posts || [];
            posts[index].text = postToEdit;

            return fetch(jsonBinUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': apiKey
                },
                body: JSON.stringify({ posts })
            });
        })
        .then(() => loadPosts())
        .catch(error => console.error('Error editing post:', error));
    }
}
function deletePost(index) {
    if (confirm("Are you sure you want to delete this post?")) {
        fetch(jsonBinUrl, {
            method: 'GET',
            headers: {
                'X-Master-Key': apiKey
            }
        })
        .then(response => response.json())
        .then(data => {
            const posts = data.record.posts || [];
            posts.splice(index, 1); 

            return fetch(jsonBinUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': apiKey
                },
                body: JSON.stringify({ posts })
            });
        })
        .then(() => loadPosts())
        .catch(error => console.error('Error deleting post:', error));
    }
}


window.onload = loadPosts;


function writeText(text) {
  let index = 0;

  function writeNextLetter() {
    if (index < text.length) {
      document.querySelector('.title').innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }
  let interval = setInterval(writeNextLetter, 100);
}
writeText('The spokesman Newspaper');


