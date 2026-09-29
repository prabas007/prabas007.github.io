# prabas007.github.io

Personal site. Static HTML/CSS/JS, no build step, no dependencies.

## How to change things

**All text lives in `js/content.js`.** That is the only file you need to open
to change wording, add a project, or update experience. Everything on the site
renders from that one object.

Missing images and an empty resume path are hidden automatically, so the live
site never shows a broken frame. See the TODO below for what is still absent.

## TODO: still missing

Nothing below is on the live site yet. Missing images and an empty resume path
are hidden automatically, so the site looks finished without them. Add a file
and it appears on the next push, no code change needed.

### Resume
Drop `assets/resume.pdf`, then open `js/content.js` and change
`resume: ""` back to `resume: "assets/resume.pdf"`. The Resume button is
hidden in the hero, the footer and the command palette until you do.

### Photo
`assets/photo.jpg` — square-ish, 400x400 or larger. The hero runs as
text-only until this exists.

### Demo clips
Highest-value thing left. A working demo beats any paragraph.

| File | What to capture |
|---|---|
| `assets/visual-agent.gif` | Screen recording of the agent captioning and firing an alert |
| `assets/drivesafe.gif` | The wheel triggering WARN then ALARM |
| `assets/linkcare.gif` | A walk through the matching flow |
| `assets/bracket-bot.gif` | The SO-100 arms during teleoperated data collection |

`.mp4` works too, just change the filename in `content.js`.

### Project figures
Captions are already written. Drop the file and the caption appears with it.

| File | Caption already written for it |
|---|---|
| `assets/drivesafe-wheel.jpg` | Final wheel, FSRs at 10 and 2, tilt pot on the axle, buzzer on the bridge |
| `assets/drivesafe-fsm.jpg` | FSM on breadboard: state register, tolerance counter, next-state logic |
| `assets/drivesafe-scope.jpg` | Scope capture of the synchronized fault signal |
| `assets/drivesafe-award.jpg` | Most Commercializable award, ECE 145 showcase |
| `assets/linkcare-award.jpg` | Accepting the Actian VectorAI award at HackIllinois 2026 |
| `assets/linkcare-ui.jpg` | Peer matching view |

### Content worth revisiting
- **About paragraph** — currently mine, not yours. Worth a rewrite in your voice.
- **LinkCare** — the vector-database tuning story was cut because there was
  nothing concrete to say. Add it back as a fourth challenge if you remember
  the specifics.
- **DriveSafe** — the 98% detection accuracy figure on your resume is not in
  the final report, so it is not on the site. Add it as a results tile if you
  can source it.
- **Bracket Bot** — deliberately minimal while the policy work is in progress.
  Expand once there is something committed and measured.

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
