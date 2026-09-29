/* ============================================================================
   CONTENT — This is the only file you need to edit to change site text.
   Missing images and an empty resume path are hidden automatically.
   ============================================================================ */

const CONTENT = {

  /* --- Basics ------------------------------------------------------------ */
  name: "Praneel Baskar",

  // The one line that defines you. Shows directly under your name.
  tagline: "I build systems that sense, compute, and act, from discrete circuits to on-device ML.",

  // Second line, smaller. Current status.
  status: "ECE @ UIUC · software, embedded, electrical, robotics",

  // Hero paragraph. 2-3 sentences, first person, your actual voice.
  intro: "I like working where hardware meets software. My projects run from analog logic built out of 555 timers and comparators, to computer-vision pipelines running on-device, to learning-based robot manipulation.",

  email: "praneelbaskar@gmail.com",
  github: "https://github.com/prabas007",
  linkedin: "https://www.linkedin.com/in/praneel-baskar/",
  // Drop the PDF at assets/resume.pdf, then set this back to "assets/resume.pdf".
  // Empty string hides the Resume button everywhere.
  resume: "assets/resume.pdf",

  // Missing file just hides the photo. Drop a square-ish image here.
  photo: "assets/photo.jpg",
  photoAlt: "Praneel Baskar",

  /* --- Projects ---------------------------------------------------------- */
  /* Order here = order on the page. Each gets a card + a detail page.       */
  projects: [
    {
      id: "drivesafe",
      domain: "Hardware · Embedded",
      title: "DriveSafe",
      subtitle: "Speed-adaptive driver distraction detector · ECE 145, team of 3",
      year: "Jan – May 2026",
      award: "Most Commercializable Award",     // shows as a badge
      hook: "A driver-distraction system built entirely from discrete logic. No microcontroller, no firmware, just 555 timers, comparators, flip-flops and a finite state machine that gets less forgiving the faster you drive.",
      stack: ["555 Timers", "LM311", "CD4029", "74LS153", "74LS74", "CD40106", "HC-SR04", "FSRs"],
      media: "assets/drivesafe-wheel.jpg",
      repo: "",
      reportUrl: "https://docs.google.com/document/d/10l7Ibyhw_JxpzzuUk1FnDpYIya4wobCspHuAFd-FOSs/edit?usp=sharing",
      reportLabel: "Read the full technical report",

      problem: "Distracted driving causes 3,725 deaths and 325,000 injuries annually according to the FCC, usually when a driver looks away from the road or takes their hands off the wheel. Our original design used a microcontroller to handle the ultrasonic sensor. After consultation with the professor we pivoted away from it entirely, which meant every threshold, every timer, and every state transition had to be built in hardware.",

      built: "Three sensors feed one FSM. A force-sensing resistor at each of the 10 and 2 hand positions detects grip, an HC-SR04 ultrasonic sensor confirms the driver is facing forward, and a potentiometer mounted on the steering axle measures wheel tilt. Those combine into a single fault signal, SOFT_FAULT = FSR + EYES + (TILT · S1), where tilt only counts as a fault above 60 mph. The FSM holds three states, OK, WARN and ALARM, and the grace period before the alarm fires shrinks with speed: 4 clock ticks at 20 mph down to 1 at 80, selected by a 4:1 multiplexer off the speed counter bits.",

      architecture: [
        "FSR / ultrasonic / tilt",
        "SOFT_FAULT logic",
        "synchronizer",
        "tolerance counter",
        "FSM (OK/WARN/ALARM)",
        "buzzer"
      ],
      architectureNote: "State register is a 74LS74 dual D flip-flop with next-state equations derived from K-maps: D0 = (!Q1·!Q0·FAULT) + (Q0·!TIMEOUT·FAULT) for WARN, and D1 = Q1 + (Q0·TIMEOUT) for ALARM, where the Q1 feedback term latches the alarm until the reset button clears it.",

      results: [
        { label: "Most Commercializable", value: "Winner", note: "ECE 145 final showcase" },
        { label: "Sensor inputs", value: "3", note: "grip, head position, wheel tilt" },
        { label: "Speed tiers", value: "4", note: "20/40/60/80 mph, adaptive tolerance" },
        { label: "System clock", value: "0.872 Hz", note: "CD40106 RC oscillator, 1.15s per tick" }
      ],

      challenges: [
        {
          title: "The counter wrapped past zero instead of holding",
          body: "The CD4029 tolerance counter counted down correctly but then rolled over and restarted. Gating it through CARRY OUT did not work because that pulse is too narrow on the CD4029 to keep the counter disabled. The fix was to stop the clock itself: a diode AND gate on the gated-clock path, so COUNTER_CLK = GATED_CLK · CARRY_OUT. Once the count hits zero, CARRY_OUT clamps the clock node low and no further edges reach the counter."
        },
        {
          title: "False timeouts from an asynchronous fault signal",
          body: "SOFT_FAULT is generated combinationally from the sensors, so it can change in the middle of a clock cycle. When it transitioned near a clock edge the AND gate produced a brief glitch that the counter read as an extra clock edge, jumping straight to timeout. I passed the raw signal through an unused D flip-flop first, so SOFT_FAULT_SYNCED only changes on rising edges. The FSM and load-pulse logic still use raw SOFT_FAULT, so detection latency did not change."
        },
        {
          title: "The counter reloaded forever and never timed out",
          body: "Tying preset-enable directly to SOFT_FAULT meant the counter reloaded its preset on every tick the fault stayed active, so the countdown never advanced. Detecting the rising edge with a delayed copy of the signal, LOAD_PULSE = SOFT_FAULT · !SOFT_FAULT_DELAYED, produces exactly one load pulse per fault onset."
        },
        {
          title: "A comparator that read correct voltages and still did nothing",
          body: "The FSR subcircuit would not switch its output LED. Probing with a scope confirmed the FSR itself was modulating voltage correctly, so the sensor was not the problem. Going through the comparator datasheet pin by pin turned up an ungrounded reference pin, which the part needs to establish a 0V reference before it can compare anything. The circuit was also active-low by default, fixed by swapping the FSR and reference potentiometer positions in the divider."
        }
      ],

      // Images are hidden until the files exist in assets/.
      gallery: [
        { src: "assets/drivesafe-system.jpg", caption: "Force sensors and tilt potentiometer on the wheel, wired into the logic boards" },
        { src: "assets/drivesafe-fsm.jpg",    caption: "The finite state machine on breadboard: state register, tolerance counter, next-state logic, and speed display" },
        { src: "assets/drivesafe-award.jpg",  caption: "Most Commercializable Award, ECE 145, Spring 2026" }
      ],

      scope: "Course project for ECE 145 with Soham and Sanjit. I owned the FSR hand-detection subcircuit, the tilt detection design, and shared work on the ultrasonic path and final integration. Known limits: wiring organization made debugging harder than it needed to be, and the intended 3D-printed housing was dropped when the ordered wheel never arrived."
    },

    {
      id: "visual-agent",
      domain: "Software · ML",
      title: "Visual Agent",
      subtitle: "Webcam agent running a 7B vision model on a remote GPU",
      year: "May – June 2026",
      hook: "A webcam agent that captions what it sees with Qwen2-VL-7B on a remote H100 and speaks a desktop alert when it catches you on your phone or slouching.",
      stack: ["Python", "OpenCV", "Qwen2-VL-7B", "PyTorch", "LangGraph", "Flask", "ngrok", "SQLite"],
      media: "assets/visual-agent.gif",
      repo: "https://github.com/prabas007/VisualAgent",

      problem: "I wanted a 7B vision-language model watching my webcam in a loop, but the H100 I had access to sat behind a university Jupyter service with no SSH and no public port, and VS Code remote returned a 403. The second problem was the model itself: it returns free-form English, not labels, so every downstream decision had to be made from whatever wording came back.",

      built: "A four-node LangGraph loop running on my Mac. OpenCV grabs a frame, encodes it as base64 JPEG, and POSTs it to a Flask endpoint on the H100 through an ngrok tunnel. The server holds Qwen2-VL-7B-Instruct in fp16, loaded once at startup, and returns a caption. Captions go into SQLite with timestamps, and a reasoning node matches the caption against phone and slouch conditions with negation guards before firing a macOS notification and text-to-speech. Only the vision call leaves the laptop, so the tunnel carries one small request per cycle and the server side is a notebook I can paste into a fresh session.",

      architecture: [
        "capture frame",
        "caption (remote H100)",
        "store + load memory",
        "reason",
        "act",
        "sleep 5s, loop"
      ],
      architectureNote: "The prompt and the reasoning node are deliberately coupled. The prompt instructs the model to use the literal words 'slouching' or 'upright' so the reasoning step has something dependable to match on. That is a constraint, not elegance: matching on free text is brittle, and the prompt is what makes it survivable.",

      results: [
        { label: "Cycle time", value: "7.5s", note: "median between stored captions, derived from DB timestamps" },
        { label: "Captions logged", value: "84", note: "across two development sessions" },
        { label: "Phone captions that deny a phone", value: "58 of 78", note: "why the negation guard exists" }
      ],

      challenges: [
        {
          title: "58 of 78 captions said 'phone' while denying there was one",
          body: "The prompt asks the model to note whether the person is holding a phone, so almost every caption contains the word, usually inside a sentence like 'they are not holding or looking at a phone.' A plain substring match alerted on most frames. I pulled the stored captions out of SQLite and counted: 58 of the 78 containing 'phone' were explicit denials. That number is what told me a negation guard was mandatory rather than nice to have."
        },
        {
          title: "The fix for that bug silently disabled the other alert",
          body: "My first negation guard was a single shared condition covering both phone and slouch checks. So a caption reading 'slouched posture. They are not holding a phone' matched the guard and fired nothing at all, hiding a real slouch alert behind an unrelated denial. I split the reasoning node into independent checks that append to a list, changed the action state from a single string to a list, and gave the slouch check its own guards. The phone guard is still a coarse substring test, and I know it: any caption containing 'no' suppresses that alert."
        },
        {
          title: "Getting to the H100 at all",
          body: "VS Code remote was blocked with a 403 and there was no SSH. I tried localtunnel, then settled on Flask behind a pyngrok tunnel. The blocker was that Flask's app.run() holds the notebook cell, so the tunnel cell never executed. Starting Flask in a background thread fixed it. I verified each stage with a /ping route curled from the Mac before adding the actual captioning endpoint."
        },
        {
          title: "GraphRecursionError after about six loops",
          body: "The first full run stopped with a recursion limit of 25. Each pass runs four nodes, so the default budget allows roughly six cycles before LangGraph considers it runaway. Raising the limit to 100 got me to about 25 loops, around three minutes. That is a ceiling moved, not removed. The loop probably belongs outside the graph entirely, with the graph handling one pass."
        }
      ],

      scope: "Solo project, built over about a week. Working: capture, remote captioning, SQLite caption log, the LangGraph loop, and both alert paths. Not built, despite being scoped: LLM-based reasoning (the reasoning node is keyword matching), pattern detection over time (memory is stored and loaded into state but the reasoning step only reads the current caption), MediaPipe pose, and vector-database memory. There is no retry handling, so a failed request or an unreadable frame stops the loop."
    },

    {
      id: "linkcare",
      domain: "Software · Full-Stack",
      title: "LinkCare",
      subtitle: "Patient support platform · HackIllinois 2026, team of 4",
      year: "March 2026",
      award: "Best Use of Actian VectorAI DB · 3rd Place",
      hook: "Connects patients with a new diagnosis to people who have been through the same thing, and to the doctors those people actually trusted.",
      stack: ["Next.js", "React", "FastAPI", "Gemini", "Actian VectorAI", "Whisper", "Modal", "Docker"],
      media: "assets/linkcare-team.jpg",
      repo: "",
      reportUrl: "https://devpost.com/software/linkcare-2fj4ya",
      reportLabel: "See the Devpost",

      problem: "We built this after a family member got an unexpected diagnosis. What was missing was not medical information, it was the people: nobody at the same stage to talk to, and no trustworthy way to find a specialist other than a search engine. The hard part is matching, because two patients describing the same condition rarely use the same words.",

      built: "Patients describe their condition by voice. Whisper transcribes it on a Modal T4 GPU, Gemini turns the transcript into a 3072-dimensional embedding, and Actian VectorAI retrieves semantically similar patients using HNSW indexing. From there the platform surfaces peers at a comparable stage and the specialists those peers rated well. A three-agent consensus engine produces the recommendation, and a Next.js front end talks to a FastAPI bridge.",

      architecture: [
        "voice input",
        "Whisper (Modal GPU)",
        "Gemini embedding",
        "VectorAI / HNSW",
        "3-agent consensus",
        "peer + doctor match"
      ],
      architectureNote: "The multi-agent layer exists for trust rather than accuracy. A single model handing down a confident answer reads as a black box; three agents that disagree and show their reasoning let the patient judge the recommendation for themselves.",

      results: [
        { label: "Best Use of Actian VectorAI DB", value: "3rd Place", note: "HackIllinois 2026" },
        { label: "Embedding dimension", value: "3072", note: "Gemini, HNSW-indexed" },
        { label: "Team", value: "4", note: "built in one weekend" }
      ],

      challenges: [
        {
          title: "The emotion-recognition SDK did not work",
          body: "The original plan used the PreSage SDK for facial emotion recognition as the input modality. It turned out to be incompatible with our stack partway through the build. We pivoted to voice: Whisper transcription ended up being both more reliable and a better fit, since describing a diagnosis out loud is more natural than being watched by a camera."
        },
        {
          title: "Audio broke between local and serverless",
          body: "Audio behaved differently on a laptop than it did in the serverless GPU environment, so clips that transcribed cleanly in development failed once deployed to Modal. Getting transcription reliable meant reconciling the two environments rather than trusting local results."
        }
      ],

      scope: "Built over one weekend at HackIllinois 2026 with Anish Mehta, Tanish Mittal and Sam Tewari.",

      gallery: [
        { src: "assets/linkcare-award.jpg", caption: "Best Use of Actian VectorAI DB, 3rd place, HackIllinois 2026" }
      ]
    },

    {
      id: "bracket-bot",
      domain: "Robotics · ML",
      wip: true,
      title: "Bracket Bot",
      subtitle: "Robot learning · UIUC ACM SIGRobotics",
      year: "Dec 2025 – Present",
      hook: "Team project on visual world models for robot manipulation. I am currently working on the imitation-learning side, collecting teleoperated demonstrations for dual-arm cloth folding.",
      stack: ["PyTorch", "CUDA", "SO-100 arms", "Contrastive Learning"],
      media: "assets/bracket-bot.gif",
      repo: "",

      problem: "Manipulation planning usually depends on labeled state data: where objects are, what the joint angles should be, what counts as success. Labeling that by hand does not scale. The alternative is to let the robot learn a compressed visual representation of its own environment and plan inside that representation instead.",

      built: "The group's world model compresses camera frames into a latent space using a convolutional encoder-decoder, with a contrastive objective that keeps the representation from collapsing. A separate dynamics model predicts the next latent state from the current one plus a control input, so future visual states can be rolled out before committing to a motion. I am working on the imitation-learning half: running teleoperated demonstrations on dual SO-100 arms to collect data for a cloth-folding policy.",

      architecture: [
        "camera frames",
        "encoder",
        "latent representation",
        "dynamics model",
        "predicted next state"
      ],
      architectureNote: "The contrastive objective is what makes the rest viable. Without it the encoder finds a degenerate solution, mapping every frame to the same point, which satisfies reconstruction while leaving the dynamics model with nothing to learn from.",

      scope: "Ongoing group project at UIUC ACM SIGRobotics. The world model is a collaborative effort across several contributors. My current focus is teleoperated data collection on the SO-100 arms and the cloth-folding policy, which is still in progress."
    }
  ],

  /* --- Experience -------------------------------------------------------- */
  experience: [
    {
      company: "Trainify Labs",
      role: "Computer Vision Intern",
      dates: "May 2026 – Present",
      bullets: [
        "Work on the on-device computer-vision pipeline for an iOS sports-training app, including model conversion for real-time inference on the Apple Neural Engine.",
        "Investigated multi-person tracking accuracy, benchmarking several identity-matching approaches against recorded footage and documenting which ones measurably improved results."
      ]
    },
    {
      company: "SecuraAI",
      role: "Lead Software Engineering Intern",
      dates: "May 2026 – Aug 2026",
      bullets: [
        "Led a team of interns through the full development lifecycle of a Python CLI framework for testing vision model reliability across providers.",
        "Root-caused a model failure to a vision-encoder downsampling threshold rather than model behavior, then validated the fix via controlled replay against archived data."
      ]
    },
    {
      company: "Eco Illini Supermileage",
      role: "Electrical Team, Motor Controller PCB",
      dates: "Aug 2026 – Present",
      bullets: [
        "Joined the sub-team designing a custom BLDC motor controller PCB in KiCad, working alongside the firmware team."
      ]
    },
    {
      company: "First Tech Challenge",
      role: "Hardware Team Lead",
      dates: "Aug 2021 – Mar 2025",
      bullets: [
        "Engineered a robotic intake and delivery system with custom gear ratios and 3D-printed parts, cutting cycle time 60% and reaching World Semi-Finals.",
        "Integrated encoder and gyroscope feedback into closed-loop control for real-time field positioning."
      ]
    }
  ],

  /* --- Skills ------------------------------------------------------------ */
  skills: [
    {
      group: "Software",
      items: ["Python", "C", "Java", "LangGraph", "Flask", "FastAPI", "SQLite", "Git"]
    },
    {
      group: "ML & Perception",
      items: ["PyTorch", "OpenCV", "YOLO", "CoreML", "Vision-Language Models", "Self-Supervised Learning", "On-Device Inference"]
    },
    {
      group: "Electrical & Embedded",
      items: ["Analog Circuit Design", "555 Timers / Comparators", "Digital Logic / FSM Design", "Sensor Interfacing", "Oscilloscope Debugging", "Soldering", "Analog Signal Processing"]
    },
    {
      group: "Robotics",
      items: ["Closed-Loop Control", "Sensor Integration", "Imitation Learning", "World Models", "Fusion360 (CAD)"]
    }
  ],

  /* --- About ------------------------------------------------------------- */
  // Worth rewriting in your own voice when you get a minute.
  about: "I study electrical and computer engineering at UIUC. I got here through years of competitive robotics, where I learned that the interesting problems live at the seam between hardware and software, where a clean control signal meets a noisy sensor. That now spans analog and digital design, computer vision and ML, and robot learning. Outside of class I am usually breadboarding something or building a model.",

  // Footer line
  footer: ""
};
