package main

import (
	"syscall/js"
)

func findNextComputerMove(args []js.Value) {
	grid := args[0]
	turnCount := args[1].Int()

	nextMove := GetNextMove(grid, turnCount)
	js.Global().Set("nextMove", js.TypedArrayOf(nextMove))
}

func checkGameState(args []js.Value) {
	grid := args[0]
	lastMoveArg := args[1]
	turnCount := args[2].Int()
	player := args[3].String()

	lastMove := []int8{int8(lastMoveArg.Index(0).Int()), int8(lastMoveArg.Index(1).Int())}
	gameState := StateValue(grid, lastMove, player, turnCount)

	js.Global().Set("gameState", js.ValueOf(gameState))
}

func registerCallbacks() {
	js.Global().Set("findNextComputerMove", js.NewCallback(findNextComputerMove))
	js.Global().Set("checkGameState", js.NewCallback(checkGameState))

}

func main() {
	done := make(chan bool, 0)

	registerCallbacks()

	<-done
}
