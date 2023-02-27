"use strict"

const colorBlack = '#000';
const colorGrey = '#e9e9e9';

const drawLine = (ctx, startX, startY, endX, endY, color) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();
}

const drawAxises = (ctx, width, height, offset, color) => {
    const axisWidth = 6;
    const steps = 10;
    const stepX = width / steps;
    const stepY = height / steps;

    const startX = offset;
    const startY = height + axisWidth / 2;

    const textOffset = 12;
    const endX = offset + axisWidth / 2;

    ctx.font = '9px Arial';
    ctx.textAlign = 'start';

    for (let i = 1; i <= steps; ++i) {
        drawLine(ctx, startX + i * stepX, startY, startX + i * stepX, height - axisWidth / 2, color);
        ctx.fillText((i * 2.3 / steps).toFixed(2), offset + stepX * i - textOffset, height + textOffset);
        ctx.fillText(i, offset - textOffset, height - stepY * i + textOffset);
        drawLine(ctx, startX - axisWidth / 2, height - stepY * i, endX, height - stepY * i, color);
    }

    ctx.fillText(0, offset, height + textOffset);
    ctx.fill();
}

const drawGrid = (ctx, width, height, offset, color) => {

    const stepX = width / 10;
    //vertical lines
    for (let i = 0; i <= width; i += stepX) {
        drawLine(ctx, offset + stepX + i, 0, offset + stepX + i, height, color);
    }

    const stepY = height / 10;
    //hrizontal lines
    for (let i = 0; i < height; i += stepY) {
        drawLine(ctx, offset, i, width + offset, i, color);
    }
}

const exp = (secretNumber) => {
    let x = 0;
    const dots = [];
    while (1) {
        const val = Math.exp(x);
        if (val > secretNumber) {
            break;
        }
        dots.push({ x, y: val });
        x += 0.01;
    }
    return dots;
}

function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
}

const drawGraph = (roundSecret, canvas, canvasWidth, canvasHeight) => {
    if (canvas && roundSecret) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        const dots = exp(roundSecret);

        const offset = 20;
        const graphWidth = canvasWidth - offset;
        const graphHeight = canvasHeight - offset;

        const maxX = 2.3;
        const maxY = Math.exp(maxX);

        const xRatio = graphWidth / maxX;
        const yRatio = graphHeight / maxY;

        const drawDot = async (x, y) => {
            ctx.beginPath();
            ctx.arc(x * xRatio + offset, graphWidth - y * yRatio, 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            await timeout(0);
        }

        drawLine(ctx, offset, graphHeight, graphWidth + offset, graphHeight, colorBlack);
        drawLine(ctx, offset, graphHeight, offset, 0, colorBlack);
        drawAxises(ctx, graphWidth, graphHeight, offset, colorBlack);
        drawGrid(ctx, graphWidth, graphHeight, offset, colorGrey);

        const drawCurve = async () => {
            for (const dot of dots) {
                await drawDot(dot.x, dot.y);
            }
        }

        drawCurve();
    }
}


export default drawGraph;