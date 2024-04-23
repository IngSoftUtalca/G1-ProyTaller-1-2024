'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base = require('./base.cjs');

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module parabolic
 */

/**
 * Elements holds parabolic elements needed for computing true anomaly and distance.
 */
class Elements {
  /**
   * @param {Number} timeP - time of perihelion, T
   * @param {Number} pDis - perihelion distance, q
   */
  constructor (timeP, pDis) {
    this.timeP = timeP;
    this.pDis = pDis;
  }

  /**
   * AnomalyDistance returns true anomaly and distance of a body in a parabolic orbit of the Sun.
   *
   * @param {Number} jde - Julian ephemeris day
   * @returns {Object} {ano, dist}
   *   {Number} ano - True anomaly ν in radians.
   *   {Number} dist - Distance r returned in AU.
   */
  anomalyDistance (jde) {
    const W = 3 * base["default"].K / Math.SQRT2 * (jde - this.timeP) / this.pDis / Math.sqrt(this.pDis);
    const G = W * 0.5;
    const Y = Math.cbrt(G + Math.sqrt(G * G + 1));
    const s = Y - 1 / Y;
    const ν = 2 * Math.atan(s);
    const r = this.pDis * (1 + s * s);
    return {
      ano: ν,
      dist: r
    }
  }
}

var parabolic = {
  Elements
};

exports.Elements = Elements;
exports["default"] = parabolic;
