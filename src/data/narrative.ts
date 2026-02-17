import type {
  VignetteData,
  WhisperData,
  ReflectionData,
  ChoiceId,
  ChoiceDialogueData,
  MemoryShardData,
} from '@/types';

// ========================================
// Opening Cinematic
// ========================================

export const OPENING_CINEMATIC_LINES: string[] = [
  '[ SYSTEM BOOT :: STELLAR RESOLVE v1.0 ]',
  'INITIALIZING NAVIGATION CORE...',
  'LIFE SUPPORT.............. ONLINE',
  'THRUSTER ARRAY............ ONLINE',
  'MEMORY CORE............... FRAGMENTED',
  'WARNING: Emotional payload detected in navigation buffer.',
  'COURSE PLOTTED: Home.',
  '',
  'I left because I had to.',
  'Or maybe I left because staying hurt more than the vacuum outside.',
  'The stars out here look the same as the ones we watched from your roof.',
  'But nothing feels the same.',
  'The nav system says I am heading home.',
  'I think it means something deeper than coordinates.',
];

// ========================================
// Level Vignettes
// ========================================

export const LEVEL_VIGNETTES: Record<number, VignetteData> = {
  1: {
    level: 1,
    backgroundTheme: 'debris',
    lines: [
      'The wreckage drifts past like pages torn from a diary.',
      'I keep seeing shapes in the debris — a jawline, a hand, the curve of a shoulder.',
      'The ship\'s sensors say none of it is real.',
      'But I recognize every fragment.',
      'This is where it all fell apart. I guess I have to fly through it.',
    ],
  },
  2: {
    level: 2,
    backgroundTheme: 'nebula',
    lines: [
      'The nebula folds around the ship like a thought I can\'t finish.',
      'Every corridor I enter rearranges itself behind me.',
      'My own mind has become a maze, and I\'m not sure I want to find the center.',
      'The controls feel wrong. Like my hands forgot what certainty means.',
    ],
  },
  3: {
    level: 3,
    backgroundTheme: 'crystals',
    lines: [
      'The asteroid field is made of mirrors.',
      'Every surface shows me a version of myself I tried to be for someone else.',
      'The confident one. The funny one. The one who never cried.',
      'I\'m surrounded by facades, and every one of them can fight back.',
    ],
  },
  4: {
    level: 4,
    backgroundTheme: 'pulse',
    lines: [
      'I turned off the radio three jumps ago.',
      'Out here there\'s nothing. Just the hum of the engine and the sound of my own breathing.',
      'The silence isn\'t empty. It\'s full of things I\'ve been refusing to hear.',
      'Something is pulsing out there. Faint. Patient.',
      'I think it\'s been trying to reach me.',
    ],
  },
  5: {
    level: 5,
    backgroundTheme: 'bridge',
    lines: [
      'A bridge stretches between two dying stars.',
      'Half of it is missing. The rest looks like it\'s held together by stubbornness.',
      'The scanners pick up a signal — another ship, small, damaged, drifting.',
      'Someone else is out here. Someone else is lost.',
      'Do I stop? The last time I trusted someone with my coordinates, I ended up here.',
    ],
  },
  6: {
    level: 6,
    backgroundTheme: 'wreckage',
    lines: [
      'A warship. Massive. Abandoned.',
      'Its weapons are still online. I can feel them humming through the hull.',
      'There\'s a part of me that wants to take them. Become untouchable.',
      'If I\'m powerful enough, nothing can hurt me again.',
      'But power has a price. It always does.',
    ],
  },
  7: {
    level: 7,
    backgroundTheme: 'reality_wave',
    lines: [
      'Reality is coming apart at the seams.',
      'The stars stutter. Space folds in on itself like crumpled paper.',
      'I can fight it — push through by force.',
      'Or I can let go of the controls and see where the current takes me.',
      'Maybe not everything needs to be conquered.',
    ],
  },
  8: {
    level: 8,
    backgroundTheme: 'birth_light',
    lines: [
      'Stars are being born.',
      'I\'ve never seen anything like this — light erupting from nothing, color flooding the void.',
      'For the first time in what feels like forever, the universe isn\'t taking something away.',
      'It\'s giving.',
      'I forgot what that felt like.',
    ],
  },
  9: {
    level: 9,
    backgroundTheme: 'stars',
    lines: [
      'I can see the home system. A blue dot in the distance.',
      'My hands are shaking. Not from fear — from something else.',
      'Every choice I\'ve made has led to this approach vector.',
      'The nav computer is asking me to confirm the final heading.',
      'But first, there is one more stretch of sky to cross.',
    ],
  },
  10: {
    level: 10,
    backgroundTheme: 'stars',
    lines: [
      'The dream is dissolving.',
      'I can feel the edges of it peeling away, like frost on a window.',
      'Behind it, there\'s something clearer. Something that looks like morning.',
      'This was never about getting home.',
      'It was about becoming someone who could arrive.',
    ],
  },
};

// ========================================
// Whispers (mid-level floating text)
// ========================================

export const WHISPERS: Record<string, WhisperData> = {
  // Level 1 - Denial / Echoes
  l1_w1: { id: 'l1_w1', level: 1, text: 'You said forever once.', triggerCondition: 'calm' },
  l1_w2: { id: 'l1_w2', level: 1, text: 'The voicemail is still saved.', triggerCondition: 'post_wave' },
  l1_w3: { id: 'l1_w3', level: 1, text: 'Was it Tuesday or Wednesday?', triggerCondition: 'timed', delay: 20000 },
  l1_w4: { id: 'l1_w4', level: 1, text: 'Repeat. Replay. Rewind.', triggerCondition: 'calm' },
  l1_w5: { id: 'l1_w5', level: 1, text: 'The song still plays in my head.', triggerCondition: 'post_wave' },
  l1_w6: { id: 'l1_w6', level: 1, text: 'I keep checking my phone.', triggerCondition: 'timed', delay: 35000 },
  l1_w7: { id: 'l1_w7', level: 1, text: 'Did I imagine the whole thing?', triggerCondition: 'low_health' },

  // Level 2 - Confusion / Introspection
  l2_w1: { id: 'l2_w1', level: 2, text: 'Which way is forward?', triggerCondition: 'calm' },
  l2_w2: { id: 'l2_w2', level: 2, text: 'I think I\'ve been here before.', triggerCondition: 'post_wave' },
  l2_w3: { id: 'l2_w3', level: 2, text: 'My thoughts are louder than the engines.', triggerCondition: 'timed', delay: 22000 },
  l2_w4: { id: 'l2_w4', level: 2, text: 'The walls keep moving.', triggerCondition: 'calm' },
  l2_w5: { id: 'l2_w5', level: 2, text: 'Every answer leads to another question.', triggerCondition: 'post_wave' },
  l2_w6: { id: 'l2_w6', level: 2, text: 'Breathe. Just breathe.', triggerCondition: 'low_health' },
  l2_w7: { id: 'l2_w7', level: 2, text: 'I don\'t recognize myself here.', triggerCondition: 'timed', delay: 40000 },

  // Level 3 - Self-image / Facades
  l3_w1: { id: 'l3_w1', level: 3, text: 'Who was I before you?', triggerCondition: 'calm' },
  l3_w2: { id: 'l3_w2', level: 3, text: 'They liked the version, not the person.', triggerCondition: 'post_wave' },
  l3_w3: { id: 'l3_w3', level: 3, text: 'Every mirror shows a stranger.', triggerCondition: 'timed', delay: 25000 },
  l3_w4: { id: 'l3_w4', level: 3, text: 'Performing confidence is exhausting.', triggerCondition: 'calm' },
  l3_w5: { id: 'l3_w5', level: 3, text: 'What if they see the real me?', triggerCondition: 'low_health' },
  l3_w6: { id: 'l3_w6', level: 3, text: 'The applause echoes in empty rooms.', triggerCondition: 'post_wave' },

  // Level 4 - Listening / Silence
  l4_w1: { id: 'l4_w1', level: 4, text: '...', triggerCondition: 'calm' },
  l4_w2: { id: 'l4_w2', level: 4, text: 'Listen.', triggerCondition: 'post_wave' },
  l4_w3: { id: 'l4_w3', level: 4, text: 'The quiet has a voice.', triggerCondition: 'timed', delay: 30000 },
  l4_w4: { id: 'l4_w4', level: 4, text: 'I hear it now.', triggerCondition: 'calm' },
  l4_w5: { id: 'l4_w5', level: 4, text: 'Silence is not emptiness.', triggerCondition: 'post_wave' },
  l4_w6: { id: 'l4_w6', level: 4, text: 'My heartbeat. Still here.', triggerCondition: 'low_health' },

  // Level 5 - Trust / Boundaries
  l5_w1: { id: 'l5_w1', level: 5, text: 'Trust is a bridge you build twice.', triggerCondition: 'calm' },
  l5_w2: { id: 'l5_w2', level: 5, text: 'The signal is weak but steady.', triggerCondition: 'post_wave' },
  l5_w3: { id: 'l5_w3', level: 5, text: 'Not everyone who drifts is lost.', triggerCondition: 'timed', delay: 25000 },
  l5_w4: { id: 'l5_w4', level: 5, text: 'I was afraid to reach out.', triggerCondition: 'calm' },
  l5_w5: { id: 'l5_w5', level: 5, text: 'Some bridges are worth rebuilding.', triggerCondition: 'post_wave' },
  l5_w6: { id: 'l5_w6', level: 5, text: 'Walls keep out more than pain.', triggerCondition: 'low_health' },

  // Level 6 - Ego / Power
  l6_w1: { id: 'l6_w1', level: 6, text: 'Power feels like armor.', triggerCondition: 'calm' },
  l6_w2: { id: 'l6_w2', level: 6, text: 'The weapon hums. My shield drops.', triggerCondition: 'post_wave' },
  l6_w3: { id: 'l6_w3', level: 6, text: 'Am I strong or just loud?', triggerCondition: 'timed', delay: 20000 },
  l6_w4: { id: 'l6_w4', level: 6, text: 'Invincibility is a lonely place.', triggerCondition: 'calm' },
  l6_w5: { id: 'l6_w5', level: 6, text: 'I wanted them to miss me.', triggerCondition: 'post_wave' },
  l6_w6: { id: 'l6_w6', level: 6, text: 'The ego devours what it claims to protect.', triggerCondition: 'low_health' },

  // Level 7 - Chaos / Acceptance
  l7_w1: { id: 'l7_w1', level: 7, text: 'The current doesn\'t care about my plans.', triggerCondition: 'calm' },
  l7_w2: { id: 'l7_w2', level: 7, text: 'Reality bends. I bend with it.', triggerCondition: 'post_wave' },
  l7_w3: { id: 'l7_w3', level: 7, text: 'Control was always an illusion.', triggerCondition: 'timed', delay: 25000 },
  l7_w4: { id: 'l7_w4', level: 7, text: 'What if I just... let go?', triggerCondition: 'calm' },
  l7_w5: { id: 'l7_w5', level: 7, text: 'The chaos has a rhythm.', triggerCondition: 'post_wave' },
  l7_w6: { id: 'l7_w6', level: 7, text: 'Surrender is not defeat.', triggerCondition: 'low_health' },

  // Level 8 - Growth / Hope
  l8_w1: { id: 'l8_w1', level: 8, text: 'Something new is growing here.', triggerCondition: 'calm' },
  l8_w2: { id: 'l8_w2', level: 8, text: 'The light doesn\'t burn. It warms.', triggerCondition: 'post_wave' },
  l8_w3: { id: 'l8_w3', level: 8, text: 'I didn\'t know I could still feel this.', triggerCondition: 'timed', delay: 20000 },
  l8_w4: { id: 'l8_w4', level: 8, text: 'Change isn\'t loss. It\'s movement.', triggerCondition: 'calm' },
  l8_w5: { id: 'l8_w5', level: 8, text: 'Stars are born from collapse.', triggerCondition: 'post_wave' },
  l8_w6: { id: 'l8_w6', level: 8, text: 'I am not what happened to me.', triggerCondition: 'low_health' },

  // Level 9 - Agency / Fate
  l9_w1: { id: 'l9_w1', level: 9, text: 'The heading is mine to choose.', triggerCondition: 'calm' },
  l9_w2: { id: 'l9_w2', level: 9, text: 'Every scar is a decision I survived.', triggerCondition: 'post_wave' },
  l9_w3: { id: 'l9_w3', level: 9, text: 'Home is closer than it looks.', triggerCondition: 'timed', delay: 25000 },
  l9_w4: { id: 'l9_w4', level: 9, text: 'I am the captain of this.', triggerCondition: 'calm' },
  l9_w5: { id: 'l9_w5', level: 9, text: 'Mercy takes more strength than destruction.', triggerCondition: 'post_wave' },
  l9_w6: { id: 'l9_w6', level: 9, text: 'The fork in the road is the road.', triggerCondition: 'low_health' },

  // Level 10 - Resolution / Homecoming
  l10_w1: { id: 'l10_w1', level: 10, text: 'The dream is thinning.', triggerCondition: 'calm' },
  l10_w2: { id: 'l10_w2', level: 10, text: 'I can see daylight through the cracks.', triggerCondition: 'post_wave' },
  l10_w3: { id: 'l10_w3', level: 10, text: 'This was always about me, wasn\'t it?', triggerCondition: 'timed', delay: 20000 },
  l10_w4: { id: 'l10_w4', level: 10, text: 'I am arriving.', triggerCondition: 'calm' },
  l10_w5: { id: 'l10_w5', level: 10, text: 'The weight is lifting.', triggerCondition: 'post_wave' },
  l10_w6: { id: 'l10_w6', level: 10, text: 'I was never lost. I was in transit.', triggerCondition: 'low_health' },
  l10_w7: { id: 'l10_w7', level: 10, text: 'Let it go. Let it go. Let it go.', triggerCondition: 'timed', delay: 40000 },
};

// ========================================
// End-Level Reflections
// ========================================

export const REFLECTIONS: Record<number, ReflectionData> = {
  1: {
    level: 1,
    defaultText: 'I thought I was moving forward... but I kept reliving the same goodbye. The debris is behind me now. I don\'t have to keep collecting the pieces.',
    variants: {
      compassionate: 'I thought I was moving forward... but I kept reliving the same goodbye. Maybe that\'s okay. Grieving is just love with nowhere left to go.',
      aggressive: 'I thought I was moving forward... but I was stuck in a loop. I blasted through the wreckage. I won\'t be gentle with ghosts.',
      balanced: 'I thought I was moving forward... but I kept reliving the same goodbye. The debris is behind me now. I don\'t have to keep collecting the pieces.',
    },
  },
  2: {
    level: 2,
    defaultText: 'My thoughts feel like a place I don\'t know how to survive. But I made it through the maze. The fog lifts when you stop running from it.',
    variants: {
      compassionate: 'My thoughts feel like a place I don\'t know how to survive. But I sat with them instead of fighting, and the corridors opened up.',
      aggressive: 'My thoughts feel like a place I don\'t know how to survive. So I carved my own way through. The maze doesn\'t get to keep me.',
      balanced: 'My thoughts feel like a place I don\'t know how to survive. But I made it through the maze. The fog lifts when you stop running from it.',
    },
  },
  3: {
    level: 3,
    defaultText: 'Was I trying to be loved... or just approved? The mirrors are broken now. What\'s left is something unpolished, unperformed. Mine.',
    variants: {
      compassionate: 'Was I trying to be loved... or just approved? I held each reflection gently before letting it shatter. The real me was hiding behind them all.',
      aggressive: 'Was I trying to be loved... or just approved? I smashed every mirror. I\'m done being a performance. Whatever\'s underneath is enough.',
      balanced: 'Was I trying to be loved... or just approved? The mirrors are broken now. What\'s left is something unpolished, unperformed. Mine.',
    },
  },
  4: {
    level: 4,
    defaultText: 'The noise faded. My own voice remained. I\'d been so afraid of the silence that I never heard what it was trying to say.',
    variants: {
      compassionate: 'The noise faded. My own voice remained. It was gentler than I expected. It said: you are here, and that is enough.',
      aggressive: 'The noise faded. My own voice remained. Louder than I thought. Clearer. It said: stop waiting for permission to exist.',
      balanced: 'The noise faded. My own voice remained. I\'d been so afraid of the silence that I never heard what it was trying to say.',
    },
  },
  5: {
    level: 5,
    defaultText: 'Trust is not blindness. It is selection. The bridge held. Maybe not all of it — but enough to cross.',
    variants: {
      compassionate: 'Trust is not blindness. It is courage. I reached out, and someone reached back. The bridge held because we both chose to step onto it.',
      aggressive: 'Trust is not blindness. It is calculation. I chose carefully, and I moved forward. The bridge held because I tested it first.',
      balanced: 'Trust is not blindness. It is selection. The bridge held. Maybe not all of it — but enough to cross.',
    },
  },
  6: {
    level: 6,
    defaultText: 'I mistook attention for importance. The weapon was powerful, but it ate me alive. Real strength doesn\'t come from what you can destroy.',
    variants: {
      compassionate: 'I mistook attention for importance. The power felt good until I realized it was hollowing me out. I put the weapon down. That was the bravest thing I\'ve done.',
      aggressive: 'I mistook attention for importance. The weapon was intoxicating, but every shot cost me something I couldn\'t get back. Even I know when to stop.',
      balanced: 'I mistook attention for importance. The weapon was powerful, but it ate me alive. Real strength doesn\'t come from what you can destroy.',
    },
  },
  7: {
    level: 7,
    defaultText: 'The current took me somewhere I wouldn\'t have chosen. And it was exactly where I needed to be.',
    variants: {
      compassionate: 'I stopped fighting the current. It carried me through the chaos with a tenderness I didn\'t expect. Sometimes the river knows the way.',
      aggressive: 'I fought the current with everything I had. I didn\'t end up where it wanted me — I ended up where I chose. The chaos bent around me.',
      balanced: 'The current took me somewhere I wouldn\'t have chosen. And it was exactly where I needed to be.',
    },
  },
  8: {
    level: 8,
    defaultText: 'Change stopped feeling like loss. For the first time, something is growing instead of breaking. I think this is what hope feels like when it\'s real.',
    variants: {
      compassionate: 'Change stopped feeling like loss. The new stars reminded me that collapse is just the beginning of something luminous. I am collapsing into light.',
      aggressive: 'Change stopped feeling like loss. I grabbed every boost, every surge of power, and I felt alive. Not invincible — alive. There\'s a difference.',
      balanced: 'Change stopped feeling like loss. For the first time, something is growing instead of breaking. I think this is what hope feels like when it\'s real.',
    },
  },
  9: {
    level: 9,
    defaultText: 'I am not a passenger in my own life. The heading is mine. The choices were mine. And whatever comes next — that\'s mine too.',
    variants: {
      compassionate: 'I chose mercy when I could have chosen revenge. I chose risk when I could have chosen safety. And I would choose it all again.',
      aggressive: 'I chose strength. I chose directness. I carved my own path through the final stretch. No one hands you your fate — you take it.',
      balanced: 'I am not a passenger in my own life. The heading is mine. The choices were mine. And whatever comes next — that\'s mine too.',
    },
  },
  10: {
    level: 10,
    defaultText: 'I was never abandoned. I was becoming. The dream is over. I am awake. And I am home.',
    variants: {
      compassionate: 'I was never abandoned. I was being shaped by everything I survived. The love, the loss, the silence, the storm — it was all becoming me.',
      aggressive: 'I was never abandoned. I was forged. Every hit, every fight, every choice made me harder and clearer. I didn\'t come home — I built one.',
      balanced: 'I was never abandoned. I was becoming. The dream is over. I am awake. And I am home.',
    },
  },
};

// ========================================
// Choice Dialogues
// ========================================

export const CHOICE_DIALOGUES: Record<ChoiceId, ChoiceDialogueData> = {
  trust_bridge: {
    prompt: 'A damaged ship drifts near the broken bridge. Its distress signal pulses weakly. You could help... or you could protect yourself and move on.',
    options: [
      {
        id: 'help',
        label: 'Reach Out',
        description: 'Approach the drifting ship. Offer aid. Risk vulnerability.',
      },
      {
        id: 'ignore',
        label: 'Keep Moving',
        description: 'The bridge is unstable enough. You can\'t save everyone.',
      },
    ],
    consequenceText: {
      help: 'You approached the vessel. Its pilot — a faint signal, barely a voice — whispered "thank you" before the channel went quiet. The bridge felt steadier afterward.',
      ignore: 'You flew past. The signal faded behind you. The bridge held, but something in your chest felt heavier. Safety has a cost too.',
    },
  },
  chaos_current: {
    prompt: 'The chaos current has measured your passage. Your approach through the shifting reality reveals your nature.',
    options: [
      {
        id: 'aggressive',
        label: 'Force of Will',
        description: 'You fought through the chaos with fire and precision.',
      },
      {
        id: 'defensive',
        label: 'Flow State',
        description: 'You moved with the current, dodging and weaving through the chaos.',
      },
    ],
    consequenceText: {
      aggressive: 'The chaos parted before your assault. You carved a path through sheer will. The reality waves straightened in your wake, impressed or afraid.',
      defensive: 'You flowed. The chaos became a dance, and you were its partner. The waves carried you through, and for a moment, turbulence felt like music.',
    },
  },
  helm_mercy: {
    prompt: 'A wounded enemy vessel blocks your path. It cannot fight. Two routes lie ahead.',
    options: [
      {
        id: 'mercy',
        label: 'Mercy',
        description: 'Spare the vessel. Navigate around it. Choose compassion over efficiency.',
      },
      {
        id: 'destruction',
        label: 'Destruction',
        description: 'Clear the path. Remove the obstacle. Choose certainty over sentiment.',
      },
    ],
    consequenceText: {
      mercy: 'You veered left, giving the crippled vessel a wide berth. As you passed, its lights flickered — a gesture of gratitude, or perhaps just a dying system. Either way, you felt lighter.',
      destruction: 'You fired. The vessel came apart silently in the vacuum. The path was clear. Your hands were steady. You told yourself it was necessary.',
    },
  },
  helm_risk: {
    prompt: 'The final stretch. Two channels lead home. One is safe but long. The other cuts through an unstable field — faster, but dangerous.',
    options: [
      {
        id: 'risk',
        label: 'Take the Risk',
        description: 'Cut through the unstable field. Trust your skills. Arrive sooner.',
      },
      {
        id: 'caution',
        label: 'Play it Safe',
        description: 'Take the longer route. Arrive whole. No unnecessary gambles.',
      },
    ],
    consequenceText: {
      risk: 'The field was brutal. Debris and energy surges from every angle. But you threaded the needle, and when you emerged, the home system was right there. Close enough to touch.',
      caution: 'The longer path was quiet. Almost peaceful. You had time to think, to breathe, to prepare yourself for what comes after arrival. Sometimes the slow way is the wise way.',
    },
  },
  homecoming: {
    prompt: 'You stand at the threshold. Behind you: every memory, every moment, every version of love you\'ve known. Ahead: something unnamed. Unwritten.',
    options: [
      {
        id: 'release',
        label: 'Release',
        description: 'Let the memories dissolve. Carry the lessons, not the weight. Step forward.',
      },
      {
        id: 'cling',
        label: 'Hold On',
        description: 'Keep every memory close. The pain and the beauty. Carry it all with you.',
      },
    ],
    consequenceText: {
      release: 'You opened your hands. The memories rose like sparks from a fire — beautiful, brief, ascending. They didn\'t disappear. They became part of the sky.',
      cling: 'You held on. Every memory, every hurt, every laugh at 2 AM. You packed it all into your chest and carried it through the door. It was heavy. It was yours.',
    },
  },
};

// ========================================
// Boss Dialogue
// ========================================

export const BOSS_DIALOGUE: Record<string, string[]> = {
  miniboss_1: [
    'You think crossing a bridge makes you brave?',
    'Trust is a crack in the armor. I\'ll show you why.',
    'Everyone you\'ve ever trusted has left. I\'m just the honest one.',
    'You\'re shaking. Good. Fear is the only truth.',
    'Still fighting? Maybe you are brave. Or maybe just stubborn.',
    'Fine. Cross your bridge. But remember — I\'ll be on the other side.',
  ],
  final_boss: [
    'Welcome home, Stark. Or is this just another dream?',
    'You can\'t outrun what made you. I AM what made you.',
    'Every heartbreak, every tear — I kept them safe. For you.',
    'Let me show you what you\'re really afraid of.',
    'You\'re stronger than I expected. But strength won\'t save you from yourself.',
    'LISTEN TO ME. You need this pain. Without it, who are you?',
    'No... you\'re letting go. Stop. STOP.',
    'Maybe... maybe you don\'t need me anymore.',
  ],
};

// ========================================
// Memory Shard Fragments
// ========================================

export const MEMORY_SHARD_FRAGMENTS: Record<number, string[]> = {
  1: [
    'The way the sunlight hit the kitchen counter at 7 AM.',
    'A playlist called "us" that I can\'t bring myself to delete.',
    'Your laugh — the real one, not the polite one.',
    'The hoodie you never asked for back.',
    'Screenshot of a 3 AM conversation that meant everything.',
    'The exact spot on the bench where we sat in silence.',
  ],
  2: [
    'I replayed the argument fourteen times looking for the moment it broke.',
    'Was it something I said, or something I couldn\'t?',
    'The feeling of typing a message and deleting it four times.',
    'A dream where everything was fine and waking up was the nightmare.',
    'I Googled "how to stop thinking about someone." It didn\'t help.',
    'The hollow sound of my own apartment at midnight.',
  ],
  3: [
    'I changed my hair because you said you liked it long.',
    'Every Instagram post was a performance directed at one viewer.',
    'I pretended to like hiking.',
    'The version of me you fell for wasn\'t really me.',
    'I laughed at jokes I didn\'t find funny because your friends were watching.',
    'Mirror check before every call. Every single one.',
  ],
  4: [
    'The first night I didn\'t check if you\'d texted.',
    'Rain on the window, and I just... listened.',
    'I heard my own heartbeat and remembered it was there.',
    'A whole afternoon with no music, no scrolling, no noise.',
    'My therapist said: "What do YOU want?" I didn\'t know.',
    'The quiet wasn\'t empty. It was waiting for me.',
  ],
  5: [
    'My friend called. I almost didn\'t answer. I\'m glad I did.',
    'They said "I\'m here" and I believed them.',
    'I told someone the truth — the whole truth — and they stayed.',
    'Trust feels like stepping onto ice and choosing not to test it first.',
    'The barista remembered my order. Small things.',
    'I let someone see me cry.',
  ],
  6: [
    'I posted a selfie hoping you\'d see it. You did. It meant nothing.',
    'The satisfaction of being right lasted about thirty seconds.',
    'I won the argument and lost the person.',
    'Power feels good until you realize you\'re alone on the throne.',
    'I blocked, unblocked, blocked again. Control is not the same as peace.',
    'Everyone told me I was handling it so well. I wasn\'t.',
  ],
  7: [
    'I missed my bus and ended up at a cafe I\'d never tried. It was perfect.',
    'Plans fell apart. What replaced them was better.',
    'I stopped gripping the steering wheel so hard.',
    'The unexpected doesn\'t have to be the enemy.',
    'I said "I don\'t know" and meant it and it felt free.',
    'The mess isn\'t permanent. It\'s just in between.',
  ],
  8: [
    'I signed up for a class I\'d always wanted to try.',
    'A stranger smiled at me and I smiled back without thinking.',
    'I cooked a meal for myself — just for myself — and it was good.',
    'The first day something made me laugh and I didn\'t feel guilty for it.',
    'I made a new playlist. It has no history.',
    'Growth looks a lot like ordinary Tuesdays.',
    'I woke up and the first thing I thought about wasn\'t you.',
  ],
  9: [
    'The road home looks different when you\'re not running.',
    'I can see who I was and who I\'m becoming at the same time.',
    'My hands are steady now.',
    'The decisions are mine. All of them. Even the wrong ones.',
    'I\'m not who I was. I\'m not sorry about it.',
    'Almost there. Almost there.',
  ],
  10: [
    'This feeling — it\'s not happiness exactly. It\'s presence.',
    'I forgive you. Not for you — for the space it opens in me.',
    'The dream is ending and I\'m not afraid.',
    'I carry what I choose to carry.',
    'Morning light through a window I chose.',
    'I am here. Right here. And that is everything.',
  ],
};

// ========================================
// Ending Sequences
// ========================================

export const ENDING_SEQUENCES: Record<string, string[]> = {
  release: [
    'I opened my hands.',
    'The memories rose — not lost, but released. Like lanterns into a dark sky.',
    'Every fight, every kiss, every 2 AM confession became starlight.',
    'The weight I\'d been carrying wasn\'t love. It was the fear of living without it.',
    'But love doesn\'t disappear when you let go. It changes shape.',
    'It becomes the strength to walk into a room alone.',
    'It becomes the courage to try again.',
    'I was never abandoned. I was becoming.',
    'The stars are behind me now.',
    'I am home.',
  ],
  cling: [
    'I held on.',
    'Every memory, every hurt, every moment of joy — I packed it into my chest and carried it through.',
    'It was heavy. God, it was heavy.',
    'But these memories aren\'t anchors. They\'re part of my hull.',
    'The pain taught me what mattered. The love taught me I could feel that much.',
    'I don\'t need to let go to move forward. I just need to stop letting it steer.',
    'I carry it all. And I walk anyway.',
    'I was never abandoned. I was becoming.',
    'The stars are behind me now.',
    'I am home.',
  ],
};
