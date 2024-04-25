'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base = require('./base.cjs');
var sexagesimal = require('./sexagesimal.cjs');
var coord = require('./coord.cjs');
var precess = require('./precess.cjs');

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module planetposition
 */

function sum (t, series) {
  const coeffs = [];
  Object.keys(series).forEach((x) => {
    coeffs[x] = 0;
    let y = series[x].length - 1;
    for (y; y >= 0; y--) {
      const term = {
        a: series[x][y][0],
        b: series[x][y][1],
        c: series[x][y][2]
      };
      coeffs[x] += term.a * Math.cos(term.b + term.c * t);
    }
  });
  const res = base["default"].horner(t, ...coeffs);
  return res
}

class Planet {
  /**
   * VSOP87 representation of a Planet
   * @constructs Planet
   * @param {object} planet - planet data series
   * @example
   * ```js
   * // for use in browser
   * import {data} from 'astronomia'
   * const earth = new planetposition.Planet(data.vsop87Bearth)
   * ```
   */
  constructor (planet) {
    if (typeof planet !== 'object') throw new TypeError('need planet vsop87 data')
    this.name = planet.name;
    this.type = planet.type || 'B';
    this.series = planet;
  }

  /**
   * Position2000 returns ecliptic position of planets by full VSOP87 theory.
   *
   * @param {Number} jde - the date for which positions are desired.
   * @returns {Coord} Results are for the dynamical equinox and ecliptic J2000.
   *  {Number} lon - heliocentric longitude in radians.
   *  {Number} lat - heliocentric latitude in radians.
   *  {Number} range - heliocentric range in AU.
   */
  position2000 (jde) {
    const T = base["default"].J2000Century(jde);
    const τ = T * 0.1;
    const lon = base["default"].pmod(sum(τ, this.series.L), 2 * Math.PI);
    const lat = sum(τ, this.series.B);
    const range = sum(τ, this.series.R);

    switch (this.type) {
      case 'B':
        return new base["default"].Coord(lon, lat, range)
      case 'D': {
        const eclFrom = new coord["default"].Ecliptic(lon, lat);
        const epochFrom = base["default"].JDEToJulianYear(jde);
        const epochTo = 2000.0;
        const eclTo = precess["default"].eclipticPosition(eclFrom, epochFrom, epochTo);
        return new base["default"].Coord(eclTo.lon, eclTo.lat, range)
      }
    }
  }

  /**
   * Position returns ecliptic position of planets at equinox and ecliptic of date.
   *
   * @param {Number} jde - the date for which positions are desired.
   * @returns {Coord} Results are positions consistent with those from Meeus's
   * Apendix III, that is, at equinox and ecliptic of date.
   *  {Number} lon - heliocentric longitude in radians.
   *  {Number} lat - heliocentric latitude in radians.
   *  {Number} range - heliocentric range in AU.
   */
  position (jde) {
    const T = base["default"].J2000Century(jde);
    const τ = T * 0.1;
    const lon = base["default"].pmod(sum(τ, this.series.L), 2 * Math.PI);
    const lat = sum(τ, this.series.B);
    const range = sum(τ, this.series.R);

    switch (this.type) {
      case 'B': {
        const eclFrom = new coord["default"].Ecliptic(lon, lat);
        const epochFrom = 2000.0;
        const epochTo = base["default"].JDEToJulianYear(jde);
        const eclTo = precess["default"].eclipticPosition(eclFrom, epochFrom, epochTo);
        return new base["default"].Coord(eclTo.lon, eclTo.lat, range)
      }
      case 'D':
        return new base["default"].Coord(lon, lat, range)
    }
  }
}

/**
 * ToFK5 converts ecliptic longitude and latitude from dynamical frame to FK5.
 *
 * @param {Number} lon - ecliptic longitude in radians
 * @param {Number} lat - ecliptic latitude in radians
 * @param {Number} jde - Julian ephemeris day
 * @return {Coord}
 *    {Number} lon - FK5 longitude
 *    {Number} lat - FK5 latitude
 */
function toFK5 (lon, lat, jde) {
  // formula 32.3, p. 219.
  const T = base["default"].J2000Century(jde);
  // const Lp = lon - 1.397 * Math.PI / 180 * T - 0.00031 * Math.PI / 180 * T * T
  const Lp = lon - sexagesimal["default"].angleFromDeg((1.397 + 0.00031 * T) * T);
  const [sLp, cLp] = base["default"].sincos(Lp);
  // (32.3) p. 219
  const L5 = lon + sexagesimal["default"].angleFromSec(-0.09033 + 0.03916 * (cLp + sLp) * Math.tan(lat));
  const B5 = lat + sexagesimal["default"].angleFromSec(0.03916 * (cLp - sLp));
  return new base["default"].Coord(L5, B5)
}

var planetposition = {
  Planet,
  toFK5
};

exports.Planet = Planet;
exports["default"] = planetposition;
exports.toFK5 = toFK5;
