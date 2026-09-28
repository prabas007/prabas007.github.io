# prabas007.github.io

Personal site. Static HTML/CSS/JS, no build step, no dependencies.

## How to change things

**All text lives in `js/content.js`.** That is the only file you need to open
to change wording, add a project, or update experience. Everything on the site
renders from that one object.

Anything marked `[PLACEHOLDER]` is invented or missing and is highlighted in
orange on the live page so you cannot miss it. Replace those first.

## Assets you still need to add

Drop these into `assets/`:

| File | What it is |
|---|---|
| `photo.jpg` | Your headshot. Square-ish, at least 400x400. |
| `resume.pdf` | Current résumé. |
| `visual-agent.gif` | 5-10s screen recording of the agent running. |
| `bracket-bot.gif` | Clip of the arms or the latent-space rollout. |
| `trainify.gif` | Screen recording of the app tracking a shot. |
| `drivesafe.gif` | Clip of the hardware responding to a sensor. |

Any missing file shows a labelled placeholder instead of breaking. `.mp4` works
too, just change the filename in `content.js`.

## Adding a project

Copy any block in the `projects` array in `content.js` and edit it. The card and
its detail page are both generated from that one entry. `id` must be unique; it
becomes the URL (`project.html?p=your-id`).

## Running locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Tracking which application drove a visit

Append `?ref=` to the link you put on an application:

```
https://prabas007.github.io?ref=qualcomm
```

The value is logged to the console and kept in sessionStorage. To see real
numbers, add the site to Cloudflare Web Analytics (free, no custom domain
required) and paste its one-line script before `</body>` in `index.html`.
