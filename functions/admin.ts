import { isAuthorized } from './api/auth';

function renderAdminPage() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Dashboard | Ben Gilmour</title>
    <style>
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #f7f8fb; color: #111827; }
      .shell { max-width: 1100px; margin: 0 auto; padding: 32px; }
      header { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
      h1 { margin: 0; font-size: clamp(2rem, 3vw, 2.8rem); }
      p { color: #475569; margin: 0; }
      .section { background: white; border: 1px solid #e5e7eb; border-radius: 24px; padding: 24px; margin-top: 20px; }
      .section h2 { margin-top: 0; }
      .grid { display: grid; gap: 20px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .form-row { display: grid; gap: 12px; margin-bottom: 16px; }
      label { display: grid; gap: 8px; font-size: 0.95rem; }
      input, textarea, button { width: 100%; border: 1px solid #d1d5db; border-radius: 12px; padding: 12px; font: inherit; }
      textarea { min-height: 120px; resize: vertical; }
      button { background: #4338ca; color: white; border: none; cursor: pointer; }
      button:hover { background: #312e81; }
      .log-link { color: #4338ca; text-decoration: none; font-weight: 600; }
      .preview-list { display: grid; gap: 12px; }
      .content-card { padding: 18px; border: 1px solid #e5e7eb; border-radius: 16px; background: #f8fafc; }
      .content-card h3 { margin: 0 0 8px; }
      .meta { color: #6b7280; font-size: 0.95rem; margin-top: 8px; }
      @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <div class="shell">
      <header>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Use this page to manage sermons, blog posts, and uploaded image assets.</p>
        </div>
        <a class="log-link" href="/api/logout">Logout</a>
      </header>

      <div class="section">
        <h2>Add or edit a blog post</h2>
        <form id="blog-form">
          <div class="form-row">
            <label>Post ID<input type="text" name="id" placeholder="welcome" required /></label>
            <label>Title<input type="text" name="title" placeholder="Welcome" required /></label>
          </div>
          <div class="form-row">
            <label>Description<textarea name="description" placeholder="Short summary" required></textarea></label>
          </div>
          <div class="form-row">
            <label>Publish Date<input type="date" name="pubDate" required /></label>
            <label>Tags<input type="text" name="tags" placeholder="ministry, coaching" /></label>
          </div>
          <div class="form-row">
            <label>Content<textarea name="content" placeholder="Post body markdown" required></textarea></label>
          </div>
          <button type="submit">Save blog post</button>
        </form>
      </div>

      <div class="section">
        <h2>Add or edit a sermon</h2>
        <form id="sermon-form">
          <div class="form-row">
            <label>Sermon ID<input type="text" name="id" placeholder="trinity-sunday" required /></label>
            <label>Title<input type="text" name="title" placeholder="Trinity Sunday" required /></label>
          </div>
          <div class="form-row">
            <label>Description<textarea name="description" placeholder="Short summary" required></textarea></label>
          </div>
          <div class="form-row">
            <label>Scripture<input type="text" name="scripture" placeholder="Romans 5:1–5; John 16:12–15" /></label>
            <label>Location<input type="text" name="location" placeholder="Uniting Church" /></label>
          </div>
          <div class="form-row">
            <label>Publish Date<input type="date" name="pubDate" required /></label>
          </div>
          <div class="form-row">
            <label>Content<textarea name="content" placeholder="Sermon text" required></textarea></label>
          </div>
          <button type="submit">Save sermon</button>
        </form>
      </div>

      <div class="section">
        <h2>Upload an image asset</h2>
        <form id="image-form">
          <div class="form-row">
            <label>Filename<input type="text" name="filename" placeholder="image-name.jpg" required /></label>
            <label>Alt text<input type="text" name="alt" placeholder="Decorative image description" required /></label>
          </div>
          <div class="form-row">
            <label>Image URL<input type="url" name="url" placeholder="https://example.com/image.jpg" required /></label>
          </div>
          <button type="submit">Save image</button>
        </form>
      </div>

      <div class="section">
        <h2>Current content preview</h2>
        <div class="grid">
          <div>
            <h3>Blog posts</h3>
            <div id="blog-list" class="preview-list"></div>
          </div>
          <div>
            <h3>Sermons</h3>
            <div id="sermon-list" class="preview-list"></div>
          </div>
        </div>
        <div>
          <h3>Images</h3>
          <div id="image-list" class="preview-list"></div>
        </div>
      </div>
    </div>

    <script>
      async function fetchItems(endpoint, listId) {
        const response = await fetch(endpoint);
        const data = await response.json();
        const container = document.getElementById(listId);
        container.innerHTML = '';

        if (!data.length) {
          container.innerHTML = '<p>No items yet.</p>';
          return;
        }

        for (const item of data) {
          const node = document.createElement('div');
          node.className = 'content-card';
          node.innerHTML = `
            <h3>${item.title ?? item.filename}</h3>
            <p>${item.description ?? item.alt ?? ''}</p>
            <p class="meta">ID: ${item.id ?? item.filename}</p>
          `;
          container.appendChild(node);
        }
      }

      async function submitForm(formId, endpoint) {
        const form = document.getElementById(formId);
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const formData = new FormData(form);
          const response = await fetch(endpoint, { method: 'POST', body: formData });
          const result = await response.json();
          if (response.ok) {
            alert(result.message);
            form.reset();
            loadLists();
          } else {
            alert(result.error || 'Unable to save data.');
          }
        });
      }

      async function loadLists() {
        await fetchItems('/api/blog', 'blog-list');
        await fetchItems('/api/sermon', 'sermon-list');
        await fetchItems('/api/image', 'image-list');
      }

      submitForm('blog-form', '/api/blog');
      submitForm('sermon-form', '/api/sermon');
      submitForm('image-form', '/api/image');
      loadLists();
    </script>
  </body>
</html>`;
}

export async function onRequestGet({ request }) {
  if (!isAuthorized(request)) {
    return Response.redirect(new URL('/login', request.url), 303);
  }
  return new Response(renderAdminPage(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
