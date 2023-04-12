package main

import (
	"math"
	"syscall/js"
)

type SuccessorState struct {
	Grid     js.Value
	LastMove []int8
	Rating   int
}

func GetNextMove(grid js.Value, turnCount int) []int8 {
	successorStates := getSuccessorStates(grid, "COMPUTER")
	var maxState SuccessorState

	// kicking off the minimax algo, we can assume the move is from the computer
	for index, state := range successorStates {
		state.Rating = miniMax(state.Grid, state.LastMove, "COMPUTER", turnCount, math.MinInt32, math.MaxInt32)

		if index == 0 || state.Rating > maxState.Rating {
			maxState = state
		}
	}
	return maxState.LastMove
}

func miniMax(grid js.Value, lastMove []int8, player string, turnCount int, alpha int, beta int) int {
	gameState := StateValue(grid, lastMove, player, turnCount)

	if gameState == 1 {
		return 1
	} else if gameState == 2 {
		return -1
	} else if gameState == 3 {
		return 0
	}

	if player == "COMPUTER" {
		return miniMaxMin(grid, "HUMAN", turnCount, alpha, beta)
	} else {
		return miniMaxMax(grid, "COMPUTER", turnCount, alpha, beta)
	}
}

func miniMaxMax(grid js.Value, player string, turnCount int, alpha int, beta int) int {
	successorStates := getSuccessorStates(grid, player)

	maxStateRating := int(math.MinInt32 - 1)
	for _, state := range successorStates {

		maxStateRating = intMax(maxStateRating, miniMax(state.Grid, state.LastMove, player, turnCount+1, alpha, beta))

		if maxStateRating >= beta {
			return maxStateRating
		}
		alpha = intMax(alpha, maxStateRating)
	}
	return maxStateRating
}

func miniMaxMin(grid js.Value, player string, turnCount int, alpha int, beta int) int {
	successorStates := getSuccessorStates(grid, player)

	minStateRating := int(math.MaxInt32 + 1)
	for _, state := range successorStates {
		minStateRating = intMin(minStateRating, miniMax(state.Grid, state.LastMove, player, turnCount+1, alpha, beta))

		if minStateRating <= alpha {
			return minStateRating
		}
		beta = intMin(beta, minStateRating)
	}
	return minStateRating
}

func intMax(x int, y int) int {
	if x > y {
		return x
	}
	return y
}

func intMin(x int, y int) int {
	if x < y {
		return x
	}
	return y
}

func getSuccessorStates(grid js.Value, player string) []SuccessorState {
	var states []SuccessorState

	// slice version of our grid so we can copy it
	baseGrid := duplicateGrid(grid)

	for i := 0; i < grid.Length(); i++ {
		for j := 0; j < grid.Length(); j++ {
			if grid.Index(i).Index(j).String() == "" {

				// copy the base grid
				newGrid := make([]interface{}, len(baseGrid))
				copy(newGrid, baseGrid)
				jsGrid := js.ValueOf(newGrid)
				// apply the next move
				jsGrid.Index(i).SetIndex(j, player)

				newState := SuccessorState{
					Grid:     jsGrid,
					LastMove: []int8{int8(i), int8(j)},
				}
				states = append(states, newState)
			}
		}
	}
	return states
}

func duplicateGrid(grid js.Value) []interface{} {
	// I was there was an easier way... but as of now I don't
	// think you can create a duplicate of a js array :(
	// so we just pass the values into a slice
	// pls lmk if you have an optimal solution
	gridSize := grid.Length()

	newGrid := make([]interface{}, gridSize)

	for i := 0; i < gridSize; i++ {

		newGridRow := make([]interface{}, gridSize)
		for j := 0; j < gridSize; j++ {
			newGridRow[j] = grid.Index(i).Index(j).String()
		}
		newGrid[i] = newGridRow
	}

	return newGrid
}

func StateValue(grid js.Value, lastMove []int8, player string, turnCount int) int {
	// return 0 for more moves to be played, 1 for Computer win, 2 for HUMAN win, and 3 for tie!
	rowIndex := lastMove[0]
	columnIndex := lastMove[1]
	gridSize := grid.Length()

	// check columns and rows
	rowEqual := true
	columnEqual := true
	for i := 0; i < gridSize; i++ {
		if grid.Index(int(rowIndex)).Index(i).String() != player {
			rowEqual = false
		}

		if grid.Index(i).Index(int(columnIndex)).String() != player {
			columnEqual = false
		}

		if !rowEqual && !columnEqual {
			break
		}
	}

	if rowEqual || columnEqual {
		if player == "COMPUTER" {
			return 1
		}
		return 2
	}

	// check upper left to bottom right diagonal
	if rowIndex == columnIndex {
		firstDiagonalEqual := true
		for i := 0; i < gridSize; i++ {
			if grid.Index(i).Index(i).String() != player {
				firstDiagonalEqual = false
			}
		}
		if firstDiagonalEqual {
			if player == "COMPUTER" {
				return 1
			}
			return 2
		}
	}

	// check top right to bottom left diagonal
	if int(rowIndex) == gridSize-1-int(columnIndex) {
		secondDiagonalEqual := true

		for i := 0; i < gridSize; i++ {
			if grid.Index(i).Index(gridSize-1-i).String() != player {
				secondDiagonalEqual = false
			}
		}
		if secondDiagonalEqual {
			if player == "COMPUTER" {
				return 1
			}
			return 2
		}
	}

	if gridSize*gridSize == turnCount {
		return 3
	}
	return 0
}
