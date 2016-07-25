function getCanvasElement() {
	return document.body.appendChild(document.createElement("canvas"));
}

function getContextGL(canvasElement, options) {
	return canvasElement.getContext("webgl", options);
}

function getShader(contextGL, scriptElement) {
	var shader = contextGL.createShader(scriptElement.type === "x-shader/x-vertex" ? contextGL.VERTEX_SHADER : contextGL.FRAGMENT_SHADER);
	contextGL.shaderSource(shader, scriptElement.textContent);
	contextGL.compileShader(shader);
	return shader;
}

function getProgram(contextGL, vertexShader, fragmentShader) {
	var program = contextGL.createProgram();
	contextGL.attachShader(program, vertexShader);
	contextGL.attachShader(program, fragmentShader);
	contextGL.linkProgram(program);
	contextGL.useProgram(program);
	return program;
}

function setIndexProperty(contextGL, program, name, type) {
	program[name + type + "Index"] = contextGL["get" + (type === "Attribute" ? "Attrib" : "Uniform") + "Location"](program, name);
	if (type === "Attribute") {
		contextGL.enableVertexAttribArray(program[name + type + "Index"]);
	}
}

function setShaderMatrices(contextGL, program, projectionMatrix, modelViewMatrix, normalMatrix) {
  contextGL.uniformMatrix4fv(program.projectionMatrixUniformIndex, false, projectionMatrix);
  contextGL.uniformMatrix4fv(program.modelViewMatrixUniformIndex, false, modelViewMatrix);
  if (normalMatrix) {
  	 var normalMatrix = mat3.create();
     mat4.toInverseMat3(modelViewMatrix, normalMatrix);
     mat3.transpose(normalMatrix);
     contextGL.uniformMatrix3fv(program.normalMatrixUniformIndex, false, normalMatrix);
  }
}

function getBuffer(contextGL, type, data, usage, thingSize) {
	var buffer = contextGL.createBuffer();
	contextGL.bindBuffer(type, buffer);
	contextGL.bufferData(type, new Float32Array(data), usage);
	buffer.thingSize = thingSize;
	buffer.numberOfThings = data.length / thingSize;
	return buffer;
}

function getTexture(contextGL, src, magFilter, minFilter) {
	var texture = contextGL.createTexture();
	texture.image = new Image();
	texture.image.addEventListener("load", function(event) {
  	handleLoadedTexture(contextGL, texture, magFilter, minFilter);
  }, false);
	texture.image.src = src;
	return texture;
}

function handleLoadedTexture(contextGL, texture, magFilter, minFilter) {
	contextGL.bindTexture(contextGL.TEXTURE_2D, texture);
	contextGL.pixelStorei(contextGL.UNPACK_FLIP_Y_WEBGL, true);
	contextGL.texImage2D(contextGL.TEXTURE_2D, 0, contextGL.RGBA, contextGL.RGBA, contextGL.UNSIGNED_BYTE, texture.image);
	contextGL.texParameteri(contextGL.TEXTURE_2D, contextGL.TEXTURE_MAG_FILTER, magFilter);
	contextGL.texParameteri(contextGL.TEXTURE_2D, contextGL.TEXTURE_MIN_FILTER, minFilter);
	if (minFilter !== contextGL.NEAREST && minFilter !== contextGL.LINEAR) {
		contextGL.generateMipmap(contextGL.TEXTURE_2D);
	}
}
