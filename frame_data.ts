import { cycle_of_fifths_modes, get_chords_at_idx, lighter_to_dark_modes, lighter_to_dark_modes_arr, lydian_steps_arr, modaltransposition, num_steps_from_scale_degree, PitchClass } from "./mumu_music";
import Grid from "./types/Grid";
import MechState, { MechStatus, MechType } from "./types/MechState";

var mech1_grid_path = [[3,3],[4,3], [4,4], [3,4]]
var mech2_grid_path = [[5,5],[5,6], [5,7], [6,7], [7,7], [7,6], [7,5], [6,5]]
var mech_grid_paths = [mech1_grid_path, mech2_grid_path]

  let grids = []
  let mech_states = []

  for (var i = 0; i < mech1_grid_path.length; i++) {
    let gridvals: Grid = {
        x: mech1_grid_path[i][0] ,
        y: mech1_grid_path[i][i] ,
      };
      grids[i] = gridvals

      let m: MechState = {
        id: "mech"+(i+1),
        typ: MechType.SINGLETON,
        status: MechStatus.OPEN,
        index: gridvals,
        pc_next: 0
      };
      mech_states[i] = m
  }
