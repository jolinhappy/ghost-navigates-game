import { cn } from '@/utils/cn'
import { Direction, Maze } from '@types'
import { Ghost, Key } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface MazeMapProps {
  mazeData: Maze
}

const directions: Direction[] = [
  // right, left, up, down
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

const MazeMap = ({ mazeData }: MazeMapProps) => {
  const [ghostPosition, setGhostPosition] = useState<Direction | null>(null)
  const [endPosition, setEndPosition] = useState<Direction | null>(null)
  const [isStart, setIsStart] = useState<boolean>(false)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const isPaused = useRef<boolean>(false)
  const [ghostPath, setGhostPath] = useState<Direction[]>([])
  const isFindEnd =
    ghostPosition?.x === endPosition?.x && ghostPosition?.y === endPosition?.y

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  const findTargetPosition = (mazeData: Maze, target: 'start' | 'end') => {
    for (let i = 0; i < mazeData.length; i++) {
      for (let j = 0; j < mazeData[i].length; j++) {
        if (mazeData[i][j] === target) {
          return { x: j, y: i }
        }
      }
    }
    return { x: 0, y: 0 }
  }

  const depthFirstSearch = useCallback(
    async (
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
      setGhostPath(prePath => [...prePath, { x: starterX, y: starterY }])
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
        if (
          await depthFirstSearch(mazeData, newXPosition, newYPosition, paths)
        ) {
          return true
        }
      }

      // If return false and not paused state , remove the current position from paths
      if (!isPaused.current) {
        paths.pop()
        const lastPosition = paths[paths.length - 1]
        setGhostPosition({ x: lastPosition.x, y: lastPosition.y })
        setGhostPath(prev => prev.slice(0, -1))
        await delay(200)
      }
      return false
    },
    []
  )

  useEffect(() => {
    // init ghost position and end position from mazeData
    setGhostPosition(findTargetPosition(mazeData, 'start'))
    setEndPosition(findTargetPosition(mazeData, 'end'))
  }, [mazeData])

  useEffect(() => {
    const startToFindDestination = async () => {
      if (!ghostPosition) return
      setIsSearching(true)
      isPaused.current = false
      const resultPath: Direction[] = []
      await depthFirstSearch(
        mazeData,
        ghostPosition.x,
        ghostPosition.y,
        resultPath
      )
      setIsSearching(false)
    }
    if (isStart) {
      startToFindDestination()
      setIsStart(false)
    }
  }, [depthFirstSearch, ghostPosition, isStart, mazeData])

  const handleStopSearch = () => {
    isPaused.current = true
    setIsSearching(false)

    // reset ghost position and ghost path
    const startPosition = findTargetPosition(mazeData, 'start')
    setGhostPosition(startPosition)
    setGhostPath([])
  }

  return (
    <>
      <table>
        <tbody>
          {mazeData.map((y, yIndex) => (
            <tr key={`${y}-${yIndex}`}>
              {y.map((x, xIndex) => (
                <td
                  key={`${x}-${xIndex}`}
                  className={cn('w-7 h-7', {
                    'bg-sky-800': x === 'wall',
                    'bg-sky-100': x === 'path' || x === 'start' || x === 'end',
                    'bg-sky-300': ghostPath.some(
                      position => position.y === yIndex && position.x === xIndex
                    ),
                  })}
                >
                  {yIndex === ghostPosition?.y &&
                    xIndex === ghostPosition?.x && (
                      <Ghost className="text-red-400" />
                    )}
                  {x === 'end' && !isFindEnd && (
                    <Key className="text-red-400" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="h-10 w-32 p-3 mt-3 bg-slate-200 text-xl flex items-center justify-center rounded-lg shadow-lg hover:bg-slate-300"
        onClick={
          isSearching || isFindEnd ? handleStopSearch : () => setIsStart(true)
        }
      >
        {isSearching || isFindEnd ? 'Reset' : 'Start'}
      </button>
    </>
  )
}

export default MazeMap
