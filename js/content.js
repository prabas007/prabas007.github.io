/* ============================================================================
   CONTENT — This is the only file you need to edit to change site text.
   Anything marked [PLACEHOLDER] is made up or missing. Replace it.
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
  resume: "assets/resume.pdf",            // [PLACEHOLDER] drop your PDF at assets/resume.pdf

  // [PLACEHOLDER] drop a square-ish photo at assets/photo.jpg
  photo: "assets/photo.jpg",
  photoAlt: "Praneel Baskar",

  /* --- Projects ---------------------------------------------------------- */
  /* Order here = order on the page. Each gets a card + a detail page.       */
  projects: [
    {
      id: "visual-agent",
      domain: "Software · ML",
      title: "Visual Agent",
      subtitle: "Agentic computer-vision system",
      year: "2026",
      // One line on the card. Make it concrete.
      hook: "A webcam agent that watches for patterns over time, not single frames, and decides on its own when to intervene.",
      stack: ["Python", "LangGraph", "Qwen2-VL-7B", "OpenCV", "PyTorch", "Flask", "SQLite"],
      // [PLACEHOLDER] 5-10s screen recording as a .gif or .mp4 in assets/
      media: "assets/visual-agent.gif",
      repo: "",                            // [PLACEHOLDER] repo URL, or leave "" to hide the link

      problem: "Most computer-vision tools fire on a single frame. They see a phone in your hand and alert immediately, which means constant false positives and no sense of context. I wanted a system that understood behavior across time: not 'you are slouching' but 'you have been slouching for ten minutes.'",

      built: "A continuous perceive, remember, reason, act loop. OpenCV captures a frame every five seconds and sends it to a vision-language model for captioning. Captions land in a timestamped store that the agent can query by time window. A reasoning step then looks at the current caption plus recent history and decides whether anything is worth acting on, and which tool to use.",

      // Architecture diagram: list of nodes rendered as a flow.
      architecture: [
        "capture_frame",
        "get_caption",
        "check_memory",
        "reason",
        "act"
      ],
      architectureNote: "Implemented as an explicit LangGraph state machine. The reason node uses an LLM rather than keyword matching, so it can weigh caption text against memory context instead of pattern-matching strings.",

      results: [
        { label: "Build time", value: "3 days", note: "against a 7-day plan" },
        { label: "Frame interval", value: "~5s", note: "continuous capture loop" },
        { label: "Model", value: "Qwen2-VL-7B", note: "fp16 on remote H100" }
      ],

      // The strongest section. What actually broke.
      challenges: [
        {
          title: "University firewall blocked the GPU",
          body: "The model needed an H100 that I could not reach directly from my laptop. I put Flask on the GPU box in a background thread and exposed it through an ngrok tunnel, then streamed base64-encoded JPEG frames over HTTP. The model loads once at server startup rather than per request, so inference stays fast."
        },
        {
          title: "False-positive phone detection",
          body: "The captioner would describe a frame as 'not holding a phone' and my downstream check matched on the substring 'holding a phone.' Added a negation guard in the reasoning step so the agent reads the caption semantically instead of by keyword."
        },
        {
          title: "Posture detection was unreliable",
          body: "Generic prompts produced vague captions that could not distinguish good posture from bad. Rewrote the prompt to ask about specific anatomical cues, spine curve and shoulder position, which made captions consistent enough to reason over."
        }
      ],

      // Things you deliberately did not do. Shows judgment.
      scope: "Pose estimation via MediaPipe, a vector database for long-term memory, and a multi-agent split were all scoped and deliberately deferred. The single-agent loop was enough to prove the idea."
    },

    {
      id: "bracket-bot",
      domain: "Robotics · ML",
      title: "Bracket Bot",
      subtitle: "Self-supervised world model + imitation learning · UIUC SIGRobotics",
      year: "Dec 2025 – Present",
      hook: "Teaching a robot to imagine what it will see next, so it can plan manipulation without ground-truth labels.",
      stack: ["PyTorch", "CUDA", "SO-100 arms", "AprilTag", "InfoNCE"],
      media: "assets/bracket-bot.gif",     // [PLACEHOLDER]
      repo: "",                            // [PLACEHOLDER]

      problem: "Robot manipulation planning usually needs labeled state data: where the objects are, what the joint angles should be, what counts as success. That labeling does not scale. The alternative is to let the robot learn a compressed model of its own visual world and plan inside that representation instead.",

      built: "A convolutional encoder-decoder with residual blocks that compresses 480x640 camera frames into a 4x60x80 latent space, trained with InfoNCE contrastive loss to keep the representation from collapsing. On top of that, a temporal dynamics MLP takes the current latent state plus a 6-DOF control input and predicts the next latent state, which lets the robot roll out imagined trajectories before committing to a motion.",

      architecture: [
        "camera frames",
        "conv encoder",
        "latent 4x60x80",
        "dynamics MLP",
        "predicted next state"
      ],
      architectureNote: "Contrastive loss structures the embedding space so that visually similar states sit close together. Without it the encoder collapses to a constant and the dynamics model learns nothing.",

      results: [
        { label: "Input", value: "480x640", note: "raw camera frames" },
        { label: "Latent", value: "4x60x80", note: "compressed representation" },
        { label: "Control", value: "6-DOF", note: "conditioning input" }
      ],

      challenges: [
        {
          title: "Representational collapse",
          body: "[PLACEHOLDER — describe what you actually saw. Early training drove all latents toward the same vector, so reconstruction looked fine but the dynamics model had no signal to learn from. InfoNCE contrastive loss fixed it by forcing distinct states apart in the embedding space.]"
        },
        {
          title: "Imitation learning on physical arms",
          body: "[PLACEHOLDER — currently training a policy on teleoperated demonstrations to fold cloth with dual SO-100 arms. Write what you have hit so far: demonstration quality, distribution shift, compounding error, whatever is actually the hard part.]"
        }
      ],

      scope: "Ongoing. The world model side is working; the imitation-learning policy for cloth folding is in progress this semester."
    },

    {
      id: "trainify",
      domain: "Software · ML",
      title: "On-Device Pose Pipeline",
      subtitle: "Computer Vision Intern · Trainify Labs",
      year: "May 2026 – Present",
      hook: "Shipped a basketball form-tracking model onto the Apple Neural Engine, then fixed the tracking bug that made it unusable with more than one person on court.",
      stack: ["PyTorch", "YOLO", "CoreML", "Apple Neural Engine", "OpenCV"],
      media: "assets/trainify.gif",        // [PLACEHOLDER]
      repo: "",                            // private, likely leave empty

      problem: "A phone camera watching a basketball player needs to track shots and body form in real time, on device, with no server round trip. Two hard constraints: the model has to be small and fast enough for the Neural Engine, and it has to hold onto the right person when other people walk through frame.",

      built: "An end-to-end training pipeline on rented cloud GPUs that fine-tunes a YOLO-based pose-detection model, then converts and deploys it through CoreML for real-time inference on the Apple Neural Engine. Downstream, a trajectory state machine turns raw pose output into live form feedback in the app.",

      architecture: [
        "camera feed",
        "YOLO pose model",
        "CoreML / ANE",
        "trajectory state machine",
        "live user feedback"
      ],
      architectureNote: "Everything runs on device. No network round trip, which is what makes the feedback feel instant.",

      results: [
        { label: "Inference", value: "On-device", note: "Apple Neural Engine" },
        { label: "Tracking", value: "Fixed", note: "stable through occlusion" }
      ],

      challenges: [
        {
          title: "Multi-person tracking identity swap",
          body: "The tracker picked the highest-confidence person every single frame instead of maintaining identity, so whenever a second person entered the frame the system silently switched targets mid-shot. I replaced confidence-based matching with appearance-based re-identification: on first lock the system stores a torso color histogram for the tracked person, then matches against that histogram on subsequent frames rather than raw detection confidence. Tracking stayed stable through occlusion and through new people entering frame, validated against clips that had previously failed."
        },
        {
          title: "Evaluating on gameplay, not benchmarks",
          body: "[PLACEHOLDER — you mentioned tying evaluation metrics to real gameplay performance rather than standard training metrics, and running comparative accuracy analysis across camera angles. Write a few lines on what that looked like.]"
        }
      ],

      scope: ""
    },

    {
      id: "drivesafe",
      domain: "Hardware · Embedded",
      title: "DriveSafe",
      subtitle: "Speed-adaptive driver distraction detector · ECE 145, team of 3",
      year: "Jan – May 2026",
      award: "Most Commercializable Award",     // shows as a badge
      hook: "A driver-distraction system built entirely from discrete logic. No microcontroller, no firmware, just 555 timers, comparators, flip-flops and a finite state machine that gets less forgiving the faster you drive.",
      stack: ["555 Timers", "LM311", "CD4029", "74LS153", "74LS74", "CD40106", "HC-SR04", "FSRs"],
      media: "assets/drivesafe.gif",            // [PLACEHOLDER]
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

      // [PLACEHOLDER] Add figure images from the report. Drop files in assets/
      // and fill in real captions. Delete any rows you do not want shown.
      gallery: [
        { src: "assets/drivesafe-wheel.jpg",  caption: "[PLACEHOLDER] Final wheel with FSRs at 10 and 2, tilt potentiometer on the axle, buzzer on the center bridge" },
        { src: "assets/drivesafe-fsm.jpg",    caption: "[PLACEHOLDER] Full FSM implementation on breadboard" },
        { src: "assets/drivesafe-scope.jpg",  caption: "[PLACEHOLDER] Oscilloscope capture: SOFT_FAULT vs SOFT_FAULT_SYNCED" },
        { src: "assets/drivesafe-award.jpg",  caption: "[PLACEHOLDER] Most Commercializable award" }
      ],

      scope: "Course project for ECE 145 with Soham and Sanjit. I owned the FSR hand-detection subcircuit, the tilt detection design, and shared work on the ultrasonic path and final integration. Known limits: wiring organization made debugging harder than it needed to be, and the intended 3D-printed housing was dropped when the ordered wheel never arrived."
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
      media: "assets/linkcare.gif",             // [PLACEHOLDER]
      repo: "",                                  // [PLACEHOLDER] if public
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
          body: "Audio processing behaved differently on a laptop than it did on the serverless GPU environment, so clips that transcribed cleanly in development failed once deployed to Modal. [PLACEHOLDER — add what the actual difference was, sample rate or encoding or file handling, and how you pinned it down.]"
        },
        {
          title: "Vector search needed real tuning",
          body: "[PLACEHOLDER — the Devpost notes the vector database took significant configuration and debugging. Write what specifically: index parameters, embedding normalization, retrieval quality, whatever it actually was.]"
        }
      ],

      scope: "[PLACEHOLDER — say which parts you personally owned. Built with Anish Mehta, Tanish Mittal and Sam Tewari at HackIllinois 2026.]",

      gallery: [
        { src: "assets/linkcare-award.jpg", caption: "[PLACEHOLDER] Accepting the Actian VectorAI award at HackIllinois 2026" },
        { src: "assets/linkcare-ui.jpg",    caption: "[PLACEHOLDER] Peer matching view" }
      ]
    }
  ],

  /* --- Experience -------------------------------------------------------- */
  experience: [
    {
      company: "Trainify Labs",
      role: "Computer Vision Intern",
      dates: "May 2026 – Present",
      bullets: [
        "Built an end-to-end training pipeline on cloud GPUs and deployed a pose-detection model through CoreML for real-time on-device inference.",
        "Diagnosed and fixed a multi-person tracking failure by replacing confidence-based identity matching with appearance-based re-identification."
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
  // [PLACEHOLDER] Rewrite this in your own voice. 3-4 sentences.
  about: "I study electrical and computer engineering at UIUC. I got here through years of competitive robotics, where I learned that the interesting problems live at the seam between hardware and software, where a clean control signal meets a noisy sensor. That now spans analog and digital design, computer vision and ML, and robot learning. Outside of class I am usually breadboarding something or building a model.",

  // Footer line
  footer: "Built from scratch. No template."
};
