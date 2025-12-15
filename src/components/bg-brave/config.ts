// ============================================
// SCENE CONFIGURATION
// ============================================

// Colors
export const BG_COLOR = 0x020618

// Background Gradient (top to bottom)
export const BG_GRADIENT_TOP = 0xbe185d
export const BG_GRADIENT_BOTTOM = 0x6366f1

// Camera
export const CAMERA_FOV = 75
export const CAMERA_HEIGHT = 5
export const CAMERA_ORBIT_ANGLE = 25 // Degrees, horizontal orbit around target (+ = right)
export const CAMERA_DISTANCE = 100 // Distance from target
export const CAMERA_ROLL = 1 // Degrees, tilt on view axis (+ = clockwise)

// Grid
export const GRID_LINE_COLOR = 0x314158
export const GRID_CELL_SIZE = 2 // World units per cell
export const GRID_LINE_WIDTH = 0.005 // World units
export const GRID_DEPTH = 110 // How far the grid extends
export const GRID_WIDTH = 1000 // How wide the grid extends
export const GRID_SCROLL_SPEED = 0.4 // World units per second

// City - shared settings
export const CITY_COLOR = 0x060814
export const CITY_LINE_WIDTH = 1 // Wireframe line width (pixels)

// Building row distances from camera
export const CITY_ROW_DISTANCES = {
  front: 80,
  mid: 105,
  far: 140,
}

// Street grid layout
export const CITY_STREET_WIDTH = 6 // Gap between blocks
export const CITY_BLOCK_GAP = 2 // Gap between buildings within a block

// Central building (holds Y ornament) - most forward in the scene
export const CENTRAL_BUILDING = { x: 20, z: -4, width: 16, depth: 12, height: 56 }

// Front row - block-based layout (futuristic planned city)
// z varies within blocks (-2 to +4), central building is most forward at z=-6
export const BUILDINGS = [
  // === LEFT SIDE ===
  // Block L1 (adjacent to central plaza)
  { x: 2, z: -2, width: 7, depth: 8, height: 32 },
  { x: -6, z: 3, width: 6, depth: 8, height: 38 },
  { x: -13, z: -1, width: 5, depth: 8, height: 28 },
  // Block L2 (after street gap)
  { x: -24, z: 2, width: 7, depth: 8, height: 22 },
  { x: -32, z: -2, width: 6, depth: 8, height: 30 },
  { x: -39, z: 4, width: 5, depth: 8, height: 18 },
  // Block L3 (far left)
  { x: -50, z: -1, width: 6, depth: 7, height: 14 },
  { x: -57, z: 3, width: 5, depth: 7, height: 20 },

  // === RIGHT SIDE ===
  // Block R1 (adjacent to central plaza)
  { x: 38, z: -1, width: 7, depth: 8, height: 28 },
  { x: 46, z: 4, width: 6, depth: 8, height: 35 },
  // Block R2 (after street gap)
  { x: 57, z: -2, width: 6, depth: 8, height: 24 },
  { x: 64, z: 2, width: 5, depth: 8, height: 16 },
]

// Mid row - city blocks with depth variation
// z varies within blocks to create realistic depth (-5 to +5)
export const BUILDINGS_MID = [
  // === LEFT SIDE ===
  // Block FL1 - visible through gap between L1 and L2
  { x: -36, z: -4, width: 5, depth: 6, height: 26 },
  { x: -36, z: 4, width: 4, depth: 5, height: 20 },
  { x: -42, z: 0, width: 6, depth: 7, height: 34 },
  { x: -48, z: -3, width: 4, depth: 5, height: 22 },
  // Block FL2 - visible through gap between L2 and L3
  { x: -62, z: 2, width: 5, depth: 6, height: 28 },
  { x: -62, z: -5, width: 4, depth: 5, height: 18 },
  { x: -68, z: 0, width: 6, depth: 6, height: 24 },
  // Block FL3 - extends past front row left edge
  { x: -84, z: -2, width: 5, depth: 6, height: 20 },
  { x: -84, z: 5, width: 4, depth: 5, height: 14 },
  { x: -92, z: 0, width: 5, depth: 6, height: 22 },
  { x: -98, z: 3, width: 4, depth: 5, height: 16 },

  // === CENTER ===
  // Flanking central tower - taller to peek above
  { x: -10, z: -4, width: 5, depth: 6, height: 36 },
  { x: -10, z: 4, width: 4, depth: 5, height: 28 },
  { x: 10, z: 3, width: 5, depth: 6, height: 32 },
  { x: 10, z: -5, width: 4, depth: 5, height: 38 },

  // === RIGHT SIDE ===
  // Block FR0 - fills gap behind front R1 (x=18-26)
  { x: 18, z: -4, width: 5, depth: 6, height: 32 },
  { x: 18, z: 4, width: 4, depth: 5, height: 24 },
  { x: 24, z: 0, width: 5, depth: 6, height: 28 },
  // Block FR1 - visible through gap between R1 and R2
  { x: 32, z: -3, width: 5, depth: 6, height: 30 },
  { x: 32, z: 4, width: 4, depth: 5, height: 22 },
  { x: 38, z: 0, width: 5, depth: 6, height: 26 },
  // Block FR2 - fills gap behind front R2
  { x: 46, z: -4, width: 5, depth: 6, height: 28 },
  { x: 46, z: 3, width: 4, depth: 5, height: 20 },
  { x: 52, z: 0, width: 5, depth: 6, height: 24 },
  // Block FR3 - extends past front row right edge
  { x: 60, z: -3, width: 5, depth: 6, height: 22 },
  { x: 60, z: 4, width: 4, depth: 5, height: 18 },
]

// Far row - same density as mid row, taller to peek over
// z varies within blocks (-4 to +4)
export const BUILDINGS_FAR = [
  // === LEFT SIDE ===
  // Block FL1
  { x: -28, z: -3, width: 5, depth: 5, height: 38 },
  { x: -28, z: 4, width: 4, depth: 5, height: 32 },
  { x: -34, z: 0, width: 5, depth: 5, height: 44 },
  // Block FL2
  { x: -44, z: -4, width: 5, depth: 5, height: 36 },
  { x: -44, z: 3, width: 4, depth: 5, height: 28 },
  { x: -50, z: 0, width: 5, depth: 5, height: 40 },
  // Block FL3
  { x: -60, z: 2, width: 5, depth: 5, height: 34 },
  { x: -60, z: -4, width: 4, depth: 5, height: 26 },
  { x: -66, z: 0, width: 5, depth: 5, height: 38 },
  // Block FL4
  { x: -76, z: -3, width: 5, depth: 5, height: 30 },
  { x: -76, z: 4, width: 4, depth: 5, height: 24 },
  { x: -82, z: 0, width: 5, depth: 5, height: 36 },
  // Block FL5
  { x: -92, z: 2, width: 4, depth: 5, height: 28 },
  { x: -98, z: -2, width: 5, depth: 5, height: 22 },

  // === CENTER ===
  { x: -14, z: -4, width: 5, depth: 5, height: 46 },
  { x: -14, z: 3, width: 4, depth: 5, height: 38 },
  { x: -6, z: 0, width: 5, depth: 5, height: 42 },
  { x: 6, z: 0, width: 5, depth: 5, height: 44 },
  { x: 14, z: -3, width: 4, depth: 5, height: 40 },
  { x: 14, z: 4, width: 5, depth: 5, height: 36 },

  // === RIGHT SIDE ===
  // Block FR0
  { x: 24, z: -4, width: 5, depth: 5, height: 38 },
  { x: 24, z: 3, width: 4, depth: 5, height: 30 },
  { x: 30, z: 0, width: 5, depth: 5, height: 42 },
  // Block FR1
  { x: 40, z: 2, width: 5, depth: 5, height: 36 },
  { x: 40, z: -4, width: 4, depth: 5, height: 28 },
  { x: 46, z: 0, width: 5, depth: 5, height: 40 },
  // Block FR2
  { x: 56, z: -3, width: 5, depth: 5, height: 32 },
  { x: 56, z: 4, width: 4, depth: 5, height: 26 },
  { x: 62, z: 0, width: 5, depth: 5, height: 34 },
]

// Y Character - ornament on central building
export const Y_COLOR = 0x0f172b
export const Y_SCALE = 0.035 // Scale factor (slightly smaller as ornament)
export const Y_ROTATION = { x: 0, y: 0, z: 0 } // Degrees
export const Y_LINE_WIDTH = 1 // Wireframe line width (pixels)
export const Y_DEPTH = 8 // Shallow extrusion for ornament
