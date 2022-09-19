function drawSprites () {
    if (raceStarted) {
        // renderer.place3dImage(ballImage, 10, 73, 0, 1)
        // renderer.place3dImage(ballImage, 11, 72, 0, 1)
        for (let i = 0; i <= treeX.length; i++) {
        	
        }
        for (let index = 0; index <= objtype.length - 1; index++) {
            renderer.place3dImage(objtype[index], objx[index], objy[index], objh[index], objtype[index].width)
        }
    }
}
// console.log("Number of trees=" + treeX.length)
function initializeTrack () {
    if (false) {
        treeX = []
        treeY = []
        for (let x = 0; x <= trackImage.width - 1; x++) {
            for (let y = 0; y <= trackImage.height - 1; y++) {
                if (trackImage.getPixel(x, y) == 1) {
                    treeX.push(x)
                    treeY.push(y)
                }
            }
        }
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    timer.background(function () {
        for (let index = 0; index < 20; index++) {
            carYOffset += -0.16
            pause(1)
        }
        if (controller.left.isPressed()) {
            drift = "l"
        } else if (controller.right.isPressed()) {
            drift = "r"
        }
        for (let index = 0; index < 20; index++) {
            carYOffset += 0.16
            pause(1)
        }
    })
})
function configure () {
    renderer.setBackgroundImage(assets.image`background`)
renderer.setZClipFar(zFar)
controller.player1.analog = true
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    Start_LVL(0)
})
controller.player2.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function () {
    cameraOffset += 180
    heading += 180
    mirroring = true
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (drift == "l") {
        if (driftNum == 0) {
            driftNum += 1
        } else if (driftNum == 2) {
            driftNum += 1
            objx.push(px)
            objy.push(py)
            objh.push(1)
            objtype.push(img`
                . . . . . . . . . . . . . . . . 
                . 9 . . . . . . . . . . . . 9 9 
                . . 9 . . . . . . . . . . 9 9 . 
                9 9 . 6 . . . . . . . . . 6 . . 
                . 6 6 4 . . . . . . . . 4 6 6 9 
                . . 4 4 . . . . . . . . 4 4 6 . 
                `)
            objIdx.push(9)
        } else if (driftNum == 4) {
            driftNum += 1
        }
    } else if (drift == "r") {
        if (driftNum == 1) {
            driftNum += 1
        } else if (driftNum == 3) {
            driftNum += 1
        }
    }
})
controller.player2.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Released, function () {
    cameraOffset += 180
    heading += 180
    mirroring = false
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (drift == "l") {
        if (driftNum == 1) {
            driftNum += 1
        } else if (driftNum == 3) {
            driftNum += 1
        }
    } else if (drift == "r") {
        if (driftNum == 0) {
            driftNum += 1
        } else if (driftNum == 2) {
            driftNum += 1
            objx.push(px)
            objy.push(py)
            objh.push(1)
            objtype.push(img`
                . . . . . . . . . . . . . . . . 
                . 9 . . . . . . . . . . . . 9 9 
                . . 9 . . . . . . . . . . 9 9 . 
                9 9 . 6 . . . . . . . . . 6 . . 
                . 6 6 4 . . . . . . . . 4 6 6 9 
                . . 4 4 . . . . . . . . 4 4 6 . 
                `)
            objIdx.push(9)
        } else if (driftNum == 4) {
            driftNum += 1
        }
    }
})
function endRace () {
	
}
function place () {
    for (let value of tiles.getTilesByType(assets.tile`myTile3`)) {
        for (let index = 0; index <= 7; index++) {
            if (index < 4) {
                CPUPX.push(value.x + 32 - index * 16)
                CPUPY.push(value.y - 16 - index * 8)
            } else if (index < 7) {
                CPUPX.push(value.x + 96 - index * 16)
                CPUPY.push(value.y - 16 - index * 8)
            } else {
                px = value.x + 96 - index * 16
                py = value.y - 16 - index * 8
                pxPrev = value.x + 96 - index * 16
                pyPrev = value.y - 16 - index * 8
            }
        }
    }
    for (let index = 0; index <= 7; index++) {
        dis = 99999
        for (let value of tiles.getTilesByType(assets.tile`myTile1`)) {
            if (dis > Math.sqrt((CPUPX[index] - value.x) * (CPUPX[index] - value.x) + (CPUPY[index] - value.y) * (CPUPY[index] - value.y))) {
                dis = Math.sqrt((CPUPX[index] - value.x) * (CPUPX[index] - value.x) + (CPUPY[index] - value.y) * (CPUPY[index] - value.y))
                CPUTempX[index] = value.x
                CPUCheckPoints[index] = value.y
            }
        }
        CPUpos[index] = 1
    }
    timer.background(function () {
        for (let index = 0; index < 90; index++) {
            pause(1)
            cameraOffset += 4
            heading += 4
        }
    })
    raceStarted = true
}
function Start_LVL (LVL_NUM: number) {
    tiles.setCurrentTilemap(maps[LVL_NUM])
    trackImage = image.create(4080, 4080)
    redrawImg.GenerateImage()
    configure()
    arrayx2 = []
    arrayy2 = []
    arrayh2 = []
    carAngularVelocity = 0
    throttle = 0
    let py = 0
let px = 0
speedMult = 1
    pxPrev = px
    pyPrev = py
    // How far behind the player should the camera be placed?
    followDistance = 40
    // Horizontal field of view in degrees. See backgroundImage comments,
    // it should be matched to the background image width.
    fov = 90
    // Y position of the horizon. Must match the backgroundImage (half) height.
    horizonY = 30
    // Z near and far (horizon) view distances
    zNear = 30
    zFar = 300
    // Color used for drawing ground outside the track texture.
    outsideTrackColor = 8
    carDragForward = 0.03
    carDragSideways = 0.15
    carDragSidewaysDrift = 0.04
    carDragOffroad = 0.2
    carAngularDrag = 0.85
    carAngularDragDrift = 0.95
    hOffset = -18
    hJumpSpeed = -20
    hAccel = 0.2
    arrayx = [
    -4,
    4,
    -4,
    -4,
    4,
    4,
    -4,
    4,
    4,
    3,
    -4,
    -3,
    4,
    3,
    -4,
    -3,
    -3,
    -3,
    3,
    3,
    3,
    -3,
    3,
    -3,
    -2,
    -3,
    -3,
    -1,
    -1,
    -2,
    2,
    3,
    3,
    1,
    1,
    2
    ]
    arrayy = [
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    -4,
    4,
    -4,
    4,
    -4,
    4,
    -4,
    -4,
    -4,
    -4,
    -4,
    -4,
    -4,
    -4,
    -4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4
    ]
    arrayh = [
    0,
    0,
    0,
    4,
    0,
    4,
    4,
    4,
    0,
    0,
    0,
    0,
    4,
    3,
    4,
    3,
    0,
    3,
    0,
    3,
    0,
    0,
    3,
    3,
    3,
    2,
    2,
    2,
    2,
    3,
    3,
    2,
    2,
    2,
    2,
    3
    ]
    heading = 180
    objx = []
    objy = []
    objh = []
    objtype = []
    objIdx = []
    coinX = []
    coinY = []
    coinH = []
    for (let index = 0; index <= 4; index++) {
        coinX.push((0 - Math.cos((72 * index + 18) * Math.PI / 180)) * 8)
        coinH.push(Math.sin((72 * index + 18) * Math.PI / 180) * 8)
        coinY.push(-1)
        coinX.push((0 - Math.cos((72 * (index + 1) + 18) * Math.PI / 180)) * 8)
        coinH.push(Math.sin((72 * (index + 1) + 18) * Math.PI / 180) * 8)
        coinY.push(-1)
        coinX.push((0 - Math.cos((72 * index + 18) * Math.PI / 180)) * 8)
        coinH.push(Math.sin((72 * index + 18) * Math.PI / 180) * 8)
        coinY.push(1)
        coinX.push((0 - Math.cos((72 * (index + 1) + 18) * Math.PI / 180)) * 8)
        coinH.push(Math.sin((72 * (index + 1) + 18) * Math.PI / 180) * 8)
        coinY.push(1)
        coinX.push((0 - Math.cos((72 * index + 18) * Math.PI / 180)) * 8)
        coinH.push(Math.sin((72 * index + 18) * Math.PI / 180) * 8)
        coinY.push(1)
        coinX.push((0 - Math.cos((72 * index + 18) * Math.PI / 180)) * 8)
        coinH.push(Math.sin((72 * index + 18) * Math.PI / 180) * 8)
        coinY.push(-1)
    }
    coinXMap = []
    coinYMap = []
    initializeTrack()
    tileUtil.unloadTilemap()
    tiles.setCurrentTilemap(collisionMaps[LVL_NUM])
    CPUPX = []
    CPUPY = []
    CPUAngle = [
    0,
    0,
    0,
    0,
    0,
    0,
    0
    ]
    CPUpos = [
    0,
    0,
    0,
    0,
    0,
    0,
    0
    ]
    CPUSpeed = [
    0,
    0,
    0,
    0,
    0,
    0,
    0
    ]
    CPUSpeed = [
    3 + 0,
    3 - 0.1,
    3 - 0.2,
    3 - 0.3,
    3 - 0.4,
    3 - 0.5,
    3 - 0.6
    ]
    CPUTempX = [
    0,
    0,
    0,
    0,
    0,
    0,
    0
    ]
    CPUCounter = [
    7,
    7,
    7,
    7,
    7,
    7,
    7
    ]
    CPULapCount = [
    0,
    0,
    0,
    0,
    0,
    0,
    0
    ]
    CPUCP1 = [
    assets.tile`myTile9`,
    assets.tile`myTile9`,
    assets.tile`myTile9`,
    assets.tile`myTile9`,
    assets.tile`myTile9`,
    assets.tile`myTile9`,
    assets.tile`myTile9`
    ]
    PlayerCP = 7
    renderer.placePlayerSprite(carSprite, 12, 17)
renderer.setUp(drawSprites)
for (let value of tiles.getTilesByType(assets.tile`myTile`)) {
        coinXMap.push(value.x + 0)
        coinYMap.push(value.y + 0)
    }
    for (let value of tiles.getTilesByType(assets.tile`myTile7`)) {
        objx.push(value.x)
        objy.push(value.y)
        objh.push(1)
        objtype.push(img`
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbff999999999ff999999999ffbbbbbbbbbbff999999999ff999999999ffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbffffffffffffffffffffffffbbbbbbbbbbffffffffffffffffffffffffbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
            `)
        objIdx.push(1)
    }
    place()
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    stats.turnStats(true)
})
controller.B.onEvent(ControllerButtonEvent.Released, function () {
    drift = ""
    driftNum = 0
    timer.background(function () {
        speedMult = 1.5
        pause(1000)
        if (speedMult == 1.5) {
            speedMult = 1
        }
    })
})
let dis3 = 0
let placement = 0
let playerPlacementNum = 0
let dis2 = 0
let cp2: Image = null
let cp1: Image = null
let PlayerLapCount = 0
let coinRotation = 0
let Max = 0
let prevAngle = 0
let attemptCameraOffset = 0
let carVy = 0
let carVx = 0
let fwdY = 0
let fwdX = 0
let carPower = 0
let PlayerCP = 0
let CPUCP1: Image[] = []
let CPULapCount: number[] = []
let CPUCounter: number[] = []
let speedMult = 0
let driftNum = 0
let mirroring = false
let cameraOffset = 0
let drift = ""
let carYOffset = 0
let treeY: number[] = []
let treeX: number[] = []
let dis = 0
let CPUCheckPoints: number[] = []
let CPUTempX: number[] = []
let CPUSpeed: number[] = []
let CPUpos: number[] = []
let CPUAngle: number[] = []
let CPUPY: number[] = []
let CPUPX: number[] = []
let collisionMaps: tiles.TileMapData[] = []
let coinYMap: number[] = []
let coinXMap: number[] = []
let coinH: number[] = []
let coinY: number[] = []
let coinX: number[] = []
let objIdx: number[] = []
let objtype: Image[] = []
let objh: number[] = []
let objy: number[] = []
let objx: number[] = []
let heading = 0
let arrayh: number[] = []
let arrayy: number[] = []
let arrayx: number[] = []
let hAccel = 0
let hJumpSpeed = 0
let hOffset = 0
let carAngularDragDrift = 0
let carAngularDrag = 0
let carDragOffroad = 0
let carDragSidewaysDrift = 0
let carDragSideways = 0
let carDragForward = 0
let outsideTrackColor = 0
let zFar = 0
let zNear = 0
let horizonY = 0
let fov = 0
let followDistance = 0
let pyPrev = 0
let pxPrev = 0
let throttle = 0
let carAngularVelocity = 0
let arrayh2: number[] = []
let arrayy2: number[] = []
let arrayx2: number[] = []
let maps: tiles.TileMapData[] = []
let raceStarted = false
let trackImage: Image = null
trackImage = img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `
raceStarted = false
maps = [tilemap`level1`, tilemap`level30`]
arrayx2 = []
arrayy2 = []
arrayh2 = []
carAngularVelocity = 0
throttle = 0
let py = 0
let px = 0
let mySprite = sprites.create(img`
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    ................................................................................................................................................................
    `, SpriteKind.Player)
mySprite.setFlag(SpriteFlag.RelativeToCamera, true)
mySprite.z = 500
let carSprite = sprites.create(assets.image`car`, SpriteKind.Player)
carSprite.z = 200
pxPrev = px
pyPrev = py
// How far behind the player should the camera be placed?
followDistance = 40
// Horizontal field of view in degrees. See backgroundImage comments,
// it should be matched to the background image width.
fov = 90
// Y position of the horizon. Must match the backgroundImage (half) height.
horizonY = 30
// Z near and far (horizon) view distances
zNear = 30
zFar = 300
// Color used for drawing ground outside the track texture.
outsideTrackColor = 8
carDragForward = 0.03
carDragSideways = 0.15
carDragSidewaysDrift = 0.04
carDragOffroad = 0.2
carAngularDrag = 0.85
carAngularDragDrift = 0.95
hOffset = -18
hJumpSpeed = -20
hAccel = 0.2
arrayx = [
-4,
4,
-4,
-4,
4,
4,
-4,
4,
4,
3,
-4,
-3,
4,
3,
-4,
-3,
-3,
-3,
3,
3,
3,
-3,
3,
-3,
-2,
-3,
-3,
-1,
-1,
-2,
2,
3,
3,
1,
1,
2
]
arrayy = [
4,
4,
4,
4,
4,
4,
4,
4,
4,
-4,
4,
-4,
4,
-4,
4,
-4,
-4,
-4,
-4,
-4,
-4,
-4,
-4,
-4,
4,
4,
4,
4,
4,
4,
4,
4,
4,
4,
4,
4
]
arrayh = [
0,
0,
0,
4,
0,
4,
4,
4,
0,
0,
0,
0,
4,
3,
4,
3,
0,
3,
0,
3,
0,
0,
3,
3,
3,
2,
2,
2,
2,
3,
3,
2,
2,
2,
2,
3
]
heading = 180
objx = []
objy = []
objh = []
objtype = []
objIdx = []
coinX = []
coinY = []
coinH = []
for (let index = 0; index <= 4; index++) {
    coinX.push((0 - Math.cos((72 * index + 18) * Math.PI / 180)) * 8)
    coinH.push(Math.sin((72 * index + 18) * Math.PI / 180) * 8)
    coinY.push(-1)
    coinX.push((0 - Math.cos((72 * (index + 1) + 18) * Math.PI / 180)) * 8)
    coinH.push(Math.sin((72 * (index + 1) + 18) * Math.PI / 180) * 8)
    coinY.push(-1)
    coinX.push((0 - Math.cos((72 * index + 18) * Math.PI / 180)) * 8)
    coinH.push(Math.sin((72 * index + 18) * Math.PI / 180) * 8)
    coinY.push(1)
    coinX.push((0 - Math.cos((72 * (index + 1) + 18) * Math.PI / 180)) * 8)
    coinH.push(Math.sin((72 * (index + 1) + 18) * Math.PI / 180) * 8)
    coinY.push(1)
    coinX.push((0 - Math.cos((72 * index + 18) * Math.PI / 180)) * 8)
    coinH.push(Math.sin((72 * index + 18) * Math.PI / 180) * 8)
    coinY.push(1)
    coinX.push((0 - Math.cos((72 * index + 18) * Math.PI / 180)) * 8)
    coinH.push(Math.sin((72 * index + 18) * Math.PI / 180) * 8)
    coinY.push(-1)
}
coinXMap = []
coinYMap = []
collisionMaps = [tilemap`level5`]
CPUPX = []
CPUPY = []
CPUAngle = [
0,
0,
0,
0,
0,
0,
0
]
CPUpos = [
0,
0,
0,
0,
0,
0,
0
]
CPUSpeed = [
0,
0,
0,
0,
0,
0,
0
]
CPUSpeed = [
]
CPUTempX = [
0,
0,
0,
0,
0,
0,
0
]
CPUCheckPoints = [
0,
0,
0,
0,
0,
0,
0
]
for (let value of tiles.getTilesByType(assets.tile`myTile`)) {
    coinXMap.push(value.x + 0)
    coinYMap.push(value.y + 0)
}
for (let index = 0; index <= 7; index++) {
    dis = 99999
    for (let value of tiles.getTilesByType(assets.tile`myTile1`)) {
        if (dis > Math.sqrt((CPUPX[index] - value.x) * (CPUPX[index] - value.x) + (CPUPY[index] - value.y) * (CPUPY[index] - value.y))) {
            dis = Math.sqrt((CPUPX[index] - value.x) * (CPUPX[index] - value.x) + (CPUPY[index] - value.y) * (CPUPY[index] - value.y))
            CPUTempX[index] = value.x
            CPUCheckPoints[index] = value.y
        }
    }
    CPUpos[index] = 1
}
Start_LVL(0)
game.onUpdate(function () {
    if (raceStarted) {
        if (mirroring) {
            heading += 180
            cameraOffset += 180
        }
        if (heading < 0) {
            heading += 360
        }
        if (heading >= 360) {
            heading += 0 - 360
        }
        if (drift == "l") {
            heading += carPower * 2 * (controller.dx(150) - 5)
            fwdX = Math.sin((heading + 30) * Math.PI / 180)
            fwdY = 0 - Math.cos((heading + 30) * Math.PI / 180)
        } else if (drift == "r") {
            heading += carPower * 2 * (controller.dx(150) + 5)
            fwdX = Math.sin((heading + 330) * Math.PI / 180)
            fwdY = 0 - Math.cos((heading + 330) * Math.PI / 180)
        } else {
            heading += carPower * 2 * controller.dx(300)
            fwdX = Math.sin(heading * Math.PI / 180)
            fwdY = 0 - Math.cos(heading * Math.PI / 180)
        }
        if (tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile6`)) {
            carPower = controller.dy(-3) * speedMult
        } else {
            carPower = controller.dy(-5) * speedMult
        }
        carVx += carPower * 2 * fwdX
        carVy += carPower * 2 * fwdY
        carVx += Math.sin(heading * Math.PI / 180) / 80 * carPower
        carVy += (0 - Math.cos(heading * Math.PI / 180)) / 80 * carPower
        carVx += 0 - carVx / 15
        carVy += 0 - carVy / 15
        if (carVx > 0.04 && carVx < -0.04) {
        	
        }
        if (carVy > 0.04 && carVy < -0.04) {
        	
        }
        px += carVx
        py += carVy
        if (carVx > -0.04 && carVx < 0.04) {
            carVx = 0
        }
        if (carVy > -0.04 && carVy < 0.04) {
            carVy = 0
        }
        if (px < 0) {
            px = 0
        }
        if (py < 0) {
            py = 0
        }
        attemptCameraOffset = (heading - prevAngle) * 10
        prevAngle = heading
        if (cameraOffset < -180) {
            cameraOffset += 360
        } else if (cameraOffset > 180) {
            cameraOffset += -360
        } else {
        	
        }
        if (Math.round(cameraOffset) < Math.round(attemptCameraOffset)) {
            cameraOffset += 1
        } else if (Math.round(cameraOffset) > Math.round(attemptCameraOffset)) {
            cameraOffset += -1
        } else {
        	
        }
        if (mirroring) {
            heading += -180
            cameraOffset += -180
        }
        if (heading < 0) {
            heading += 360
        }
        if (heading >= 360) {
            heading += 0 - 360
        }
        if (tiles.tileAtLocationIsWall(tiles.getTileLocation(px / 16, py / 16))) {
            if (drift == "") {
                carVx = 0 - carVx * 2
                carVy = 0 - carVy * 2
            } else {
                carVx = 0 - carVx
                carVy = 0 - carVy
            }
        }
    }
})
game.onUpdate(function () {
    if (raceStarted) {
        mySprite.setImage(img`
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            ................................................................................................................................................................
            `)
        if (Math.abs(carVx) + Math.abs(carVy) < 2.5) {
            drift = ""
            driftNum = 0
        }
        if (driftNum > 4) {
            objx.push(px)
            objy.push(py)
            objh.push(0.2)
            objtype.push(img`
                . . . . . . . . . . . . . . . . 
                . 4 . . . . . . . . . . . . 4 4 
                . . 4 . . . . . . . . . . 4 4 . 
                4 4 . 4 . . . . . . . . . 4 . . 
                . 4 2 4 . . . . . . . . 4 2 4 4 
                . . 4 2 . . . . . . . . 2 4 4 . 
                `)
            objIdx.push(9)
        }
        if (drift != "" && Math.percentChance(25)) {
            objx.push(px)
            objy.push(py)
            objh.push(1)
            if (Math.percentChance(50)) {
                objtype.push(img`
                    . . 1 1 . . 
                    . 1 1 1 . . 
                    1 1 1 1 1 . 
                    d 1 1 1 1 1 
                    . d d 1 d d 
                    . . . d . . 
                    `)
                objIdx.push(0)
            } else {
                objtype.push(img`
                    . . 1 1 1 . 
                    1 1 1 1 1 1 
                    d 1 1 1 1 d 
                    . 1 1 1 d . 
                    . d d d . . 
                    . . . . . . 
                    `)
                objIdx.push(0)
            }
        }
        for (let index = 0; index <= objx.length; index++) {
            if (objIdx[index] == 0) {
                if (objh[index] > 0) {
                    objh[index] = objh[index] - 0.1
                } else {
                    objh.removeAt(index)
                    objx.removeAt(index)
                    objy.removeAt(index)
                    objtype[index] = img`
                        . 
                        `
                    objtype.removeAt(index)
                    objIdx.removeAt(index)
                }
            }
            if (objIdx[index] == 9) {
                if (objh[index] > 0) {
                    objh[index] = objh[index] - 0.1
                } else {
                    objh.removeAt(index)
                    objx.removeAt(index)
                    objy.removeAt(index)
                    objtype[index] = img`
                        . 
                        `
                    objtype.removeAt(index)
                    objIdx.removeAt(index)
                }
            }
        }
        for (let index = 0; index <= 7; index++) {
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile0`)) {
                if (CPUpos[index] == 0) {
                    dis = 99999
                    for (let value of tiles.getTilesByType(assets.tile`myTile1`)) {
                        if (dis > Math.sqrt((CPUPX[index] - value.x) * (CPUPX[index] - value.x) + (CPUPY[index] - value.y) * (CPUPY[index] - value.y))) {
                            dis = Math.sqrt((CPUPX[index] - value.x) * (CPUPX[index] - value.x) + (CPUPY[index] - value.y) * (CPUPY[index] - value.y))
                            CPUTempX[index] = value.x
                            CPUCheckPoints[index] = value.y
                        }
                    }
                }
                CPUpos[index] = 1
            } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile1`)) {
                if (CPUpos[index] == 1) {
                    dis = 99999
                    for (let value of tiles.getTilesByType(assets.tile`myTile2`)) {
                        if (dis > Math.sqrt((CPUPX[index] - value.x) * (CPUPX[index] - value.x) + (CPUPY[index] - value.y) * (CPUPY[index] - value.y))) {
                            dis = Math.sqrt((CPUPX[index] - value.x) * (CPUPX[index] - value.x) + (CPUPY[index] - value.y) * (CPUPY[index] - value.y))
                            CPUTempX[index] = value.x
                            CPUCheckPoints[index] = value.y
                        }
                    }
                }
                CPUpos[index] = 2
            } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile2`)) {
                if (CPUpos[index] == 2) {
                    dis = 99999
                    for (let value of tiles.getTilesByType(assets.tile`myTile0`)) {
                        if (dis > Math.sqrt((CPUPX[index] - value.x) * (CPUPX[index] - value.x) + (CPUPY[index] - value.y) * (CPUPY[index] - value.y))) {
                            dis = Math.sqrt((CPUPX[index] - value.x) * (CPUPX[index] - value.x) + (CPUPY[index] - value.y) * (CPUPY[index] - value.y))
                            CPUTempX[index] = value.x
                            CPUCheckPoints[index] = value.y
                        }
                    }
                }
                CPUpos[index] = 0
            }
            Max = Math.max(Math.abs(CPUCheckPoints[index] - CPUPY[index]), Math.abs(CPUTempX[index] - CPUPX[index]))
            CPUPX[index] = CPUPX[index] + (CPUTempX[index] - CPUPX[index]) / (Max / CPUSpeed[index])
            CPUPY[index] = CPUPY[index] + (CPUCheckPoints[index] - CPUPY[index]) / (Max / CPUSpeed[index])
            CPUAngle[index] = spriteutils.radiansToDegrees(Math.atan2((CPUCheckPoints[index] - CPUPY[index]) / Math.max(Math.abs(CPUCheckPoints[index] - CPUPY[index]), Math.abs(CPUTempX[index] - CPUPX[index])), (CPUTempX[index] - CPUPX[index]) / Math.max(Math.abs(CPUCheckPoints[index] - CPUPY[index]), Math.abs(CPUTempX[index] - CPUPX[index])))) + 90
        }
        for (let index = 0; index <= coinXMap.length; index++) {
            for (let index7 = 0; index7 <= coinX.length / 2; index7++) {
                if (Math.percentChance(Math.sqrt((coinXMap[index] - px) * (coinXMap[index] - px) + (coinYMap[index] - py) * (coinYMap[index] - py)) / 6)) {
                	
                } else {
                    renderer.place3dLine(1, coinXMap[index] + (coinX[index7 * 2] * Math.cos(coinRotation * Math.PI / 180) - coinY[index7 * 2] * Math.sin(coinRotation * Math.PI / 180)), coinYMap[index] + (coinY[index7 * 2] * Math.cos(coinRotation * Math.PI / 180) + coinX[index7 * 2] * Math.sin(coinRotation * Math.PI / 180)), coinH[index7 * 2] - carYOffset, coinXMap[index] + (coinX[index7 * 2 + 1] * Math.cos(coinRotation * Math.PI / 180) - coinY[index7 * 2 + 1] * Math.sin(coinRotation * Math.PI / 180)), coinYMap[index] + (coinY[index7 * 2 + 1] * Math.cos(coinRotation * Math.PI / 180) + coinX[index7 * 2 + 1] * Math.sin(coinRotation * Math.PI / 180)), coinH[index7 * 2 + 1])
                }
            }
        }
        for (let index7 = 0; index7 <= arrayx.length / 2; index7++) {
            if (index7 < 12) {
                renderer.place3dLine(1, px + (arrayx[index7 * 2] * Math.cos((heading + cameraOffset) * Math.PI / 180) - arrayy[index7 * 2] * Math.sin((heading + cameraOffset) * Math.PI / 180)), py + (arrayy[index7 * 2] * Math.cos((heading + cameraOffset) * Math.PI / 180) + arrayx[index7 * 2] * Math.sin((heading + cameraOffset) * Math.PI / 180)), arrayh[index7 * 2] - carYOffset, px + (arrayx[index7 * 2 + 1] * Math.cos((heading + cameraOffset) * Math.PI / 180) - arrayy[index7 * 2 + 1] * Math.sin((heading + cameraOffset) * Math.PI / 180)), py + (arrayy[index7 * 2 + 1] * Math.cos((heading + cameraOffset) * Math.PI / 180) + arrayx[index7 * 2 + 1] * Math.sin((heading + cameraOffset) * Math.PI / 180)), arrayh[index7 * 2 + 1] - carYOffset)
            } else {
                renderer.place3dLine(9, px + (arrayx[index7 * 2] * Math.cos((heading + cameraOffset) * Math.PI / 180) - arrayy[index7 * 2] * Math.sin((heading + cameraOffset) * Math.PI / 180)), py + (arrayy[index7 * 2] * Math.cos((heading + cameraOffset) * Math.PI / 180) + arrayx[index7 * 2] * Math.sin((heading + cameraOffset) * Math.PI / 180)), arrayh[index7 * 2] - carYOffset, px + (arrayx[index7 * 2 + 1] * Math.cos((heading + cameraOffset) * Math.PI / 180) - arrayy[index7 * 2 + 1] * Math.sin((heading + cameraOffset) * Math.PI / 180)), py + (arrayy[index7 * 2 + 1] * Math.cos((heading + cameraOffset) * Math.PI / 180) + arrayx[index7 * 2 + 1] * Math.sin((heading + cameraOffset) * Math.PI / 180)), arrayh[index7 * 2 + 1] - carYOffset)
            }
        }
        for (let index = 0; index <= CPUPX.length; index++) {
            for (let index7 = 0; index7 <= arrayx.length / 2; index7++) {
                if (index7 < 12) {
                    if (Math.percentChance(Math.sqrt((CPUPX[index] - px) * (CPUPX[index] - px) + (CPUPY[index] - py) * (CPUPY[index] - py)) / 6)) {
                    	
                    } else {
                        renderer.place3dLine(1, CPUPX[index] + (arrayx[index7 * 2] * Math.cos(CPUAngle[index] * Math.PI / 180) - arrayy[index7 * 2] * Math.sin(CPUAngle[index] * Math.PI / 180)), CPUPY[index] + (arrayy[index7 * 2] * Math.cos(CPUAngle[index] * Math.PI / 180) + arrayx[index7 * 2] * Math.sin(CPUAngle[index] * Math.PI / 180)), arrayh[index7 * 2] - carYOffset, CPUPX[index] + (arrayx[index7 * 2 + 1] * Math.cos(CPUAngle[index] * Math.PI / 180) - arrayy[index7 * 2 + 1] * Math.sin(CPUAngle[index] * Math.PI / 180)), CPUPY[index] + (arrayy[index7 * 2 + 1] * Math.cos(CPUAngle[index] * Math.PI / 180) + arrayx[index7 * 2 + 1] * Math.sin(CPUAngle[index] * Math.PI / 180)), arrayh[index7 * 2 + 1])
                    }
                } else {
                    if (Math.percentChance(Math.sqrt((CPUPX[index] - px) * (CPUPX[index] - px) + (CPUPY[index] - py) * (CPUPY[index] - py)) / 2)) {
                    	
                    } else {
                        renderer.place3dLine(9, CPUPX[index] + (arrayx[index7 * 2] * Math.cos(CPUAngle[index] * Math.PI / 180) - arrayy[index7 * 2] * Math.sin(CPUAngle[index] * Math.PI / 180)), CPUPY[index] + (arrayy[index7 * 2] * Math.cos(CPUAngle[index] * Math.PI / 180) + arrayx[index7 * 2] * Math.sin(CPUAngle[index] * Math.PI / 180)), arrayh[index7 * 2] - carYOffset, CPUPX[index] + (arrayx[index7 * 2 + 1] * Math.cos(CPUAngle[index] * Math.PI / 180) - arrayy[index7 * 2 + 1] * Math.sin(CPUAngle[index] * Math.PI / 180)), CPUPY[index] + (arrayy[index7 * 2 + 1] * Math.cos(CPUAngle[index] * Math.PI / 180) + arrayx[index7 * 2 + 1] * Math.sin(CPUAngle[index] * Math.PI / 180)), arrayh[index7 * 2 + 1])
                    }
                }
            }
        }
        for (let index = 0; index <= 5; index++) {
            arrayx2.push(px + (arrayx[index * 2 + 24] * Math.cos((heading + cameraOffset) * Math.PI / 180) - arrayy[index * 2 + 24] * Math.sin((heading + cameraOffset) * Math.PI / 180)))
            arrayx2.push(px + (arrayx[index * 2 + (24 + 1)] * Math.cos((heading + cameraOffset) * Math.PI / 180) - arrayy[index * 2 + (24 + 1)] * Math.sin((heading + cameraOffset) * Math.PI / 180)))
            arrayy2.push(py + (arrayy[index * 2 + 24] * Math.cos((heading + cameraOffset) * Math.PI / 180) + arrayx[index * 2 + 24] * Math.sin((heading + cameraOffset) * Math.PI / 180)))
            arrayy2.push(py + (arrayy[index * 2 + (24 + 1)] * Math.cos((heading + cameraOffset) * Math.PI / 180) + arrayx[index * 2 + (24 + 1)] * Math.sin((heading + cameraOffset) * Math.PI / 180)))
            arrayh2.push(arrayh[index * 2 + 24] - carYOffset)
            arrayh2.push(arrayh[index * 2 + (24 + 1)] - carYOffset)
        }
        for (let index7 = 0; index7 <= arrayx2.length / 2; index7++) {
            renderer.place3dLine(9, arrayx2[index7 * 2], arrayy2[index7 * 2], arrayh2[index7 * 2], arrayx2[index7 * 2 + 1], arrayy2[index7 * 2 + 1], arrayh2[index7 * 2 + 1])
            renderer.place3dLine(9, arrayx2[index7 * 2], arrayy2[index7 * 2], arrayh2[index7 * 2], arrayx2[index7 * 2 + 12], arrayy2[index7 * 2 + 12], arrayh2[index7 * 2 + 12])
        }
        if (arrayx2.length >= 48) {
            for (let index = 0; index < 12; index++) {
                arrayx2.shift()
                arrayy2.shift()
                arrayh2.shift()
            }
        }
        coinRotation += 1
    }
})
game.onUpdate(function () {
    if (tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile`)) {
    	
    }
    if (tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile9`)) {
        if (PlayerCP == 7) {
            if (PlayerLapCount < 100) {
                PlayerLapCount += 1
            } else {
                endRace()
            }
        }
        PlayerCP = 0
        cp1 = assets.tile`myTile11`
        cp2 = assets.tile`myTile12`
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile11`) || tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile12`)) {
        PlayerCP = 1
        cp1 = assets.tile`myTile13`
        cp2 = assets.tile`myTile14`
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile13`) || tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile14`)) {
        PlayerCP = 2
        cp1 = assets.tile`myTile15`
        cp2 = assets.tile`myTile16`
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile15`) || tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile16`)) {
        PlayerCP = 3
        cp1 = assets.tile`myTile17`
        cp2 = assets.tile`myTile18`
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile17`) || tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile18`)) {
        PlayerCP = 4
        cp1 = assets.tile`myTile19`
        cp2 = assets.tile`myTile20`
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile19`) || tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile20`)) {
        PlayerCP = 5
        cp1 = assets.tile`myTile21`
        cp2 = assets.tile`myTile22`
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile21`) || tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile22`)) {
        PlayerCP = 6
        cp1 = assets.tile`myTile23`
        cp2 = assets.tile`myTile24`
    } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile23`) || tiles.tileAtLocationEquals(tiles.getTileLocation(px / 16, py / 16), assets.tile`myTile24`)) {
        PlayerCP = 7
        cp1 = assets.tile`myTile9`
        cp2 = assets.tile`myTile9`
    } else {
    	
    }
    dis2 = 99999
    for (let value of tiles.getTilesByType(cp1)) {
        if (dis2 > Math.sqrt((px - value.x) * (px - value.x) + (py - value.y) * (py - value.y))) {
            dis2 = Math.sqrt((px - value.x) * (px - value.x) + (py - value.y) * (py - value.y))
        }
    }
    for (let value of tiles.getTilesByType(cp2)) {
        if (dis2 > Math.sqrt((px - value.x) * (px - value.x) + (py - value.y) * (py - value.y))) {
            dis2 = Math.sqrt((px - value.x) * (px - value.x) + (py - value.y) * (py - value.y))
        }
    }
    playerPlacementNum = (7 - PlayerCP) * 1000 + dis2 + (3 - PlayerLapCount) * 10000
    for (let index = 0; index <= 6; index++) {
        if (tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile9`)) {
            if (CPUCounter[index] == 7) {
                if (CPULapCount[index] < 100) {
                    CPULapCount[index] = CPULapCount[index] + 1
                }
            }
            CPUCounter[index] = 0
            CPUCP1[index] = assets.tile`myTile11`
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile11`) || tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile12`)) {
            CPUCounter[index] = 1
            CPUCP1[index] = assets.tile`myTile13`
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile13`) || tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile14`)) {
            CPUCounter[index] = 2
            CPUCP1[index] = assets.tile`myTile15`
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile15`) || tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile16`)) {
            CPUCounter[index] = 3
            CPUCP1[index] = assets.tile`myTile17`
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile17`) || tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile18`)) {
            CPUCounter[index] = 4
            CPUCP1[index] = assets.tile`myTile19`
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile19`) || tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile20`)) {
            CPUCounter[index] = 5
            CPUCP1[index] = assets.tile`myTile21`
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile21`) || tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile22`)) {
            CPUCounter[index] = 6
            CPUCP1[index] = assets.tile`myTile23`
        } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile23`) || tiles.tileAtLocationEquals(tiles.getTileLocation(CPUPX[index] / 16, CPUPY[index] / 16), assets.tile`myTile24`)) {
            CPUCounter[index] = 7
            CPUCP1[index] = assets.tile`myTile9`
        }
    }
})
game.onUpdate(function () {
	
})
game.onUpdateInterval(700, function () {
    timer.background(function () {
        placement = Math.constrain(placement, 1, 8)
        info.setScore(placement)
        placement = 1
        for (let index = 0; index <= 6; index++) {
            dis2 = 99999
            for (let value of tiles.getTilesByType(CPUCP1[index])) {
                dis3 = Math.sqrt((CPUPX[index] - value.x) * (CPUPX[index] - value.x) + (CPUPY[index] - value.y) * (CPUPY[index] - value.y))
                if (dis2 > dis3) {
                    dis2 = dis3
                }
            }
            if (playerPlacementNum > (7 - CPUCounter[index]) * 1000 + dis2 + (3 - CPULapCount[index]) * 10000) {
                placement += 1
                if (CPUSpeed[index] > 1) {
                    CPUSpeed[index] = CPUSpeed[index] - 0.001
                }
            } else {
                if (CPUSpeed[index] < 3) {
                    CPUSpeed[index] = CPUSpeed[index] + 0.001
                }
            }
            pause(100)
        }
    })
})
forever(function () {
	
})
game.onUpdateInterval(500, function () {
	
})
