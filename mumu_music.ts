/*
 Define a 12 note octave base
 For Microtonal mode definition, change the OCTAVEBASE and represent scales as intervallic ratios summing to OCTAVEBASE
*/

export const octavebase: number = 12

/*
 MODE & KEY DEFINITIONS
 We define Scales/Modes as an ordered array of ascending interval steps
 Example 1: [do, re, me, fa, sol, la, ti] in C Major Key -> C,D,E,F,G,A,B -> Modal Steps: [2,2,1,2,2,1]
 It is from these defined steps that we can compute a 'Key' AKA Pitches of a Mode at a given Note Base
 For microtonal scales, steps should be defined as ratios of BASEOCTAVE
 NOTE: SCALE DEGREESS USE ZERO BASED COUNTING (unlike music theory literature)
 Modes arranged by the cycle of fifths
 It'll be good to use modes with few/no avoid notes to make sure we are always sounding musical: https://en.wikipedia.org/wiki/Avoid_note
 Lydian, Pentatonic and Dorian would be great choices
*/

/*
Modes - String Indexed Mapping
*/

export const modes: { [name: string]: number[] } = {}

modes.major = [2, 2, 1, 2, 2, 2, 1] //avoid notes scale degree 3
modes.mixolydian = [2, 2, 1, 2, 2, 1, 2] //avoid notes scale degree 3
modes.dorian = [2, 1, 2, 2, 2, 1, 2] //avoid notes scale degree 5 but modern ears usually like it
modes.aeolian = [2, 1, 2, 2, 2, 2, 2] // avoid notes scale degree 5
modes.phrygian = [1, 2, 2, 2, 1, 2, 2] // avoid notes scale degree 1 & 5
modes.lydian = [2, 2, 2, 1, 2, 2, 1] // No avoid notes
modes.locrian = [1, 2, 2, 1, 2, 2, 2] // avoid notes scale degree 1

modes.mixolydian_plus_11 = [2, 2, 2, 1, 2, 1, 2] //no avoid notes
modes.melodicminor = [2, 1, 2, 2, 2, 2, 1] //no avoid notes
modes.harmonicminor = [2, 1, 2, 2, 1, 3, 1]
modes.naturalminor = [2, 1, 2, 2, 2, 2, 2]
modes.chromatic = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
modes.pentatonic = [2, 2, 3, 2, 3] // No avoid notes

export let cycle_of_fifths_modes: { [name: string]: number[] } = {}

cycle_of_fifths_modes.major = modes.major
cycle_of_fifths_modes.mixolydian = modes.mixolydian
cycle_of_fifths_modes.dorian = modes.dorian
cycle_of_fifths_modes.aeolian = modes.aeolian
cycle_of_fifths_modes.phrygian = modes.phrygian
cycle_of_fifths_modes.locrian = modes.locrian
cycle_of_fifths_modes.lydian = modes.lydian

/*
 Modes sorted by lighter to dark quality:
 https://guitarchitecture.org/2011/10/02/the-guitarchitect%E2%80%99s-guide-to-modes-part-the-circle-of-5ths-modal-interchange-and-making-the-most-of-one-pattern/
*/

/*
 Modes sorted by lighter to dark quality
 Indexed 0-7 ; Equal to grid dimensions
*/

export var light_to_dark_mode_arr = [
  modes.pentatonic,
  modes.lydian,
  modes.major,
  modes.mixolydian_plus_11,
  modes.dorian,
  modes.aeolian,
  modes.phrygian,
  modes.locrian, //could swap with melodic minor
] 

export let lighter_to_dark_modes: { [name: string]: number[] } = {}

lighter_to_dark_modes.lydian = modes.lydian
lighter_to_dark_modes.major = modes.major
lighter_to_dark_modes.mixolydian = modes.mixolydian
lighter_to_dark_modes.dorian = modes.dorian
lighter_to_dark_modes.aeolian = modes.aeolian
lighter_to_dark_modes.phrygian = modes.phrygian
lighter_to_dark_modes.locrian = modes.locrian


/*
 Current PitchClass map for the 7X7 Matrix grid emulating Guqin Fretboard. Ultimately these will be recomputed by formulas to reduce transposistions/computations
*/

export var guqin_grid_notes = [
  [0, 2, 5, 7, 9, 12, 14, 12],
  [2, 5, 7, 9, 12, 14, 12, 0],
  [5, 7, 9, 12, 14, 12, 0, 2],
  [7, 9, 12, 14, 12, 0, 2, 5],
  [9, 12, 14, 12, 0, 2, 5, 7],
  [12, 14, 12, 0, 2, 5, 7, 9],
  [14, 12, 0, 2, 5, 7, 9, 12],
  [12, 0, 2, 5, 7, 9, 12, 14],
]

// useful for computing fretboards

export function arrayRotate(arr: number[], reverse: number) {
  var copy =  arr;
  var val = copy[0]
  var x = copy.shift();
  var y = copy.push(val);
  return copy;
}

/*
 To select chord progressions that sound good, select from any 6 adjacent cells of the chord_map below. To modulate keys safely, rotate 6 adjacent cells along the cells columns. 
 The further the distance between cell sets (max-distance = 6), the more distant the chords harmonically.
 There are also modal chord changes that also sound good (in the audio demo 0, I modulated down modally by 2 steps)
 Applying this to formulas, chord changes could occur when a clover occurs, while possible modulations to different 
 keys could occur when a smash or steam events occur. This follows the sequential nature of the formulas as each provides the harmonic context for the next. 
 Put another way - The ear needs to traverse a harmonic space to build contexts for modulations to other spaces to occur. 		
 more info at: https://ledgernote.com/columns/music-theory/circle-of-fifths-explained/
*/

export const chord_map = [
  [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5], //major modes/chords
  [9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2], //minor modes/chords
] as const

//Function picks 1 of the 12 possible 6 chords to choose

export function get_chords_at_idx(idx: number) {
  var chords = [
    [
      chord_map[0][idx % 12],
      chord_map[0][(idx + 1) % 12],
      chord_map[0][(idx + 2) % 12],
    ],
    [
      chord_map[1][idx % 12],
      chord_map[1][(idx + 1) % 12],
      chord_map[1][(idx + 2) % 12],
    ],
  ]
  return chords
}

/*
 PITCHCLASS & NOTE UTILS
 Defintions:
 Note - Integer representation of pitches % OCTAVEBASE. Example E Major -> [1,3,4,6,8,9,11]  (C#,D#,E,F#,G#,A,B)
 Keynum - Integer representing MIDI note. Keynum = Note * (OCTAVEBASE * OctaveOfNote)
 Mode - Distances between adjacent notes within an OCTAVEBASE. Example: Major Key -> [2,2,1,2,2,2,1]
 Key  - A Mode transposed at a given pitch base
 Tonic - A Note transposing a Mode
 Modal Transposition - Moving up or down in pitch by a constant interval within a given mode
 Scale Degree - The position of a particular note on a scale relative to the tonic
*/

export class PitchClass {
  note: number
  octave: number

  constructor(note: number, octave: number) {
    this.note = note
    this.octave = octave
  }

  // Converts a PitchClass to a MIDI keynum

  pcToKeynum(): number {
    return this.note + octavebase * (1 + this.octave)
  }

  scaleDegree( tonic: PitchClass, mode: number[]): number {

    var key_arr: number[] = get_notes_of_key(tonic, mode)

    return key_arr.indexOf(this.note) 
  }

  modalTransposition(steps: number, tonic: PitchClass, mode: number[]): number {

    var key_arr: number[] = get_notes_of_key(tonic, mode)
    var scaledegree: number = key_arr.indexOf(this.note)
    var keyn = this.note + octavebase * (1 + this.octave)

    var total_steps: number = num_steps_from_scale_degree(
      scaledegree,
      steps,
      tonic,
      mode
    )

    return keyn + total_steps
  }

  // Converts MIDI keynum to note value

  keynumToNote(keynum: number): number {
    return keynum % octavebase
  }
}

export function keynumToNote(keynum: number) {
  return keynum % octavebase
}

export function keynumToPitchClass(keynum: number) {
  let pc = new PitchClass(
    keynum % octavebase,
    Math.floor(keynum / octavebase) + 1
  )
  return pc
}

/*
 FretBoard - PitchClass Map for Grid 
*/

class FretBoard {
  name: string
  frets: number[][]

  constructor(name: string, steps: number[][]) {
    this.name = name
    this.frets = steps
  }
}

export var fretboard1 = new FretBoard("guqin_grid_notes", guqin_grid_notes)

/*
 MusicGridState - Manages musical attributes modulated by formulas. 
 Useful for identifying modulation distance from previous mode/state
*/

class MusicGridState {
  chordmap_idx: number
  current_mode_idx: number
  current_tonic: number
  currentgridmap: Array<number>

  constructor(
    chordmap_idx: number,
    current_mode_idx: number,
    current_tonic: number,
    currentgridmap: Array<number>
  ) {
    this.chordmap_idx = chordmap_idx
    this.current_mode_idx = current_mode_idx
    this.current_tonic = current_tonic
    this.currentgridmap = currentgridmap
  }

  //loop through list, return active cells and associated mech/alchemy data
  iterateGrid(keynum: number): number {
    return keynum % octavebase
  }

  detectAlchemy(keynum: number): number {
    return keynum % octavebase
  }
}

/*
 MODAL TRANSPOSITION
 In order to compute modal transposition of a note given a mode and stepnum, 
 one must calculate the distance of the transposition in steps from a given scale degree
 Example: transposing the note D in the key of C major by 2 steps is F. The distance of that transposition == 4 steps
 get back here the thing to test is collapse both transposition functions in to one
*/

//Compute and Return notes of mode at note base - note base is omitted

export function mode_notes_above_note_base(
  pitchbase: number,
  mode: Array<number>
) {
  var step_sum: number = 0
  var notes: number[] = new Array(mode.length)

  for (var i = 0; i < notes.length; i++) {
    step_sum = step_sum + mode[i]
    notes[i] = pitchbase + step_sum
  }
  return notes
}

export function get_notes_of_key(pc: PitchClass, mode: Array<number>) {
  var step_sum: number = 0
  var notes: number[] = new Array(mode.length + 1)
  notes[0] = pc.note

  for (var i = 0; i < mode.length; i++) {
    step_sum = step_sum + mode[i]
    notes[i + 1] = (pc.note + step_sum) % 12
  }
  return notes
}

/* 
 Returns the scale degree of a note, given a tonic and mode (-1 if not found)
 In this implementation, Scale degrees use zero-based counting, unlike in prevalent music theory literature 
*/

export function get_scale_degree(
  pc: PitchClass,
  tonic: PitchClass,
  mode: Array<number>
) {
  var key_arr: number[] = get_notes_of_key(tonic, mode)
  var index = key_arr.indexOf(pc.note)

  return index
}

export function keynum_to_scale_degree(
  keynum: number,
  tonic: PitchClass,
  mode: Array<number>
) {
  var summ: number = 0

  var key_arr: number[] = get_notes_of_key(tonic, mode)
  var note = keynumToNote(keynum)
  var index = key_arr.indexOf(note)

  return index
}

// Calculates for both + & - modal steps from a given scale degree

export function num_steps_from_scale_degree(
  scale_degree: number,
  num_steps: number,
  tonic: PitchClass,
  mode: number[]
) {
  var abs_steps = Math.abs(num_steps)
  var sum: number = 0
  var currentstep: number
  //var reverse_mode: number[] = mode.reverse()
  var reverse_mode: number[] = [...mode].reverse()
  var inverted_scale_degree =
    (mode.length - 1 - Math.abs(scale_degree)) % mode.length

  // console.log("scale degree inverted" + inverted_scale_degree)

  for (var i = 0; i < abs_steps; i++) {
    if (num_steps < 0) {
      var currentstep = (inverted_scale_degree + Math.abs(i)) % mode.length
      sum = sum - reverse_mode[currentstep]
    } else {
      var currentstep = (scale_degree + i) % mode.length
      sum = sum + mode[currentstep]
    }
  }

  return sum
}

export function modaltransposition(
  keynum: number,
  num_steps: number,
  tonic: PitchClass,
  mode1: number[]
) {
  var scale_degree: number = keynum_to_scale_degree(keynum, tonic, mode1)
  console.log("scale degree " + scale_degree)
  console.log("mode : " + mode1)

  var total_steps: number = num_steps_from_scale_degree(
    scale_degree,
    num_steps,
    tonic,
    mode1
  )

  return keynum + total_steps
}

/*
 Bi-Modal Transpostion 
 Functions to calculate transposition of a PitchClass from (tonic+mode) to a (tonic+mode) 
 Useful for changing keys when certain alchemy events occur
*/

