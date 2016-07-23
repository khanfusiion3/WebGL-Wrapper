function getCanvas() {
	return document.body.appendChild(document.createElement('canvas'));
}

function getContext(canvas, options) {
	return canvas.getContext('webgl', options);
}

function getShader(context, scriptElement) {
	var shader = context.createShader(scriptElement.type === 'x-shader/x-vertex' ? context.VERTEX_SHADER : context.FRAGMENT_SHADER);
	context.shaderSource(shader, scriptElement.textContent);
	context.compileShader(shader);
	return shader;
}

function getProgram(context, vertexShader, fragmentShader) {
	var program = context.createProgram();
	context.attachShader(program, vertexShader);
	context.attachShader(program, fragmentShader);
	context.linkProgram(program);
	context.useProgram(program);
	program.vertexPositionAttributeIndex = context.getAttribLocation(program, 'vertexPosition');
	context.enableVertexAttribArray(program.vertexPositionAttributeIndex);
	program.projectionMatrixUniformIndex = context.getUniformLocation(program, 'projectionMatrix');
	program.modelViewMatrixUniformIndex = context.getUniformLocation(program, 'modelViewMatrix');
	return program;
}

function setShaderMatrices(context, program, projectionMatrix, modelViewMatrix) {
  context.uniformMatrix4fv(program.projectionMatrixUniformIndex, false, projectionMatrix);
  context.uniformMatrix4fv(program.modelViewMatrixUniformIndex, false, modelViewMatrix);
}

function getBuffer(context, type, data, usage, thingSize) {
	var buffer = context.createBuffer();
	context.bindBuffer(type, buffer);
	context.bufferData(type, new Float32Array(data), usage);
	buffer.thingSize = thingSize;
	buffer.numberOfThings = data.length / thingSize;
	return buffer;
}
