'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base = require('./base.cjs');
var coord = require('./coord.cjs');
var nutation = require('./nutation.cjs');

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module solar
 */

/**
 * True returns true geometric longitude and anomaly of the sun referenced to the mean equinox of date.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Object}
 *   {Number} lon = true geometric longitude, ☉, in radians
 *   {Number} ano = true anomaly in radians
 */
function trueLongitude (T) {
  // (25.2) p. 163
  const L0 = base["default"].horner(T, 280.46646, 36000.76983, 0.0003032) *
    Math.PI / 180;
  const m = meanAnomaly(T);
  const C = (base["default"].horner(T, 1.914602, -0.004817, -0.000014) *
    Math.sin(m) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * m) +
    0.000289 * Math.sin(3 * m)) * Math.PI / 180;
  const lon = base["default"].pmod(L0 + C, 2 * Math.PI);
  const ano = base["default"].pmod(m + C, 2 * Math.PI);
  return { lon, ano }
}

/**
 * meanAnomaly returns the mean anomaly of Earth at the given T.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} Result is in radians and is not normalized to the range 0..2π.
 */
function meanAnomaly (T) {
  // (25.3) p. 163
  return base["default"].horner(T, 357.52911, 35999.05029, -0.0001537) * Math.PI / 180
}

/**
 * eccentricity returns eccentricity of the Earth's orbit around the sun.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} eccentricity of the Earth's orbit around the sun.
 */
function eccentricity (T) {
  // (25.4) p. 163
  return base["default"].horner(T, 0.016708634, -0.000042037, -0.0000001267)
}

/**
 * Radius returns the Sun-Earth distance in AU.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} Sun-Earth distance in AU
 */
function radius (T) {
  const {lon, ano} = trueLongitude(T); // eslint-disable-line
  const e = eccentricity(T);
  // (25.5) p. 164
  return 1.000001018 * (1 - e * e) / (1 + e * Math.cos(ano))
}

/**
 * ApparentLongitude returns apparent longitude of the Sun referenced to the true equinox of date.
 * Result includes correction for nutation and aberration.  Unit is radians.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Number} apparent longitude of the Sun referenced to the true equinox of date.
 */
function apparentLongitude (T) {
  const Ω = node(T);
  const {lon, ano} = trueLongitude(T); // eslint-disable-line
  return lon - 0.00569 * Math.PI / 180 - 0.00478 * Math.PI / 180 * Math.sin(Ω)
}

/**
 * @private
 */
function node (T) {
  return 125.04 * Math.PI / 180 - 1934.136 * Math.PI / 180 * T
}

/**
 * true2000 returns true geometric longitude and anomaly of the sun referenced to equinox J2000.
 * Results are accurate to .01 degree for years 1900 to 2100.
 *
 * @param {Number} T - number of Julian centuries since J2000. See base.J2000Century.
 * @returns {Object}
 *   {Number} lon - true geometric longitude, ☉, in radians
 *   {Number} ano - true anomaly in radians
 */
function true2000 (T) {
  let { lon, ano } = trueLongitude(T);
  lon -= 0.01397 * Math.PI / 180 * T * 100;
  return { lon, ano }
}

/**
 * trueEquatorial returns the true geometric position of the Sun as equatorial coordinates.
 *
 * @param {Number} jde - Julian ephemeris day
 * @returns {Coord}
 *   {Number} ra - right ascension in radians
 *   {Number} dec - declination in radians
 */
function trueEquatorial (jde) {
  const {lon, ano} = trueLongitude(base["default"].J2000Century(jde)); // eslint-disable-line
  const ε = nutation["default"].meanObliquity(jde);
  const [ss, cs] = base["default"].sincos(lon);
  const [sε, cε] = base["default"].sincos(ε);
  // (25.6, 25.7) p. 165
  const ra = Math.atan2(cε * ss, cs);
  const dec = sε * ss;
  return new base["default"].Coord(ra, dec)
}

/**
 * apparentEquatorial returns the apparent position of the Sun as equatorial coordinates.
 *
 * @param {Number} jde - Julian ephemeris day
 * @returns {Coord}
 *   {Number} ra - right ascension in radians
 *   {Number} dec - declination in radians
 */
function apparentEquatorial (jde) {
  const T = base["default"].J2000Century(jde);
  const λ = apparentLongitude(T);
  const ε = nutation["default"].meanObliquity(jde);
  const [sλ, cλ] = base["default"].sincos(λ);
  // (25.8) p. 165
  const [sε, cε] = base["default"].sincos(ε + 0.00256 * Math.PI / 180 * Math.cos(node(T)));
  const ra = Math.atan2(cε * sλ, cλ);
  const dec = Math.asin(sε * sλ);
  return new base["default"].Coord(ra, dec)
}

/**
 * trueVSOP87 returns the true geometric position of the sun as ecliptic coordinates.
 *
 * Result computed by full VSOP87 theory.  Result is at equator and equinox
 * of date in the FK5 frame.  It does not include nutation or aberration.
 *
 * @param {Planet} planet
 * @param {Number} jde - Julian ephemeris day
 * @returns {Object}
 *   {Number} lon - ecliptic longitude in radians
 *   {Number} lat - ecliptic latitude in radians
 *   {Number} range - range in AU
 */
function trueVSOP87 (planet, jde) {
  let { lon, lat, range } = planet.position(jde);
  const s = lon + Math.PI;
  // FK5 correction.
  const λp = base["default"].horner(base["default"].J2000Century(jde),
    s, -1.397 * Math.PI / 180, -0.00031 * Math.PI / 180);
  const [sλp, cλp] = base["default"].sincos(λp);
  const Δβ = 0.03916 / 3600 * Math.PI / 180 * (cλp - sλp);
  // (25.9) p. 166
  lon = base["default"].pmod(s - 0.09033 / 3600 * Math.PI / 180, 2 * Math.PI);
  lat = Δβ - lat;
  return new base["default"].Coord(lon, lat, range)
}

/**
 * apparentVSOP87 returns the apparent position of the sun as ecliptic coordinates.
 *
 * Result computed by VSOP87, at equator and equinox of date in the FK5 frame,
 * and includes effects of nutation and aberration.
 *
 * @param {Planet} planet
 * @param {Number} jde - Julian ephemeris day
 * @returns {Coord}
 *   {Number} lon - ecliptic longitude in radians
 *   {Number} lat - ecliptic latitude in radians
 *   {Number} range - range in AU
 */
function apparentVSOP87 (planet, jde) {
  // note: see duplicated code in ApparentEquatorialVSOP87.
  let { lon, lat, range } = trueVSOP87(planet, jde);
  const Δψ = nutation["default"].nutation(jde)[0];
  const a = aberration(range);
  lon = lon + Δψ + a;
  return new base["default"].Coord(lon, lat, range)
}

/**
 * apparentEquatorialVSOP87 returns the apparent position of the sun as equatorial coordinates.
 *
 * Result computed by VSOP87, at equator and equinox of date in the FK5 frame,
 * and includes effects of nutation and aberration.
 *
 * @param {Planet} planet
 * @param {Number} jde - Julian ephemeris day
 * @returns {Coord}
 *   {Number} ra - right ascension in radians
 *   {Number} dec - declination in radians
 *   {Number} range - range in AU
 */
function apparentEquatorialVSOP87 (planet, jde) {
  // note: duplicate code from ApparentVSOP87 so we can keep Δε.
  // see also duplicate code in time.E().
  const { lon, lat, range } = trueVSOP87(planet, jde);
  const [Δψ, Δε] = nutation["default"].nutation(jde);
  const a = aberration(range);
  const λ = lon + Δψ + a;
  const ε = nutation["default"].meanObliquity(jde) + Δε;
  const { ra, dec } = new coord["default"].Ecliptic(λ, lat).toEquatorial(ε);
  return new base.Coord(ra, dec, range)
}

/**
 * Low precision formula.  The high precision formula is not implemented
 * because the low precision formula already gives position results to the
 * accuracy given on p. 165.  The high precision formula represents lots
 * of typing with associated chance of typos, and no way to test the result.
 * @param {Number} range
 * @returns {Number} aberation
 */
function aberration (range) {
  // (25.10) p. 167
  return -20.4898 / 3600 * Math.PI / 180 / range
}

var solar = {
  trueLongitude,
  true: trueLongitude, // BACKWARDS-COMPATIBILITY
  meanAnomaly,
  eccentricity,
  radius,
  apparentLongitude,
  true2000,
  trueEquatorial,
  apparentEquatorial,
  trueVSOP87,
  apparentVSOP87,
  apparentEquatorialVSOP87,
  aberration
};

exports.aberration = aberration;
exports.apparentEquatorial = apparentEquatorial;
exports.apparentEquatorialVSOP87 = apparentEquatorialVSOP87;
exports.apparentLongitude = apparentLongitude;
exports.apparentVSOP87 = apparentVSOP87;
exports["default"] = solar;
exports.eccentricity = eccentricity;
exports.meanAnomaly = meanAnomaly;
exports.radius = radius;
exports.true2000 = true2000;
exports.trueEquatorial = trueEquatorial;
exports.trueLongitude = trueLongitude;
exports.trueVSOP87 = trueVSOP87;
