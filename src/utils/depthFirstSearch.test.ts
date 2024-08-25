import { Direction, Maze } from '@types'
import { describe, test, expect, vi } from 'vitest'
import performDepthFirstSearch from './performDepthFirstSearch'

describe('depthFirstSearch', () => {
  test('Should return false when current position is wall', async () => {
    const mazeData: Maze = [
      ['wall', 'path', 'wall'],
      ['path', 'path', 'end'],
      ['path', 'wall', 'path'],
    ]
    const setGhostPosition = vi.fn()
    const setGhostPath = vi.fn()
    const isPaused = { current: false }
    const paths: Direction[] = []

    const depthFirstSearch = performDepthFirstSearch(
      setGhostPosition,
      setGhostPath,
      isPaused
    )

    const result = await depthFirstSearch(mazeData, 0, 0, paths)
    expect(result).toBe(false)
  })

  test('Should return true when find the end', async () => {
    const mazeData: Maze = [
      ['wall', 'path', 'wall'],
      ['path', 'path', 'end'],
      ['path', 'wall', 'path'],
    ]
    const setGhostPosition = vi.fn()
    const setGhostPath = vi.fn()
    const isPaused = { current: false }
    const paths: Direction[] = []

    const depthFirstSearch = performDepthFirstSearch(
      setGhostPosition,
      setGhostPath,
      isPaused
    )

    const result = await depthFirstSearch(mazeData, 0, 1, paths)
    expect(result).toBe(true)
  })

  test('Should return false when not find the end', async () => {
    const mazeData: Maze = [
      ['wall', 'path', 'wall'],
      ['path', 'path', 'wall'],
      ['path', 'wall', 'path'],
    ]
    const setGhostPosition = vi.fn()
    const setGhostPath = vi.fn()
    const isPaused = { current: false }
    const paths: Direction[] = []

    const depthFirstSearch = performDepthFirstSearch(
      setGhostPosition,
      setGhostPath,
      isPaused
    )

    const result = await depthFirstSearch(mazeData, 0, 1, paths)
    expect(result).toBe(false)
  })

  test('Should return false when current is pause', async () => {
    const mazeData: Maze = [
      ['wall', 'path', 'wall'],
      ['path', 'path', 'wall'],
      ['path', 'wall', 'path'],
    ]
    const setGhostPosition = vi.fn()
    const setGhostPath = vi.fn()
    const isPaused = { current: true }
    const paths: Direction[] = []

    const depthFirstSearch = performDepthFirstSearch(
      setGhostPosition,
      setGhostPath,
      isPaused
    )

    const result = await depthFirstSearch(mazeData, 0, 1, paths)
    expect(result).toBe(false)
  })
})
