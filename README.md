# Engineering portfolio

Static site for GitHub Pages. No build step, no Jekyll.

## Publish
1. Create a repo named `your-username.github.io` (site lives at `https://your-username.github.io`).
2. Upload everything in this folder (including the hidden `.nojekyll` file) to the repo root.
3. Repo Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.

## Things to edit first
Search all files for `Your Name`, `you@example.com`, `your-username`, `your-profile`.
Put your resume at `assets/resume.pdf`.

## Adding photos and videos
Every media slot shows a placeholder with the exact file path it expects.
Drop a file with that name into the project's `media/` folder and it appears automatically,
already formatted. See `projects/tiltrotor-vtol/media/README.md` for the full list.

A slot looks like this:

    <figure class="media" data-type="image"
            data-src="media/fuselage.jpg"
            data-alt="What the photo shows"
            data-caption="Caption under the photo."></figure>

- `data-type`: `image`, `video` (mp4), or `youtube`
- `data-src`: file path, or the YouTube video ID (the part after `v=`)
- `data-ratio`: placeholder shape, e.g. `16/9` (default), `4/3`, `1/1`
- add `data-loop` to a video to autoplay muted on loop

Tips: export photos around 1600–2000 px wide as JPG (~300 KB). GitHub rejects files
over 100 MB, so for long flight videos either compress to 720p/1080p H.264 mp4, or
upload to YouTube and switch the slot to `data-type="youtube" data-src="VIDEO_ID"`.

## Removing "Still to write" notes
Yellow dashed boxes (`<div class="todo">`) mark sections that need text.
Replace each with your paragraphs once written.

## Adding a new project
1. Copy `projects/project-template/` → `projects/your-project-name/`.
2. Edit the title block, sections, and sidebar links (each sidebar `href="#id"` must match a heading `id`).
3. Remove `<meta name="robots" content="noindex">` from the new page.
4. In `index.html`, copy the existing project `<li>` and update it.
5. Optionally delete `projects/project-template/` from the live site, or keep it as a reference.
