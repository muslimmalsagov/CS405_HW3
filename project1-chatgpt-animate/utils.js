function multiplyMatrices(matrixA, matrixB) {
    var result = [];

    for (var i = 0; i < 4; i++) {
        result[i] = [];
        for (var j = 0; j < 4; j++) {
            var sum = 0;
            for (var k = 0; k < 4; k++) {
                sum += matrixA[i * 4 + k] * matrixB[k * 4 + j];
            }
            result[i][j] = sum;
        }
    }

    // Flatten the result array
    return result.reduce((a, b) => a.concat(b), []);
}
function createIdentityMatrix() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}
function createScaleMatrix(scale_x, scale_y, scale_z) {
    return new Float32Array([
        scale_x, 0, 0, 0,
        0, scale_y, 0, 0,
        0, 0, scale_z, 0,
        0, 0, 0, 1
    ]);
}

function createTranslationMatrix(x_amount, y_amount, z_amount) {
    return new Float32Array([
        1, 0, 0, x_amount,
        0, 1, 0, y_amount,
        0, 0, 1, z_amount,
        0, 0, 0, 1
    ]);
}

function createRotationMatrix_Z(radian) {
    return new Float32Array([
        Math.cos(radian), -Math.sin(radian), 0, 0,
        Math.sin(radian), Math.cos(radian), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_X(radian) {
    return new Float32Array([
        1, 0, 0, 0,
        0, Math.cos(radian), -Math.sin(radian), 0,
        0, Math.sin(radian), Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function createRotationMatrix_Y(radian) {
    return new Float32Array([
        Math.cos(radian), 0, Math.sin(radian), 0,
        0, 1, 0, 0,
        -Math.sin(radian), 0, Math.cos(radian), 0,
        0, 0, 0, 1
    ])
}

function getTransposeMatrix(matrix) {
    return new Float32Array([
        matrix[0], matrix[4], matrix[8], matrix[12],
        matrix[1], matrix[5], matrix[9], matrix[13],
        matrix[2], matrix[6], matrix[10], matrix[14],
        matrix[3], matrix[7], matrix[11], matrix[15]
    ]);
}

const vertexShaderSource = `
attribute vec3 position;
attribute vec3 normal; // Normal vector for lighting

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

uniform vec3 lightDirection;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vNormal = vec3(normalMatrix * vec4(normal, 0.0));
    vLightDirection = lightDirection;

    gl_Position = vec4(position, 1.0) * projectionMatrix * modelViewMatrix; 
}

`

const fragmentShaderSource = `
precision mediump float;

uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float shininess;

varying vec3 vNormal;
varying vec3 vLightDirection;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vLightDirection);
    
    // Ambient component
    vec3 ambient = ambientColor;

    // Diffuse component
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * diffuseColor;

    // Specular component (view-dependent)
    vec3 viewDir = vec3(0.0, 0.0, 1.0); // Assuming the view direction is along the z-axis
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = spec * specularColor;

    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}

`

/**
 * @WARNING DO NOT CHANGE ANYTHING ABOVE THIS LINE
 */



/**
 * 
 * @TASK1 Calculate the model view matrix by using the chatGPT
 */

function getChatGPTModelViewMatrix() {
    const transformationMatrix = new Float32Array([
        0.3535533845424652, -0.6123724584579468, 0.7071067690849304, 0.19494247436523438,
        0.3535533845424652, 0.6123724870681763, 0.7071067690849304, -0.12947121286392212,
        -0.866025447845459, 0, 0.4999999701976776, 0,
        0, 0, 0, 1
    ]);
    return getTransposeMatrix(transformationMatrix);
}


/**
 * 
 * @TASK2 Calculate the model view matrix by using the given 
 * transformation methods and required transformation parameters
 * stated in transformation-prompt.txt
 */
function getModelViewMatrix() {
    // calculate the model view matrix by using the transformation
    // methods and return the modelView matrix in this method

    const translationMatrix = createTranslationMatrix(0.3, -0.25, 0);
      const scalingMatrix = createScaleMatrix(0.5, 0.5, 1);
      const rotationXMatrix = createRotationMatrix_X(degreesToRadians(30));
      const rotationYMatrix = createRotationMatrix_Y(degreesToRadians(45));
      const rotationZMatrix = createRotationMatrix_Z(degreesToRadians(60));
  
      // Combine the transformations matrixes
      let modelViewMatrix = createIdentityMatrix();
      modelViewMatrix = multiplyMatrices(modelViewMatrix, translationMatrix);
      modelViewMatrix = multiplyMatrices(modelViewMatrix, scalingMatrix);
      modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationXMatrix);
      modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationYMatrix);
      modelViewMatrix = multiplyMatrices(modelViewMatrix, rotationZMatrix);
    
    
      console.log(modelViewMatrix)

      const transformationMatrix = new Float32Array([
        0.1767766922712326, -0.3061862071122423, 0.3535533845424652, 0.30000001192092896, 0.4633883326744428, 0.0634132435040824, -0.1767766922712326, -0.25, 0.1268264870081648, 0.780330057776724, 0.6123724142244846, 0, 0, 0, 0, 1
      ]);
      // Return the transposed matrix (if needed, based on your requirements)
      return getTransposeMatrix(transformationMatrix);
      
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}


/**
 * 
 * @TASK3 Ask CHAT-GPT to animate the transformation calculated in 
 * task2 infinitely with a period of 10 seconds. 
 * First 5 seconds, the cube should transform from its initial 
 * position to the target position.
 * The next 5 seconds, the cube should return to its initial position.
 */
function getPeriodicMovement(startTime) {
    // this metdo should return the model view matrix at the given time
    // to get a smooth animation

     // Calculate the elapsed time
     const currentTime = Date.now();
     const elapsed = (currentTime - startTime) % 10000; // Use modulo to create a repeating pattern
 
     // Calculate the progress of the animation (0 to 1)
     const progress = elapsed / 5000;
 
     // Adjust progress for the return animation
     const returnProgress = progress > 1 ? 2 - progress : progress;
 
     // Interpolate between the initial and target matrices based on the progress
     const initialMatrix = getModelViewMatrix();
     const targetMatrix = getTransposeMatrix(new Float32Array([
         0.1767766922712326, -0.3061862071122423, 0.3535533845424652, 0.30000001192092896,
         0.4633883326744428, 0.0634132435040824, -0.1767766922712326, -0.25,
         0.1268264870081648, 0.780330057776724, 0.6123724142244846, 0, 0, 0, 0, 1
     ]));
     const interpolatedMatrix = interpolateMatrices(initialMatrix, targetMatrix, returnProgress);
 
     // Return the transposed matrix (if needed, based on your requirements)
     return getTransposeMatrix(interpolatedMatrix);
 }
 
 // Interpolate between two matrices based on a progress value
 function interpolateMatrices(matrixA, matrixB, progress) {
     const result = [];
     for (let i = 0; i < matrixA.length; i++) {
         result[i] = matrixA[i] + (matrixB[i] - matrixA[i]) * progress;
     }
     return result;
 }



