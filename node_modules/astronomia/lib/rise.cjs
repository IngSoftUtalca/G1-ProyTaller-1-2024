'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base = require('./base.cjs');
var deltat = require('./deltat.cjs');
var elliptic = require('./elliptic.cjs');
var interpolation = require('./interpolation.cjs');
var julian = require('./julian.cjs');
var sexagesimal = require('./sexagesimal.cjs');
var sidereal = require('./sidereal.cjs');
require('./globe.cjs');
require('./coord.cjs');
require('./nutation.cjs');

/* eslint key-spacing: 1 */
const { acos, asin, cos, sin } = Math;

/**
 * @typedef {object} RiseObj
 * @property {number} rise - in seconds
 * @property {number} transit - in seconds
 * @property {number} set - in seconds
 */

const SECS_PER_DEGREE = 240; // = 86400 / 360
const SECS_PER_DAY = 86400;
const D2R = Math.PI / 180;

const errorAboveHorizon = base["default"].errorCode('always above horizon', -1);
const errorBelowHorizon = base["default"].errorCode('always below horizon', 1);

/**
 * mean refraction of the atmosphere
 */
const meanRefraction = new sexagesimal["default"].Angle(false, 0, 34, 0).rad();

/**
 * "Standard altitudes" for various bodies already including `meanRefraction` of 0°34'
 *
 * The standard altitude is the geometric altitude of the center of body
 * at the time of apparent rising or seting.
 */
const stdh0 = {
  stellar: -meanRefraction,
  solar: new sexagesimal["default"].Angle(true, 0, 50, 0).rad(),
  // not containing meanRefraction
  lunar: sexagesimal["default"].angleFromDeg(0.7275),
  lunarMean: sexagesimal["default"].angleFromDeg(0.125)
};

/**
 * Helper function to obtain corrected refraction
 * @param {number} h0 - altitude of the body in radians containing `meanRefraction` of 0°34'
 * @param {number} [corr] - the calcluated refraction e.g. from package `refraction` in radians
 * @return {number} refraction value in radians
 */
function refraction (h0, corr) {
  if (!corr) {
    return h0
  } else {
    return h0 - meanRefraction - corr
  }
}

/**
 * standard altitude for stars, planets at apparent rising, seting
 */
const stdh0Stellar = (_refraction) => refraction(stdh0.stellar, _refraction);
const Stdh0Stellar = stdh0Stellar(); // for backward-compatibility
/**
 * standard altitude for sun for upper limb of the disk
 */
const stdh0Solar = (_refraction) => refraction(stdh0.solar, _refraction);
const Stdh0Solar = stdh0Solar(); // for backward-compatibility

/**
 * standard altitude for moon (low accuracy)
 */
const stdh0LunarMean = (_refraction) => {
  return stdh0.lunarMean - refraction(_refraction)
};
const Stdh0LunarMean = stdh0LunarMean(); // for backward-compatibility
/**
 * Stdh0Lunar is the standard altitude of the Moon considering π, the
 * Moon's horizontal parallax.
 * @param {number} π - the Moon's horizontal parallax
 * @param {number} [refraction] - optional value for refraction in radians if
 *        omitted than meanRefraction is used
 * @return {number} altitude of Moon in radians
 */
const stdh0Lunar = (π, refraction) => {
  return stdh0.lunar * π - (refraction || meanRefraction)
};
const Stdh0Lunar = stdh0Lunar; // for backward-compatibility

/**
 * @return {number} local angle in radians
 */
function hourAngle (lat, h0, δ) {
  // approximate local hour angle
  const cosH = (sin(h0) - sin(lat) * sin(δ)) / (cos(lat) * cos(δ)); // (15.1) p. 102
  if (cosH < -1) {
    throw errorAboveHorizon
  } else if (cosH > 1) {
    throw errorBelowHorizon
  }
  const H = acos(cosH);
  return H
}

/**
 * @param {number} lon - longitude in radians
 * @param {number} α - right ascension in radians
 * @param {number} th0 - sidereal.apparent0UT in seconds of day `[0...86400[`
 * @return {number} time of transit in seconds of day `[0, 86400[`
 */
function _mt (lon, α, th0) {
  // const mt = (((lon + α) * 180 / Math.PI - (th0 * 360 / 86400)) * 86400 / 360)
  const mt = (lon + α) * SECS_PER_DEGREE * 180 / Math.PI - th0;
  return mt
}

/**
 * @param {number} Th0 - sidereal.apparent0UT in seconds of day `[0...86400[`
 * @param {number} m - motion in seconds of day `[0...86400[`
 * @return {number} new siderial time seconds of day `[0...86400[`
 */
function _th0 (Th0, m) {
  // in original formula Th0 = 0...360 and m = 0...1 -> return value would be in 0...360 degrees
  // Th0 /= 240
  // m /= 86400
  const th0 = base["default"].pmod(Th0 + m * 360.985647 / 360, SECS_PER_DAY); // p103
  return th0 // 0...86400 in seconds angle
}

/**
 * maintain backward compatibility - will be removed in v2
 * return value in future will be an object not an array
 * @private
 * @param {RiseObj} rs
 * @return {RiseObj}
 */
function _compatibility (rs) {
  const _rs = [rs.rise, rs.transit, rs.set];
  _rs.rise = rs.rise;
  _rs.transit = rs.transit;
  _rs.set = rs.set;
  return _rs
}

/**
 * ApproxTimes computes approximate UT rise, transit and set times for
 * a celestial object on a day of interest.
 *
 * The function argurments do not actually include the day, but do include
 * values computed from the day.
 *
 * @param {GlobeCoord} p - is geographic coordinates of observer.
 * @param {number} h0 - is "standard altitude" of the body in radians
 * @param {number} Th0 - is apparent sidereal time at 0h UT at Greenwich in seconds
 *        (range 0...86400) must be the time on the day of interest, in seconds.
 *        See sidereal.apparent0UT
 * @param {number} α - right ascension (radians)
 * @param {number} δ - declination (radians)
 * @return {RiseObj} Result units are seconds and are in the range [0,86400)
 * @throws Error
 */
function approxTimes (p, h0, Th0, α, δ) {
  const H0 = hourAngle(p.lat, h0, δ) * SECS_PER_DEGREE * 180 / Math.PI; // in degrees per day === seconds
  // approximate transit, rise, set times.
  // (15.2) p. 102.0
  const mt = _mt(p.lon, α, Th0);
  const rs = {};
  rs.transit = base["default"].pmod(mt, SECS_PER_DAY);
  rs.rise = base["default"].pmod(mt - H0, SECS_PER_DAY);
  rs.set = base["default"].pmod(mt + H0, SECS_PER_DAY);
  return _compatibility(rs)
}

/**
 * Times computes UT rise, transit and set times for a celestial object on
 * a day of interest.
 *
 * The function argurments do not actually include the day, but do include
 * a number of values computed from the day.
 *
 * @param {GlobeCoord} p - is geographic coordinates of observer.
 * @param {number} ΔT - is delta T in seconds
 * @param {number} h0 - is "standard altitude" of the body in radians
 * @param {number} Th0 - is apparent sidereal time at 0h UT at Greenwich in seconds
 *        (range 0...86400) must be the time on the day of interest, in seconds.
 *        See sidereal.apparent0UT
 * @param {Array<number>} α3 - slices of three right ascensions
 * @param {Array<number>} δ3 - slices of three declinations.
 *        α3, δ3 must be values at 0h dynamical time for the day before, the day of,
 *        and the day after the day of interest.  Units are radians.
 *
 * @return {RiseObj} Result units are seconds and are in the range [0,86400)
 * @throws Error
 */
function times (p, ΔT, h0, Th0, α3, δ3) { // (p globe.Coord, ΔT, h0, Th0 float64, α3, δ3 []float64)  (mRise, mTransit, mSet float64, err error)
  const rs = approxTimes(p, h0, Th0, α3[1], δ3[1]);
  const d3α = new interpolation["default"].Len3(-SECS_PER_DAY, SECS_PER_DAY, α3);
  const d3δ = new interpolation["default"].Len3(-SECS_PER_DAY, SECS_PER_DAY, δ3);

  // adjust mTransit
  const ut = rs.transit + ΔT;
  const α = d3α.interpolateX(ut);
  const th0 = _th0(Th0, rs.transit);
  const H = -1 * _mt(p.lon, α, th0); // in secs // Hmeus = 0...360
  rs.transit -= H;

  // adjust mRise, mSet
  const [sLat, cLat] = base["default"].sincos(p.lat);

  const adjustRS = function (m) {
    const ut = m + ΔT;
    const α = d3α.interpolateX(ut);
    const δ = d3δ.interpolateX(ut);
    const th0 = _th0(Th0, m);
    const H = -1 * _mt(p.lon, α, th0);
    const Hrad = (H / SECS_PER_DEGREE) * D2R;
    const h = asin(((sLat * sin(δ)) + (cLat * cos(δ) * cos(Hrad)))); // formula 13.6
    const Δm = (SECS_PER_DAY * (h - h0) / (cos(δ) * cLat * sin(Hrad) * 2 * Math.PI)); // formula p103 3
    return m + Δm
  };

  rs.rise = adjustRS(rs.rise);
  rs.set = adjustRS(rs.set);

  return _compatibility(rs)
}

/**
 * RisePlanet computes rise, transit and set times for a planet on a day of interest.
 */
class PlanetRise {
  /**
   * @param {number|Date} jd - Julian Day starting at midnight or Date object
   * @param {number} lat - geographic latitude of the observerin degrees
   * @param {number} lon - geographic longitude of the observer in degrees (measured positively westward)
   * @param {Planet} earth - VSOP87 Planet object for Earth
   * @param {Planet} planet - VSOP87 Planet object of observed body
   * @param {object} [opts]
   * @param {boolean} [opts.date] - return times as Date objects
   * @param {number} [opts.refraction] - use different refraction than `stdh0Stellar`
   */
  constructor (jd, lat, lon, earth, planet, opts) {
    this.opts = opts || {};
    this.refraction = this.opts.refraction || stdh0Stellar();
    if (jd instanceof Date) {
      jd = new julian["default"].Calendar().fromDate(jd).toJD();
    }
    this.jd = Math.floor(jd - 0.5) + 0.5; // start at midnight
    this.lat = lat * D2R; // convert to radians
    this.lon = lon * D2R;
    const cal = new julian["default"].Calendar().fromJD(this.jd);
    this.jde = cal.toJDE();
    this.ΔT = deltat["default"].deltaT(cal.toYear());
    this.earth = earth;
    this.planet = planet;
  }

  approxTimes () {
    const body = elliptic["default"].position(this.planet, this.earth, this.jde);
    const Th0 = sidereal["default"].apparent0UT(this.jd);
    const rs = approxTimes(
      { lat: this.lat, lon: this.lon }, this.refraction,
      Th0, body.ra, body.dec
    );
    return this._rsToJD(rs)
  }

  times () {
    const body = [
      elliptic["default"].position(this.planet, this.earth, this.jde - 1),
      elliptic["default"].position(this.planet, this.earth, this.jde),
      elliptic["default"].position(this.planet, this.earth, this.jde + 1)
    ];
    const Th0 = sidereal["default"].apparent0UT(this.jd);
    const rs = times(
      { lat: this.lat, lon: this.lon }, this.ΔT, this.refraction,
      Th0, this._toArr(body, 'ra'), this._toArr(body, 'dec')
    );
    return this._rsToJD(rs)
  }

  /** @private */
  _toArr (body, p) {
    return body.map((item) => {
      return item[p]
    })
  }

  /** @private */
  _rsToJD (rs) {
    return {
      rise: this._toJD(rs.rise),
      transit: this._toJD(rs.transit),
      set: this._toJD(rs.set)
    }
  }

  /** @private */
  _toJD (secs) {
    const jd = this.jd + secs / 86400;
    if (this.opts.date) {
      return new julian["default"].Calendar().fromJD(jd).toDate()
    } else {
      return jd
    }
  }
}

var rise = {
  errorAboveHorizon,
  errorBelowHorizon,
  meanRefraction,
  stdh0,
  refraction,
  stdh0Stellar,
  Stdh0Stellar,
  stdh0Solar,
  Stdh0Solar,
  stdh0LunarMean,
  Stdh0LunarMean,
  stdh0Lunar,
  Stdh0Lunar,
  hourAngle,
  approxTimes,
  times,
  PlanetRise
};

exports.PlanetRise = PlanetRise;
exports.Stdh0Lunar = Stdh0Lunar;
exports.Stdh0LunarMean = Stdh0LunarMean;
exports.Stdh0Solar = Stdh0Solar;
exports.Stdh0Stellar = Stdh0Stellar;
exports.approxTimes = approxTimes;
exports["default"] = rise;
exports.errorAboveHorizon = errorAboveHorizon;
exports.errorBelowHorizon = errorBelowHorizon;
exports.hourAngle = hourAngle;
exports.meanRefraction = meanRefraction;
exports.refraction = refraction;
exports.stdh0 = stdh0;
exports.stdh0Lunar = stdh0Lunar;
exports.stdh0LunarMean = stdh0LunarMean;
exports.stdh0Solar = stdh0Solar;
exports.stdh0Stellar = stdh0Stellar;
exports.times = times;
