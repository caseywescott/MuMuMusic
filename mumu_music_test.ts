/*
 TESTING
*/

import { mode_notes_above_note_base, PitchClass, octavebase, keynumToPitchClass,
        get_notes_of_key, get_scale_degree, keynum_to_scale_degree, num_steps_from_scale_degree, modaltransposition, modes
        } from "../../helpers/mumu_music"


// The above Middle C: A4 == 880 == PitchClass(9,4) = keynum == 69
let pc = new PitchClass(9,4);
let tonic = new PitchClass(0,4);

console.log('mode_notes_above_note_base: ' + (mode_notes_above_note_base(69, modes.major ))); 
console.log('pc_to_keynum: ' + pc.pcToKeynum()); 
console.log('keynumToNote: ' + pc.keynumToNote(69)); 
console.log('keynumToPitchClass -> note: ' + keynumToPitchClass(69).note); 
console.log('get_notes_of_key: ' + get_notes_of_key(pc, modes.major)); 
console.log('get_scale_degree: ' + get_scale_degree(pc, tonic, modes.major)); 
console.log('keynum_to_scale_degree: ' + keynum_to_scale_degree(69, tonic, modes.major)); 
console.log('num_steps_from_scale_degree: ' + num_steps_from_scale_degree(0, 4, tonic, modes.major)); 
console.log('modaltransposition: ' + modaltransposition(69, 4, tonic, modes.major)); 
console.log('modal_map: ' + modes.lydian); 

