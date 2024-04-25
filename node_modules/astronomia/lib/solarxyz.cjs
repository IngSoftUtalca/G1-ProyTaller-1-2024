'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base = require('./base.cjs');
var nutation = require('./nutation.cjs');
var solar = require('./solar.cjs');

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module solarxyz
 */

/**
 * Position returns rectangular coordinates referenced to the mean equinox of date.
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z
 */
function position (earth, jde) { // (e *pp.V87Planet, jde float64)  (x, y, z float64)
  // (26.1) p. 171
  const { lon, lat, range } = solar["default"].trueVSOP87(earth, jde);
  const [sε, cε] = base["default"].sincos(nutation["default"].meanObliquity(jde));
  const [ss, cs] = base["default"].sincos(lon);
  const sβ = Math.sin(lat);
  const x = range * cs;
  const y = range * (ss * cε - sβ * sε);
  const z = range * (ss * sε + sβ * cε);
  return { x, y, z }
}

/**
 * LongitudeJ2000 returns geometric longitude referenced to equinox J2000.
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {Number} geometric longitude referenced to equinox J2000.
 */
function longitudeJ2000 (earth, jde) {
  const lon = earth.position2000(jde).lon;
  return base["default"].pmod(lon + Math.PI - 0.09033 / 3600 * Math.PI / 180, 2 * Math.PI)
}

/**
 * PositionJ2000 returns rectangular coordinates referenced to equinox J2000.
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z
 */
function positionJ2000 (earth, jde) {
  const { x, y, z } = xyz(earth, jde);
  // (26.3) p. 174
  return {
    x: x + 0.00000044036 * y - 0.000000190919 * z,
    y: -0.000000479966 * x + 0.917482137087 * y - 0.397776982902 * z,
    z: 0.397776982902 * y + 0.917482137087 * z
  }
}

function xyz (earth, jde) {
  const { lon, lat, range } = earth.position2000(jde);
  const s = lon + Math.PI;
  const β = -lat;
  const [ss, cs] = base["default"].sincos(s);
  const [sβ, cβ] = base["default"].sincos(β);
  // (26.2) p. 172
  const x = range * cβ * cs;
  const y = range * cβ * ss;
  const z = range * sβ;
  return { x, y, z }
}

/**
 * PositionB1950 returns rectangular coordinates referenced to B1950.
 *
 * Results are referenced to the mean equator and equinox of the epoch B1950
 * in the FK5 system, not FK4.
 *
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z
 */
function positionB1950 (earth, jde) { // (e *pp.V87Planet, jde float64)  (x, y, z float64)
  const { x, y, z } = xyz(earth, jde);
  return {
    x: 0.999925702634 * x + 0.012189716217 * y + 0.000011134016 * z,
    y: -0.011179418036 * x + 0.917413998946 * y - 0.397777041885 * z,
    z: -0.004859003787 * x + 0.397747363646 * y + 0.917482111428 * z
  }
}

const ζt = [2306.2181, 0.30188, 0.017998];
const zt = [2306.2181, 1.09468, 0.018203];
const θt = [2004.3109, -0.42665, -0.041833];

/**
 * PositionEquinox returns rectangular coordinates referenced to an arbitrary epoch.
 *
 * Position will be computed for given Julian day "jde" but referenced to mean
 * equinox "epoch" (year).
 *
 * @param {planetposition.Planet} earth - VSOP87Planet Earth
 * @param {Number} jde - Julian ephemeris day
 * @param {Number} epoch
 * @return {object} rectangular coordinates
 *   {Number} x
 *   {Number} y
 *   {Number} z
 */
function positionEquinox (earth, jde, epoch) {
  const xyz = positionJ2000(earth, jde);
  const x0 = xyz.x;
  const y0 = xyz.y;
  const z0 = xyz.z;
  const t = (epoch - 2000) * 0.01;
  const ζ = base["default"].horner(t, ζt) * t * Math.PI / 180 / 3600;
  const z = base["default"].horner(t, zt) * t * Math.PI / 180 / 3600;
  const θ = base["default"].horner(t, θt) * t * Math.PI / 180 / 3600;
  const [sζ, cζ] = base["default"].sincos(ζ);
  const [sz, cz] = base["default"].sincos(z);
  const [sθ, cθ] = base["default"].sincos(θ);
  const xx = cζ * cz * cθ - sζ * sz;
  const xy = sζ * cz + cζ * sz * cθ;
  const xz = cζ * sθ;
  const yx = -cζ * sz - sζ * cz * cθ;
  const yy = cζ * cz - sζ * sz * cθ;
  const yz = -sζ * sθ;
  const zx = -cz * sθ;
  const zy = -sz * sθ;
  const zz = cθ;
  return {
    x: xx * x0 + yx * y0 + zx * z0,
    y: xy * x0 + yy * y0 + zy * z0,
    z: xz * x0 + yz * y0 + zz * z0
  }
}

var solarxyz = {
  position,
  longitudeJ2000,
  positionJ2000,
  xyz,
  positionB1950,
  positionEquinox
};

exports["default"] = solarxyz;
exports.longitudeJ2000 = longitudeJ2000;
exports.position = position;
exports.positionB1950 = positionB1950;
exports.positionEquinox = positionEquinox;
exports.positionJ2000 = positionJ2000;
exports.xyz = xyz;
