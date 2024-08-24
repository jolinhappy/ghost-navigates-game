export type MazeCell = 'start' | 'wall' | 'path' | 'end'
export type Maze = MazeCell[][]
export type Direction = {
  x: number
  y: number
}
