'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base = require('./base.cjs');

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module node
 */

/**
 * EllipticAscending computes time and distance of passage through the ascending node of a body in an elliptical orbit.
 *
 * Argument axis is semimajor axis in AU, ecc is eccentricity, argP is argument
 * of perihelion in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 */
function ellipticAscending (axis, ecc, argP, timeP) { // (axis, ecc, argP, timeP float64)  (jde, r float64)
  return el(-argP, axis, ecc, timeP)
}

/**
 * EllipticAscending computes time and distance of passage through the descending node of a body in an elliptical orbit.
 *
 * Argument axis is semimajor axis in AU, ecc is eccentricity, argP is argument
 * of perihelion in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 */
function ellipticDescending (axis, ecc, argP, timeP) { // (axis, ecc, argP, timeP float64)  (jde, r float64)
  return el(Math.PI - argP, axis, ecc, timeP)
}

function el (ν, axis, ecc, timeP) { // (ν, axis, ecc, timeP float64)  (jde, r float64)
  const E = 2 * Math.atan(Math.sqrt((1 - ecc) / (1 + ecc)) * Math.tan(ν * 0.5));
  const [sE, cE] = base["default"].sincos(E);
  const M = E - ecc * sE;
  const n = base["default"].K / axis / Math.sqrt(axis);
  const jde = timeP + M / n;
  const r = axis * (1 - ecc * cE);
  return [jde, r]
}

/**
 * ParabolicAscending computes time and distance of passage through the ascending node of a body in a parabolic orbit.
 *
 * Argument q is perihelion distance in AU, argP is argument of perihelion
 * in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 */
function parabolicAscending (q, argP, timeP) { // (q, argP, timeP float64)  (jde, r float64)
  return pa(-argP, q, timeP)
}

/**
 * ParabolicDescending computes time and distance of passage through the descending node of a body in a parabolic orbit.
 *
 * Argument q is perihelion distance in AU, argP is argument of perihelion
 * in radians, timeP is time of perihelion as a jd.
 *
 * Result is jde of the event and distance from the sun in AU.
 */
function parabolicDescending (q, argP, timeP) { // (q, argP, timeP float64)  (jde, r float64)
  return pa(Math.PI - argP, q, timeP)
}

function pa (ν, q, timeP) { // (ν, q, timeP float64)  (jde, r float64)
  const s = Math.tan(ν * 0.5);
  const jde = timeP + 27.403895 * s * (s * s + 3) * q * Math.sqrt(q);
  const r = q * (1 + s * s);
  return [jde, r]
}

var node = {
  ellipticAscending,
  ellipticDescending,
  el,
  parabolicAscending,
  parabolicDescending,
  pa
};

exports["default"] = node;
exports.el = el;
exports.ellipticAscending = ellipticAscending;
exports.ellipticDescending = ellipticDescending;
exports.pa = pa;
exports.parabolicAscending = parabolicAscending;
exports.parabolicDescending = parabolicDescending;
