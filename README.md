# Chris's AI Tic-Tac-Toe Game

Unbeatable tic tac toe game built with go wasm and react.

Check it out [here!](https://chris-tac-toe.netlify.app/)

![img](https://images.unsplash.com/photo-1536743939714-23ec5ac2dbae?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2bda9458d5506c648953ffba2dd76fd1&auto=format&fit=crop&w=3474&q=80)

## Intro

Go version 1.11 gave us an experimental version of WebAssembly support. Let's see how it handles computationally intensive tasks in a bigger project.

## Goals of this project

- Explore Go WebAssembly
- Build a deeper understanding of the MiniMax Algorithm
- Explore mixing Go WebAssembly in React.js

## Findings

Unfortunately, WebAssembly for Go (in version 1.11) has a long ways to go.

These were the some of pain points I encountered:

- Large Go files take a long time to parse on the front end. Hence long startup times.
- Go's JavaScript structs have very limited power, for example, a JavaScript array cannot be cloned.
- Performance was underwhelming, grid sizes above 3x3 would crash the browser.
- Performance in the algorithm itslf could be improved if Go's structs had more power.

## The Future

Again, this is an experimental version of WebAssembly. This is nowhere what Go can/will be in the browser. I'm quite hopeful that in time, Go can find its place among Rust and C in the WASM world.
