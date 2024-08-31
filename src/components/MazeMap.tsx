import { cn } from '@/utils/cn'
import { Direction, Maze } from '@types'
import { Ghost, Key } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import performDepthFirstSearch from '@/utils/performDepthFirstSearch'

interface MazeMapProps {
  mazeData: Maze
}

const MazeMap = ({ mazeData }: MazeMapProps) => {
  const [ghostPosition, setGhostPosition] = useState<Direction | null>(null)
  const [endPosition, setEndPosition] = useState<Direction | null>(null)
  const [isStart, setIsStart] = useState<boolean>(false)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const isPaused = useRef<boolean>(false)
  const [ghostPath, setGhostPath] = useState<Direction[]>([])
  const isFindEnd =
    ghostPosition?.x === endPosition?.x && ghostPosition?.y === endPosition?.y
  const isCanReset = isSearching || isFindEnd

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

  useEffect(() => {
    // init ghost position and end position from mazeData
    setGhostPosition(findTargetPosition(mazeData, 'start'))
    setEndPosition(findTargetPosition(mazeData, 'end'))
  }, [mazeData])

  useEffect(() => {
    const startToFindDestination = async () => {
      const depthFirstSearch = performDepthFirstSearch(
        setGhostPosition,
        setGhostPath,
        isPaused
      )
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
  }, [ghostPosition, isStart, mazeData])

  const handleSearch = () => {
    isPaused.current = true

    if (isCanReset) {
      // reset ghost position and ghost path
      const startPosition = findTargetPosition(mazeData, 'start')
      setGhostPosition(startPosition)
      setGhostPath([])
      setIsSearching(false)
    } else {
      setIsStart(true)
    }
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
        onClick={handleSearch}
      >
        {isCanReset ? 'Reset' : 'Start'}
      </button>
    </>
  )
}

export default MazeMap
