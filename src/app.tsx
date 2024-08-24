import { Maze } from '@types'
import { useEffect, useState } from 'react'
import MazeMap from '@/components/MazeMap'

export default function App() {
  const [mazeData, setMazeData] = useState<Maze[]>([])

  useEffect(() => {
    const getMazeData = () => {
      fetch('http://localhost:8080/api/maze')
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('Network response was not ok.')
          }
        })
        .then(data => {
          setMazeData(data)
        })
        .catch(error => {
          console.error(error)
        })
    }
    getMazeData()
  }, [])
  return (
    <div className="flex flex-col items-center gap-6 m-10">
      {mazeData.map((mazeMap, index) => (
        <div key={index} className="flex flex-col items-center">
          <h3 className="text-2xl">地圖 {index + 1}</h3>
          <MazeMap mazeData={mazeMap} />
        </div>
      ))}
    </div>
  )
}
