"use strict;"

const canvas = document.getElementById("canvas")
let gl = canvas.getContext("webgl")



var vshader = `
uniform vec4 position;
uniform float size;
uniform float canvas_size;

void main() {
    gl_Position = vec4(position.x-size/canvas_size, position.y-size/canvas_size, position.z, position.w); 
    gl_PointSize = size;
}`;

// Fragment shader
var fshader = `

precision mediump float;

uniform vec4 color;

void main() {
  gl_FragColor = color;
}`;


// Compile the vertex shader
var vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vshader);
gl.compileShader(vs);

// Compile the fragment shade
var fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fshader);
gl.compileShader(fs);

// Create the WebGL program and use it
var program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
gl.useProgram(program);

// Log compilation errors, if any
console.log('vertex shader:', gl.getShaderInfoLog(vs) || 'OK');
console.log('fragment shader:', gl.getShaderInfoLog(fs) || 'OK');
console.log('program:', gl.getProgramInfoLog(program) || 'OK');

let dx = -1
let dy = 0
let started = false

let berry_pos = { "x": 0, "y": 0 }


const WIDTH = 14
const HEIGHT = WIDTH

function changeBerryPos() {
    berry_pos.x = Math.round(Math.random() * (WIDTH - 1) + 1)
    berry_pos.y = Math.round(Math.random() * (HEIGHT - 1) + 1)
}


const scoreSpan = document.getElementById("score")
let score = 0
snake = []

gl.clearColor(0.0, 0.0, 0.0, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);

function reset() {
    snake = []
    snake.push({ "x": WIDTH / 2, "y": HEIGHT / 2 })

    dx = -1
    dy = 0

    for (let i = 1; i <= 1; i++) {
        snake.push({ "x": WIDTH / 2 + i, "y": HEIGHT / 2 })
    }
    changeBerryPos()

    score = 0
    scoreSpan.textContent = score;
}

function addPart() {
    let x = snake[snake.length - 1].x
    let y = snake[snake.length - 1].y

    snake.push({ "x": x, "y": y })

    score++
    scoreSpan.textContent = score;
}

reset()



time = Date.now()

let size = gl.getUniformLocation(program, 'size');
let canvas_size = gl.getUniformLocation(program, 'canvas_size');
gl.uniform1f(size, canvas.width/WIDTH)
gl.uniform1f(canvas_size, canvas.width)

function loop() {
    if (Date.now() - time >= 66) {
        time = Date.now()
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.clear(gl.COLOR_BUFFER_BIT);

        let position = gl.getUniformLocation(program, 'position');
        let color = gl.getUniformLocation(program, 'color');

        snake[snake.length - 1].x = snake[0].x + dx
        snake[snake.length - 1].y = snake[0].y - dy

        snake.unshift(snake.pop())

        head_position = { "x": snake[0].x, "y": snake[0].y }

        if (head_position.x == berry_pos.x && head_position.y == berry_pos.y) {
            changeBerryPos()
            addPart()
        }

        

         gl.uniform4f(color, 1.0, 0.0, 0.0, 1.0)
        gl.uniform4f(position, berry_pos.x / (WIDTH / 2) - 1.0, berry_pos.y / (HEIGHT / 2) - 1.0, 0.0, 1.0);

        gl.drawArrays(
            gl.POINTS,
            0,
            1

        );

        for (let i = 0; i < snake.length; i++) {
            part = snake[i]
            if (head_position.x == part.x && head_position.y == part.y && i != 0) {
                reset()
            }

            gl.uniform4f(color, 0.0, (2.0 - i / (snake.length)) / 2.0, 0.0, 1.0)
            gl.uniform4f(position, part.x / (WIDTH / 2) - 1.0, part.y / (HEIGHT / 2) - 1.0, 0.0, 1.0);

            gl.drawArrays(
                gl.POINTS,
                0,
                1

            );
        }

        if (head_position.x <= 0 || head_position.x > WIDTH || head_position.y <= 0 || head_position.y > HEIGHT) {
            reset()
        }
 
       

    }
    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)

document.addEventListener("keydown", (event) => {
    if (event.code == "KeyW" || event.code == "ArrowUp") {
        dx = 0;
        dy = -1;
        started = true
    }
    if (event.code == "KeyS" || event.code == "ArrowDown") {
        dx = 0;
        dy = 1;
        started = true
    }
    if (event.code == "KeyA" || event.code == "ArrowLeft") {
        dx = -1;
        dy = 0;
        started = true
    }
    if (event.code == "KeyD" || event.code == "ArrowRight") {
        dx = 1;
        dy = 0;
        started = true
    }

})