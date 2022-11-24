import { get_chords_at_idx, modaltransposition, modes, num_steps_from_scale_degree, PitchClass } from "./mumu_music";
import AtomState, { AtomType } from "./types/AtomState";
import Frame from "./types/Frame";
import Grid from "./types/Grid";
import MechState, { MechStatus, MechType } from "./types/MechState";

/*
BUILD TEST DATA SIMULATING DEMO 01
*/

// Create Mech Trajectories - Each X,Y pair corresponds to Frame Data

var simulation_steps = 100

var mech1_grid_path = [[3,3],[4,3], [4,4], [3,4]]
var mech2_grid_path = [[5,5],[5,6], [5,7], [6,7], [7,7], [7,6], [7,5], [6,5]]
var mech_grid_paths = [mech1_grid_path, mech2_grid_path]

var frames: Frame[] = [];
var atoms: AtomState[] = [];
var mech_states: MechState[] = [];

// delivered_accumulated array - Dummy Data for Now

var atomt: AtomType[] = [];
atomt[0] = AtomType.VANILLA
atomt[1] = AtomType.HAZELNUT

// Create Grid & Mechs for Frame Data
for (var i = 0; i < simulation_steps; i++) {
for (var j = 0; j < mech_grid_paths.length; j++) {

  var idx = i % mech_grid_paths[j].length

  let gridvals: Grid = {
    x: mech_grid_paths[j][idx][0],
    y: mech_grid_paths[j][idx][1],
  };

  let mechstatevals: MechState = {
    id: "mech"+(j+1),
    typ: MechType.SINGLETON,
    status: MechStatus.OPEN,
    index: gridvals,
    pc_next: i
  };

  mech_states[j] = mechstatevals
}

// map for grid_populated_bools

var bools: { [name: string]: boolean } = {}
bools.test = true

let frameval: Frame = {
  mechs: [...mech_states],
  atoms: atoms,
  grid_populated_bools: bools,
  delivered_accumulated: atomt,
  cost_accumulated: 0,
  notes: ""
};

frames[i] = frameval
}

console.log(frames.length)
console.log(frames[0].mechs)

/*
Loop through a frame, and access notes from 'FretBoard'
The Code below is currently running in the MIDI player
*/

/*
for (var i = 0; i < 100; i++) {
      for (var j = 0; j < frames[i].mechs.length; j++) {
  
        //Get Grid Dimensions for each mech
        // J = mech id
        
        //index into fretboard grid
       var x_idx = frames[i].mechs[j].index.x
       var y_idx = frames[i].mechs[j].index.y

       var mech_id = parseInt(
        frames[i].mechs[j].id
        )
        console.log("mech_id")
        console.log(mech_id)
       var fretvals = guqin_grid_notes[x_idx][y_idx]

       const note = createNote2(rootStore)(
        (960/2)*i,
        fretvals+36+(12*j),
        80,
        960/2
      )
*/
