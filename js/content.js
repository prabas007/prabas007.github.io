/* ============================================================================
   CONTENT — This is the only file you need to edit to change site text.
   Anything marked [PLACEHOLDER] is made up or missing. Replace it.
   ============================================================================ */

const CONTENT = {

  /* --- Basics ------------------------------------------------------------ */
  name: "Praneel Baskar",

  // The one line that defines you. Shows directly under your name.
  tagline: "Electrical engineer building robots that see, decide, and act.",

  // Second line, smaller. Current status.
  status: "EE @ UIUC '28 · robotics, perception, embedded systems",

  // Hero paragraph. 2-3 sentences, first person, your actual voice.
  intro: "I work the whole stack of a robot, from 555 timers and sensor calibration up through imitation-learning policies and on-device inference. Most of what I build starts as a circuit on a breadboard and ends as a model running in real time.",

  email: "praneelbaskar@gmail.com",
  github: "https://github.com/prabas007",
  linkedin: "https://www.linkedin.com/in/praneel-baskar",
  resume: "assets/resume.pdf",            // [PLACEHOLDER] drop your PDF at assets/resume.pdf

  // [PLACEHOLDER] drop a square-ish photo at assets/photo.jpg
  photo: "assets/photo.jpg",
  photoAlt: "Praneel Baskar",

  /* --- Projects ---------------------------------------------------------- */
  /* Order here = order on the page. Each gets a card + a detail page.       */
  projects: [
    {
      id: "visual-agent",
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
      title: "DriveSafe",
      subtitle: "Multi-sensor driver safety system",
      year: "Jan 2026 – Present",
      hook: "A finite state machine running on real analog hardware that detects driver distraction at 98% accuracy.",
      stack: ["555 Timer ICs", "Logic Gates", "FSRs", "Ultrasonic", "FSM"],
      media: "assets/drivesafe.gif",       // [PLACEHOLDER]
      repo: "",                            // [PLACEHOLDER]

      problem: "Detecting whether a driver is distracted means fusing several unreliable signals: is their hand on the wheel, where is their head, how close are they to the wheel. Each sensor is noisy and none of them is conclusive alone.",

      built: "A finite state machine that fuses force-sensing resistors, ultrasonic ranging, and a potentiometer into manual and visual distraction states. The FSRs are strongly nonlinear, so I calibrated them with inverse power law modeling to reliably distinguish grip states from noise. Distance sensing is done in hardware: 555 timer ICs and logic gates convert ultrasonic trigger and echo timing into usable distance data, with debounce logic tuned on the bench to reject close-range noise.",

      architecture: [
        "FSR / ultrasonic / potentiometer",
        "555 timer + gate logic",
        "debounce",
        "FSM state eval",
        "distraction alert"
      ],
      architectureNote: "Signal conditioning happens in analog hardware before anything reaches the state machine, so the FSM sees clean transitions rather than noisy edges.",

      results: [
        { label: "Detection accuracy", value: "98%", note: "across tested distraction scenarios" },
        { label: "Sensors fused", value: "3", note: "FSR, ultrasonic, potentiometer" }
      ],

      challenges: [
        {
          title: "Nonlinear force sensors",
          body: "FSR resistance does not scale linearly with applied force, so a naive threshold could not tell a light grip from a hand resting on the wheel. Modeling the response with an inverse power law gave a mapping that held up across the grip range."
        },
        {
          title: "Ultrasonic noise at close range",
          body: "Echo timing became unreliable within a few inches of the sensor, producing phantom readings. Tuned debounce logic through iterative bench testing with a scope until the false transitions disappeared."
        }
      ],

      scope: ""
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
      group: "Hardware & Controls",
      items: ["Circuit Design", "555 Timers / Logic Gates", "FSM Logic", "Sensor Integration", "Analog Signal Processing", "Closed-Loop Control", "Fusion360"]
    },
    {
      group: "Perception & ML",
      items: ["PyTorch", "OpenCV", "YOLO", "CoreML", "Vision-Language Models", "Self-Supervised Learning", "Imitation Learning", "On-Device Inference"]
    },
    {
      group: "Software",
      items: ["Python", "C", "Java", "LangGraph", "Flask", "FastAPI", "SQLite", "Git"]
    }
  ],

  /* --- About ------------------------------------------------------------- */
  // [PLACEHOLDER] Rewrite this in your own voice. 3-4 sentences.
  about: "I am a sophomore studying electrical engineering at UIUC. I got here through four years of competitive robotics, where I learned that the interesting problems live at the seam between hardware and software, in the part where a clean control signal meets a noisy sensor. Right now I am most interested in robot learning: how a machine builds a useful model of its own environment and plans inside it. Outside of that I am usually breadboarding something or reading about world models.",

  // Footer line
  footer: "Built from scratch. No template."
};
