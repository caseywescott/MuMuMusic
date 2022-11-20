// Define a 12 note octave base
// For Microtonal mode definition, change the OCTAVEBASE and represent scales as intervallic ratios summing to OCTAVEBASE

export const octavebase:number = 12; 

/*********************************************************************************************
//  Mode & Key Definitions
//
// We define Scales/Modes as an ordered array of ascending interval steps
//
// Example 1: [do, re, me, fa, sol, la, ti] in C Major Key -> C,D,E,F,G,A,B -> Modal Steps: [2,2,1,2,2,1]
//
// It is from these defined steps that we can compute a 'Key' AKA Pitches of a Mode at a given Note Base
//
// For microtonal scales, steps should be defined as ratios of BASEOCTAVE
// NOTE: SCALE DEGREESS USE ZERO BASED COUNTING (unlike music theory literature)
/**********************************************************************************************/

/* 
 Modes arranged by the cycle of fifths
 It'll be good to use modes with few/no avoid notes to make sure we are always sounding musical: https://en.wikipedia.org/wiki/Avoid_note
 Lydian, Pentatonic and Dorian would be great choices
*/

//const major_steps = [2,2,1,2,2,2,1] as const; //avoid notes scale degree 3
export var major_steps = [2,2,1,2,2,2,1]; //avoid notes scale degree 3

const mixolydian_steps = [2,2,1,2,2,1,2] as const; //avoid notes scale degree 3
const dorian_steps = [2,1,2,2,2,1,2] as const; //avoid notes scale degree 5 but modern ears usually like it
const aeolian_steps = [2,1,2,2,2,2,2] as const; // avoid notes scale degree 5
const phrygian_steps = [1,2,2,2,1,2,2] as const; // avoid notes scale degree 1 & 5
const locrian_steps = [1,2,2,1,2,2,2] as const; // avoid notes scale degree 1
const lydian_steps = [2,2,2,1,2,2,1] as const; // No avoid notes

// Additional Modes

const melodicminor_steps =  [2,1,2,2,2,2,1] as const; //no avoid notes
const harmonicminor_steps = [2,1,2,2,1,3,1] as const;
const naturalminor_steps = [2,1,2,2,2,2,2] as const;
const chromatic_steps = [1,1,1,1,1,1,1,1,1,1,1] as const; 
const pentatonic_steps = [2,2,3,2,3] as const; // No avoid notes

//***************************************************************
// Indexed map to mode steps
// Helpful for Mapping to UIs/Clients and Modal Modulation
//***************************************************************

const cycle_of_fifths_modes = [
                  major_steps,
                  mixolydian_steps,
                  dorian_steps,
                  aeolian_steps,
                  phrygian_steps,
                  locrian_steps,
                  lydian_steps
                  ] as const;

const mode_steps = [
                  major_steps,
                  mixolydian_steps,
                  dorian_steps,
                  aeolian_steps,
                  phrygian_steps,
                  locrian_steps,
                  lydian_steps,
                  melodicminor_steps,
                  harmonicminor_steps,
                  naturalminor_steps,
                  chromatic_steps,
                  pentatonic_steps
                  ] as const;

                  

                  type ModeMap = {[key: string]: number[]};

                  


/*
Modes sorted by lighter to dark quality:
https://guitarchitecture.org/2011/10/02/the-guitarchitect%E2%80%99s-guide-to-modes-part-the-circle-of-5ths-modal-interchange-and-making-the-most-of-one-pattern/
*/

const modes_lighter_to_dark = [
                  //pentatonic_steps,
                  lydian_steps,
                  major_steps,
                  mixolydian_steps,
                  dorian_steps,
                  aeolian_steps,
                  phrygian_steps,
                  locrian_steps
                  ] as const;         

/*
Current PitchClass map for the 7X7 Matrix grid emulating Guqin Fretboard. Ultimately these will be recomputed by formulas to reduce transposistions/computations
*/
                 
var guqin_grid_notes = [
                  [0,2,5,7,9,12,14,12],
                  [2,5,7,9,12,14,12,0],
                  [5,7,9,12,14,12,0,2],
                  [7,9,12,14,12,0,2,5],
                  [9,12,14,12,0,2,5,7],
                  [12,14,12,0,2,5,7,9],
                  [14,12,0,2,5,7,9,12],
                  [12,0,2,5,7,9,12,14]
                  ];

/*
To select chord progressions that sound good, select from any 6 adjacent cells of the chord_map below. To modulate keys safely, rotate 6 adjacent cells along the cells columns. 
The further the distance between cell sets (max-distance = 6), the more distant the chords harmonically.
There are also modal chord changes that also sound good (in the audio demo 0, I modulated down modally by 2 steps)
Applying this to formulas, chord changes could occur when a clover occurs, while possible modulations to different 
keys could occur when a smash or steam events occur. This follows the sequential nature of the formulas as each provides the harmonic context for the next. 
Put another way - The ear needs to traverse a harmonic space to build contexts for modulations to other spaces to occur. 		
more info at: https://ledgernote.com/columns/music-theory/circle-of-fifths-explained/
*/

const chord_map = [
                  [0,7,2,9,4,11,6,1,8,3,10,5], //major modes/chords
                  [9,4,11,6,1,8,3,10,5,0,7,2],      //minor modes/chords 
                  ] as const;

//Function picks 1 of the 12 possible 6 chords to choose

export function get_chords_at_idx(idx: number) { 

  var chords = [
                [chord_map[0][idx % 12],
                chord_map[0][(idx+1) % 12],
                chord_map[0][(idx+2) % 12]
                ],
                [
                chord_map[1][idx % 12],
                chord_map[1][(idx+1) % 12],
                chord_map[1][(idx+2) % 12]
                ]
              ];
  return chords; 
  } 

//*****************************************************************************************************************
// PitchClass and Note Utils 
//
// Defintions:
// Note - Integer representation of pitches % OCTAVEBASE. Example E Major -> [1,3,4,6,8,9,11]  (C#,D#,E,F#,G#,A,B)
// Keynum - Integer representing MIDI note. Keynum = Note * (OCTAVEBASE * OctaveOfNote)
// Mode - Distances between adjacent notes within an OCTAVEBASE. Example: Major Key -> [2,2,1,2,2,2,1]
// Key  - A Mode transposed at a given pitch base
// Tonic - A Note transposing a Mode
// Modal Transposition - Moving up or down in pitch by a constant interval within a given mode
// Scale Degree - The position of a particular note on a scale relative to the tonic
//*****************************************************************************************************************

export class PitchClass {
  note: number;
  octave: number;

  constructor(note: number, octave: number) {
          this.note = note;
          this.octave = octave;
  }

  // Converts a PitchClass to a MIDI keynum

  pcToKeynum() : number {
    return this.note+(octavebase * (1 + this.octave));
  }

  // Converts MIDI keynum to note value

  keynumToNote(keynum: number) : number {
    return keynum % octavebase;
  }

}

export function keynumToNote(keynum: number) { 
  return keynum % octavebase;
} 

export function keynumToPitchClass(keynum: number) { 
  let pc = new PitchClass(keynum % octavebase, Math.floor(keynum/octavebase) + 1);
  return pc;
} 


class PitchCollection {
  name: string;
  steps: Array<number>;

  constructor(name: string, steps: Array<number>) {
          this.name = name;
          this.steps = steps;
  }
}

//*************************************************************************************
// MusicGridState - Manages musical attributes modulated by formulas. 
// Useful for identifying modulation distance from previous mode/state
//*************************************************************************************

class MusicGridState {
  chordmap_idx: number;
  current_mode_idx: number;
  current_tonic: number;
  currentgridmap: Array<number>;

  constructor(chordmap_idx: number, current_mode_idx: number, current_tonic: number, currentgridmap: Array<number>) {
          this.chordmap_idx = chordmap_idx;
          this.current_mode_idx = current_mode_idx;
          this.current_tonic = current_tonic;
          this.currentgridmap = currentgridmap;
  }

  //loop through list, return active cells and associated mech/alchemy data
  iterateGrid(keynum: number) : number {
    return keynum % octavebase;
  }

  detectAlchemy(keynum: number) : number {
    return keynum % octavebase;
  }

}

/************************************************************************************************************************
// Modal Transpostion 
//
// In order to compute modal transposition of a note given a mode and stepnum, 
// one must calculate the distance of the transposition in steps from a given scale degree
//
// Example: transposing the note D in the key of C major by 2 steps is F. The distance of that transposition == 4 steps
// get back here the thing to test is collapse both transposition functions in to one
//************************************************************************************************************************/

//Compute and Return notes of mode at note base - note base is omitted

export function mode_notes_above_note_base(pitchbase: number, mode: Array<number>) { 
 
 var step_sum:number = 0; 
 var notes:number[] = new Array(mode.length)  

 for(var i = 0;i<notes.length;i++) { 
  step_sum=step_sum+mode[i];
    notes[i] = pitchbase +step_sum;
 }
  return notes; 
}

export function get_notes_of_key(pc: PitchClass, mode: Array<number>) { 
  
  var step_sum:number = 0; 
  var notes:number[] = new Array(mode.length+1)  
  notes[0] = pc.note;
  
  for(var i = 0;i < mode.length;i++) { 
    step_sum=step_sum+mode[i];
      notes[i+1] = (pc.note + step_sum) % 12; 
    }
   return notes; 
 }

// Returns the scale degree of a note, given a tonic and mode (-1 if not found)
// In this implementation, Scale degrees use zero-based counting, unlike in prevalent music theory literature          

export function get_scale_degree(pc: PitchClass, tonic: PitchClass, mode: Array<number>) { 
  var summ:number = 0; 

  var key_arr:number[] = get_notes_of_key(tonic, mode); 
  
  var index = key_arr.indexOf(pc.note);

   return index; 
 }
 
export function keynum_to_scale_degree(keynum: number, tonic: PitchClass, mode: Array<number>) { 
  var summ:number = 0; 

  var key_arr:number[] = get_notes_of_key(tonic, mode); 
  var note = keynumToNote(keynum);
  var index = key_arr.indexOf(note);

   return index; 
 }

// Calculates for both positive modal steps from a given scale degree by iterating through a reversed mode array

export function num_steps_from_scale_degree_positive(scale_degree: number, num_steps: number, tonic: PitchClass, mode: Array<number>) { 
  
  var sum:number = 0; 

  for(var i = 0; i < num_steps; i++) { 

    var currentstep = (scale_degree + i) % mode.length;
    sum = sum + mode[currentstep];
    console.log(sum);
   }

   return sum; 
 }

// Calculates for both negative modal steps from a given scale degree by iterating through a reversed mode array

export function num_steps_from_scale_degree_down(scale_degree: number, num_steps: number, tonic: PitchClass, mode: Array<number>) { 
  
  var sum:number = 0; 
  var index:number = 0;
  
  for(var i = 0; i < num_steps; i++) { 
    var unmodded_idx = scale_degree - i;

    if (unmodded_idx < 0) 
{
  index = mode.length-1;
} else{
  index = unmodded_idx;
}

    sum = sum + mode[index];
    console.log(sum);
   }

   return sum; 
 }

// Calculates for both negative modal steps from a given scale degree by iterating through a reversed mode array

export function num_steps_from_scale_degree_down2(scale_degree: number, num_steps: number, tonic: PitchClass, mode: Array<number>) { 
  
  var sum:number = 0; 
  var index:number = 0;
  var reverse_mode:number[] = mode.reverse();
  var inverted_scale_degree =  mode.length - 1 - (Math.abs(scale_degree) % mode.length);

  for(var i = 0; i < num_steps; i++) { 
    var currentstep = (inverted_scale_degree + i) % mode.length;
    sum = sum + reverse_mode[currentstep];
    console.log(sum);
   }

   return sum; 
 }

 // Calculates for both + & - modal steps from a given scale degree

 export function num_steps_from_scale_degree(scale_degree: number, num_steps: number, tonic: PitchClass, mode: Array<number>) { 
  
  var sum:number = 0; 
  var index:number = 0;
  var reverse_mode:number[] = mode.reverse();
  var inverted_scale_degree =  mode.length - 1 - (Math.abs(scale_degree) % mode.length);

  for(var i = 0; i < num_steps; i++) { 
      var currentstep = (inverted_scale_degree + i) % mode.length; 

    if(num_steps >= 0){
          sum = sum + mode[currentstep];
       }else{
          sum = sum + reverse_mode[currentstep];
     }
    console.log(sum);
   }

   return sum; 
 }

 export function modaltransposition(keynum: number, num_steps: number, tonic: PitchClass, mode: Array<number>) { 
  
  var scale_degree:number = keynum_to_scale_degree(keynum, tonic, mode);
  var num_steps:number = num_steps_from_scale_degree(scale_degree, num_steps, tonic, mode);

   return keynum + num_steps; 
 }

/********************************************************************************************
// Bi-Modal Transpostion 
// Functions to calculate transposition of a PitchClass from (tonic+mode) to a (tonic+mode) 
// Useful for changing keys when certain alchemy events occur
/********************************************************************************************/

export function bi_modaltransposition(keynum: number, num_steps: number, tonic: PitchClass, mode: Array<number>) { 
  
  var scale_degree:number = keynum_to_scale_degree(keynum, tonic, mode);
  var num_steps:number = num_steps_from_scale_degree(scale_degree, num_steps, tonic, mode);

   return keynum + num_steps; 
 }

 export function modulatePitchClass(keynum: number, num_steps: number, tonic: PitchClass, mode: Array<number>) { 
  
  var scale_degree:number = keynum_to_scale_degree(keynum, tonic, mode);
  var num_steps:number = num_steps_from_scale_degree(scale_degree, num_steps, tonic, mode);

   return keynum + num_steps; 
 }


//**********************************************************************************************************
    Quick Testing

    let pc = new PitchClass(9,4);
    let tonic = new PitchClass(0,4);
   
    console.log('mode_notes_above_note_base: ' + (mode_notes_above_note_base(69, major_steps ))); 
    console.log('pc_to_keynum: ' + pc.pcToKeynum()); 
    console.log('keynumToNote: ' + pc.keynumToNote(69)); 
    console.log('keynumToPitchClass -> note: ' + keynumToPitchClass(69).note); 
    console.log('get_notes_of_key: ' + get_notes_of_key(pc, major_steps)); 
    console.log('get_scale_degree: ' + get_scale_degree(pc, tonic, major_steps)); 
    console.log('keynum_to_scale_degree: ' + keynum_to_scale_degree(69, tonic, major_steps)); 
    console.log('num_steps_from_scale_degree: ' + num_steps_from_scale_degree(0, 4, tonic, major_steps)); 
    console.log('modaltransposition: ' + modaltransposition(69, 4, tonic, major_steps)); 
//***********************************************************************************************************/



