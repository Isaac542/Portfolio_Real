/* =========================================================
   Media loader
   Any <figure class="media"> with data attributes becomes a
   photo/video slot. If the file exists it is shown; if not,
   a labelled placeholder appears showing the exact file path
   to upload. No HTML edits needed once you add the file.

   Attributes:
     data-type     image | video | youtube
     data-src      path to the file (or YouTube video ID)
     data-alt      what the media shows (also used as alt text)
     data-caption  optional caption under the media
     data-ratio    placeholder shape, e.g. "16/9", "4/3", "1/1"
     data-loop     (video) autoplay muted on loop, no controls
   ========================================================= */
(function initMedia() {
  document.querySelectorAll("figure.media").forEach((fig) => {
    const type = fig.dataset.type || "image";
    const src = (fig.dataset.src || "").trim();
    const alt = fig.dataset.alt || "";
    const ratio = fig.dataset.ratio || "16/9";

    const frame = document.createElement("div");
    frame.className = "media-frame";
    frame.style.aspectRatio = ratio;
    fig.prepend(frame);

    if (fig.dataset.caption) {
      const cap = document.createElement("figcaption");
      cap.textContent = fig.dataset.caption;
      fig.append(cap);
    }

    const showPlaceholder = () => {
      frame.className = "media-frame is-placeholder";
      frame.replaceChildren();
      const box = document.createElement("div");
      box.className = "ph";
      const kind = document.createElement("span");
      kind.className = "ph-kind";
      kind.textContent = type === "image" ? "Photo goes here" : "Video goes here";
      const desc = document.createElement("span");
      desc.className = "ph-desc";
      desc.textContent = alt;
      const path = document.createElement("code");
      path.className = "ph-path";
      path.textContent = type === "youtube"
        ? (src ? "YouTube ID: " + src : "Add a YouTube video ID to data-src")
        : (src || "No file path set");
      box.append(kind, desc, path);
      frame.append(box);
    };

    const markLoaded = () => frame.classList.add("is-loaded");

    if (!src) return showPlaceholder();

    if (type === "image") {
      const img = document.createElement("img");
      img.alt = alt;
      img.hidden = true;
      img.loading = "lazy";
      img.decoding = "async";
      img.onload = () => { img.hidden = false; markLoaded(); };
      img.onerror = showPlaceholder;
      img.src = src;
      frame.append(img);
    } else if (type === "video") {
      const v = document.createElement("video");
      v.hidden = true;
      v.preload = "metadata";
      v.playsInline = true;
      if (fig.hasAttribute("data-loop")) {
        v.muted = true; v.loop = true; v.autoplay = true;
      } else {
        v.controls = true;
      }
      v.setAttribute("aria-label", alt);
      v.addEventListener("loadedmetadata", () => { v.hidden = false; markLoaded(); });
      v.addEventListener("error", showPlaceholder);
      v.src = src;
      frame.append(v);
    } else if (type === "youtube") {
      const f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(src);
      f.title = alt || "Video";
      f.loading = "lazy";
      f.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      frame.append(f);
      markLoaded();
    }
  });
})();

/* =========================================================
   Sidebar table of contents: highlights the section you're
   reading and expands its sub-sections.
   ========================================================= */
(function initToc() {
  const toc = document.querySelector(".toc");
  if (!toc) return;

  const links = [...toc.querySelectorAll("a[href^='#']")];
  const targets = links
    .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
    .filter(Boolean);
  const currentLabel = toc.querySelector(".toc-toggle .current");

  const setActive = (id) => {
    links.forEach((a) => {
      const on = a.hash === "#" + id;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    toc.querySelectorAll("li.is-open").forEach((li) => li.classList.remove("is-open"));
    const active = links.find((a) => a.hash === "#" + id);
    if (!active) return;
    const topLi = active.closest(".toc > nav > ol > li");
    if (topLi) topLi.classList.add("is-open");
    if (currentLabel) currentLabel.textContent = active.textContent;
  };

  // Pick the last heading that has scrolled past the top band of the screen.
  let ticking = false;
  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.25;
    let current = targets[0];
    for (const t of targets) {
      if (t.getBoundingClientRect().top - line <= 0) current = t; else break;
    }
    if (current) setActive(current.id);
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();

  // Mobile: collapsible contents bar
  const toggle = toc.querySelector(".toc-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = toc.classList.toggle("is-expanded");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.forEach((a) => a.addEventListener("click", () => {
      toc.classList.remove("is-expanded");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }
})();

/* Footer year */
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
