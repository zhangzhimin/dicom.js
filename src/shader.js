
var DICOM = DICOM || {};

//面元着色器和顶点着色器位Threejs的格式， 与标准的着色器有所区别， 主要是增加了一些默认的参数。
//如： modeViewMatrix， projectyionMatrix等

//面元着色器主要包含窗口窗位调节算法。将Texture里面的数据映射到期望范围内
DICOM.fragmentShader = 'uniform sampler2D texture;\
uniform float windowWidth, windowLevel;\
\
varying vec2 vUv;\
\
void main()	{\
    float up = windowLevel + windowWidth * 0.5;\
    float low = windowLevel - windowWidth * 0.5;\
\
    float gray = texture2D(texture, vUv).r;\
\
    gray = (gray-low) / windowWidth;\
\
    gl_FragColor = vec4(gray,gray,gray,1.0);\
\
}';

DICOM.vertexShader =
"varying vec2 vUv;\
\
void main()	{\
    vUv = uv;\
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
\
}";
