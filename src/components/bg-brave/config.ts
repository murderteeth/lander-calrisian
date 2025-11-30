// ============================================
// SCENE CONFIGURATION
// ============================================

// Colors
export const BG_COLOR = 0x020618

// Camera
export const CAMERA_FOV = 75
export const CAMERA_HEIGHT = 5
export const HORIZON_POSITION = 0.68 // 0 = bottom, 1 = top

// Grid
export const GRID_LINE_COLOR = 0xb2edff
export const GRID_CELL_SIZE = 2 // World units per cell
export const GRID_LINE_WIDTH = 0.005 // World units
export const GRID_DEPTH = 60 // How far the grid extends
export const GRID_WIDTH = 200 // How wide the grid extends
export const GRID_SCROLL_SPEED = .4 // World units per second

// Mountains - shared settings
export const MOUNTAINS_COLOR = 0x273e81
export const MOUNTAINS_DISTANCE = 80 // Base distance from camera
export const MOUNTAINS_LINE_WIDTH = 2 // Wireframe line width (pixels)
export const MOUNTAINS_ROTATION = { x: -15, y: 5, z: 0 } // Degrees

// Individual mountain definitions: left to right
// Pattern: small, large, small, [gap], small, large, small
export const MOUNTAINS = [
  // Left group
  { x: -50, z: 0, radius: 8, stretchY: 1.5 },
  { x: -30, z: 0, radius: 15, stretchY: 1.88 },
  { x: -12, z: 0, radius: 10, stretchY: 1.6 },
  // Right group
  { x: 12, z: 0, radius: 10, stretchY: 1.6 },
  { x: 30, z: 0, radius: 15, stretchY: 1.88 },
  { x: 50, z: 0, radius: 8, stretchY: 1.5 },
]

// Y Character
export const Y_COLOR = 0x0657f9
