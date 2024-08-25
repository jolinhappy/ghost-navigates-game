import { Direction, Maze } from '@types'

const directions: Direction[] = [
  // right, left, up, down
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

const performDepthFirstSearch = (
  setGhostPosition: (position: Direction) => void,
  setGhostPath: (path: (prev: Direction[]) => Direction[]) => void,
  isPaused: React.MutableRefObject<boolean>
) => {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  const depthFirstSearch = async (
    mazeData: Maze,
    starterX: number,
    starterY: number,
    paths: Direction[]
  ) => {
    // handle the pause situation of DFS
    if (isPaused.current) return false

    // step 1: Check if the current position is wall or not an available paths
    const isCheckedPosition = paths.some(
      (path: Direction) => path.x === starterX && path.y === starterY
    )
    if (
      starterX === -1 ||
      starterY === -1 ||
      starterY >= mazeData.length ||
      starterX >= mazeData[0].length ||
      mazeData[starterY][starterX] === 'wall' ||
      isCheckedPosition
    ) {
      return false
    }

    // step 2: After excluding unavailable position, move the ghost to the current position and save the current position in paths.
    setGhostPosition({ x: starterX, y: starterY })
    setGhostPath((prePath: Direction[]) => [
      ...prePath,
      { x: starterX, y: starterY },
    ])
    paths.push({ x: starterX, y: starterY })

    // step 3: Check if the current position is end
    if (mazeData[starterY][starterX] === 'end') {
      return true
    }

    await delay(200)
    for (const direction of directions) {
      const newXPosition = starterX + direction.x
      const newYPosition = starterY + direction.y
      // use the new position to find the paths
      if (await depthFirstSearch(mazeData, newXPosition, newYPosition, paths)) {
        return true
      }
    }

    // If return false and not paused state , remove the current position from paths
    if (!isPaused.current) {
      paths.pop()
      const lastPosition = paths[paths.length - 1]
      if (lastPosition) {
        setGhostPosition({ x: lastPosition.x, y: lastPosition.y })
        setGhostPath((prev: Direction[]) => prev.slice(0, -1))
      }
      await delay(200)
    }
    return false
  }

  return depthFirstSearch
}

export default performDepthFirstSearch
