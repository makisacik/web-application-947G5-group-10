function copyArray(arr) {
  return arr.map((row) => (Array.isArray(row) ? copyArray(row) : row));
}

const threeDArray = [
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],

  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],

  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],

  [
    [0, 0],
    [0, 0],
  ],

  [[0]],
];

const pieces_s = `
...
. .

  ..
...

 .
..
 ..

 .
...

 .
....

 ..
...

 ..
.. 

..
.
.

...
  .
  .

.
....

.
..

..
 ..
  .
`;

function printPiece(piece) {
  const [w, d, h, ps] = piece;
  console.log(piece);
  for (let z = 0; z < h; z++) {
    for (let y = z & 1; y < d; y += 2) {
      const s = Array(w).fill(" ");
      for (let x = z & 1; x < w; x += 2) {
        if (ps.some(([pz, px, py]) => pz === z && px === x && py === y)) {
          s[x] = "*";
        }
      }
      console.log(s.join(""));
    }
    console.log("----");
  }
}

function makePiece(p) {
  const rows = p.split("\n");
  let d = (rows.length - 1) * 2 + 1;
  let mx = 0;
  const sparse = [];

  for (let y = 0; y < rows.length; y++) {
    const r = rows[y];
    for (let x = 0; x < r.length; x++) {
      const i = r[x];
      if (i === ".") {
        if (x > mx) {
          mx = x;
        }
        sparse.push([0, x * 2, y * 2]);
      }
    }
  }

  sparse.sort((a, b) => a[1] - b[1]);

  return [mx * 2 + 1, d, 1, sparse];
}

const pieces = pieces_s.slice(1, -1).split("\n\n").map(makePiece);

console.log("pieces:", pieces);
console.log("pieces", pieces.length);

//print pieces array
for (let i = 0; i < pieces.length; i++) {
  console.log("Piece index: ", i);
  printPiece(pieces[i]);
}

function rotateRight(p) {
  const [w, d, h, s] = p;
  let wo = w;
  if (wo & 1) {
    wo -= 1;
  }
  const rs = s.map(([z, x, y]) => [z, y, wo - x]).sort();
  return [d, w, h, rs];
}

function rotateXY_Z(b) {
  const [z, x, y] = b;
  const x2 = Math.floor(x / 2);
  const y2 = Math.floor(y / 2);
  const xy = x2 + y2;
  const z_ = x2 - y2;
  return [z_, xy, xy];
}

function rotateUp(p) {
  const [w, d, h, s] = p;
  const rs = s.map(rotateXY_Z).sort();
  const minZ = rs[0][0];
  const minXY = Math.min(...rs.map(([z, x, y]) => x));
  let xyo = -(minZ & 1);

  if (minXY + xyo < 0) {
    xyo += 2;
  }

  const rsa = rs.map(([z, x, y]) => [z - minZ, x + xyo, y + xyo]);
  const maxZ = rs[rs.length - 1][0];
  const wd = Math.max(...rsa.map(([z, x]) => x)) + 1;

  return [wd, wd, maxZ - minZ + 1, rsa];
}

function isEqual(arr1, arr2) {
  if (arr1 === arr2) {
    return true; // Same reference or both are null/undefined
  }

  if (
    !Array.isArray(arr1) ||
    !Array.isArray(arr2) ||
    arr1.length !== arr2.length
  ) {
    return false; // Not arrays or different lengths
  }

  for (let i = 0; i < arr1.length; i++) {
    if (!isEqual(arr1[i], arr2[i])) {
      return false; // Recursively check elements
    }
  }

  return true;
}
function* allRotations(p) {
  let c = p;
  for (let r = 0; r < 4; r++) {
    yield c;
    const ru = rotateUp(c);
    yield ru;
    yield rotateRight(ru);
    c = rotateRight(c);
  }
}

function rotations(p) {
  const a = Array.from(allRotations(p));
  a.sort();
  let c = a[0];
  const ret = [c];
  for (const r of a.slice(1)) {
    if (!isEqual(c, r)) {
      ret.push(r);
    }
    c = r;
  }
  return ret;
}

const BASE = 5;
const LIMIT = BASE * 2 - 1;

function inLattice(z, x, y) {
  const layers = BASE;
  const minXY = z;
  const limitXY = LIMIT - z;
  const odd = z & 1;
  return (
    z >= 0 &&
    z < layers &&
    odd === (x & 1) &&
    odd === (y & 1) &&
    x >= minXY &&
    x <= limitXY &&
    y >= minXY &&
    y <= limitXY
  );
}

function validPieceOffset(zo, xo, yo, piece) {
  const [w, d, h, ps] = piece;
  for (const [z, x, y] of ps) {
    if (!inLattice(z + zo, x + xo, y + yo)) {
      return false;
    }
  }
  return true;
}

function offsetIsUsed(zo, xo, yo, piece, used) {
  const [w, d, h, ps] = piece;
  for (const [z, x, y] of ps) {
    if (used[zo + z][xo + x][yo + y]) {
      return true;
    }
  }
  return false;
}

function use(zo, xo, yo, piece, used) {
  const [w, d, h, ps] = piece;
  for (const [z, x, y] of ps) {
    used[zo + z][xo + x][yo + y] = true;
  }
}

function unuse(zo, xo, yo, piece, used) {
  const [w, d, h, ps] = piece;
  for (const [z, x, y] of ps) {
    used[zo + z][xo + x][yo + y] = false;
  }
}

function isUsed(point, used) {
  const [z, x, y] = point;
  return used[z][x][y];
}

const candidates = pieces.map((p) => rotations(p));
const p = pieces[pieces.length - 1];
candidates[candidates.length - 1] = [p, rotateUp(p), rotateRight(rotateUp(p))];

console.log("candidates", candidates);
console.log("candidates length", candidates.length);
// All the positions an item can take
const places = [];
for (let z = 0; z < BASE; z++) {
  for (let x = z; x < LIMIT - z; x += 2) {
    for (let y = z; y < LIMIT - z; y += 2) {
      places.push([z, x, y]);
    }
  }
}

function makeEmptyUsed() {
  return Array.from({ length: BASE }, () =>
    Array.from({ length: LIMIT }, () =>
      Array.from({ length: LIMIT }, () => false)
    )
  );
}

function zOrder(solution) {
  console.log("zOrder");
  console.log(threeDArray);
  const out = [];
  for (const [pc, p, r] of solution) {
    const [w, d, h, points] = candidates[p][r];
    const [z, x, y] = places[pc];
    const [fz, fx, fy] = points[0];
    const xo = x - fx;
    const yo = y - fy;
    const zo = z - fz;
    for (const [zp, xp, yp] of points) {
      out.push([zp + zo, yp + yo, xp + xo, p]);
    }
  }
  out.sort();
  for (let [z, y, x, p] of out) {
    console.log("Piece index: ", p, "x,y,z: ", x, y, z);
    x = x - z;
    y = y - z;
    console.log(Math.floor(x / 2), Math.floor(y / 2), p);
    console.log(threeDArray);
    console.log(
      "threeDarray value: ",
      threeDArray[z][Math.floor(x / 2)][Math.floor(y / 2)]
    );
    threeDArray[z][Math.floor(x / 2)][Math.floor(y / 2)] = p;
  }
  self.postMessage(threeDArray);
  console.log(threeDArray);
  return out;
}

function fs(pc, used, placed, result, solutions) {
  const [z, x, y] = places[pc];
  for (let p = 0; p < candidates.length; p++) {
    if (placed.includes(p)) {
      continue;
    }
    for (let r = 0; r < candidates[p].length; r++) {
      const rotation = candidates[p][r];
      const [w, d, h, points] = rotation;
      const [fz, fx, fy] = points[0];
      const xo = x - fx;
      const yo = y - fy;
      const zo = z - fz;
      if (
        validPieceOffset(zo, xo, yo, rotation) &&
        !offsetIsUsed(zo, xo, yo, rotation, used)
      ) {
        result.push([pc, p, r]);
        //console.log("result.length:", result.length, [...result]);
        if (result.length == 12) {
          zOrder([...result]);
          solutions.push([...result]);
          result.pop();
          return;
        }
        if (result.length === 3) {
          //console.log(solutions.length, [...result]);
        }
        use(zo, xo, yo, rotation, used);
        placed.push(p);
        let npc = pc + 1;
        while (isUsed(places[npc], used)) {
          npc += 1;
        }
        fs(npc, used, placed, result, solutions);
        placed.pop();
        unuse(zo, xo, yo, rotation, used);
        result.pop();
      }
    }
  }
  return;
}

const used = makeEmptyUsed();
const placed = [];
const result = [];
const solutions = [];

const startTime = new Date();

console.log("Algorithm started");

fs(0, used, placed, result, solutions);

const endTime = new Date();

const timeDifference = endTime - startTime;

const elapsedTimeInSeconds = timeDifference / 1000;

console.log(`Elapsed Time: ${elapsedTimeInSeconds} seconds`);

console.log("Algorithm finished. Solutions found: ", solutions.length);
console.log("Solutions: ", solutions);
