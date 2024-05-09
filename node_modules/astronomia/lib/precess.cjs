'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var base = require('./base.cjs');
var coord = require('./coord.cjs');
var elementequinox = require('./elementequinox.cjs');
var nutation = require('./nutation.cjs');
var sexagesimal = require('./sexagesimal.cjs');

/**
 * @copyright 2013 Sonia Keys
 * @copyright 2016 commenthol
 * @license MIT
 * @module precess
 */

/**
 * approxAnnualPrecession returns approximate annual precision in right
 * ascension and declination.
 *
 * The two epochs should be within a few hundred years.
 * The declinations should not be too close to the poles.
 *
 * @param {Equatorial} eqFrom
 * @param {Number} epochFrom - use `base.JDEToJulianYear(year)` to get epoch
 * @param {Number} epochTo - use `base.JDEToJulianYear(year)` to get epoch
 * @returns {Object}
 *  {sexa.HourAngle} seconds of right ascension
 *  {sexa.Angle} seconds of Declination
 */
function approxAnnualPrecession (eqFrom, epochFrom, epochTo) {
  const [m, na, nd] = mn(epochFrom, epochTo);
  const [sa, ca] = base["default"].sincos(eqFrom.ra);
  // (21.1) p. 132
  const Δαs = m + na * sa * Math.tan(eqFrom.dec); // seconds of RA
  const Δδs = nd * ca; // seconds of Dec
  const ra = new sexagesimal.HourAngle(false, 0, 0, Δαs).rad();
  const dec = new sexagesimal.Angle(false, 0, 0, Δδs).rad();
  return { ra, dec }
}

/**
 * @param {Number} epochFrom - use `base.JDEToJulianYear(year)` to get epoch
 * @param {Number} epochTo - use `base.JDEToJulianYear(year)` to get epoch
 * @returns {Number[]}
 */
function mn (epochFrom, epochTo) {
  const T = (epochTo - epochFrom) * 0.01;
  const m = 3.07496 + 0.00186 * T;
  const na = 1.33621 - 0.00057 * T;
  const nd = 20.0431 - 0.0085 * T;
  return [m, na, nd]
}

/**
 * ApproxPosition uses ApproxAnnualPrecession to compute a simple and quick
 * precession while still considering proper motion.
 *
 * @param {Equatorial} eqFrom
 * @param {Number} epochFrom
 * @param {Number} epochTo
 * @param {Number} mα - in radians
 * @param {Number} mδ - in radians
 * @returns {Equatorial} eqTo
 */
function approxPosition (eqFrom, epochFrom, epochTo, mα, mδ) {
  const { ra, dec } = approxAnnualPrecession(eqFrom, epochFrom, epochTo);
  const dy = epochTo - epochFrom;
  const eqTo = new coord.Equatorial();
  eqTo.ra = eqFrom.ra + (ra + mα) * dy;
  eqTo.dec = eqFrom.dec + (dec + mδ) * dy;
  return eqTo
}

// constants
const d = Math.PI / 180;
const s = d / 3600;

// coefficients from (21.2) p. 134
const ζT = [2306.2181 * s, 1.39656 * s, -0.000139 * s];
const zT = [2306.2181 * s, 1.39656 * s, -0.000139 * s];
const θT = [2004.3109 * s, -0.8533 * s, -0.000217 * s];
// coefficients from (21.3) p. 134
const ζt = [2306.2181 * s, 0.30188 * s, 0.017998 * s];
const zt = [2306.2181 * s, 1.09468 * s, 0.018203 * s];
const θt = [2004.3109 * s, -0.42665 * s, -0.041833 * s];

/**
 * Precessor represents precession from one epoch to another.
 *
 * Construct with NewPrecessor, then call method Precess.
 * After construction, Precess may be called multiple times to precess
 * different coordinates with the same initial and final epochs.
 */
class Precessor {
  /**
   * constructs a Precessor object and initializes it to precess
   * coordinates from epochFrom to epochTo.
   * @param {Number} epochFrom
   * @param {Number} epochTo
   */
  constructor (epochFrom, epochTo) {
    // (21.2) p. 134
    let ζCoeff = ζt;
    let zCoeff = zt;
    let θCoeff = θt;
    if (epochFrom !== 2000) {
      const T = (epochFrom - 2000) * 0.01;
      ζCoeff = [
        base["default"].horner(T, ...ζT),
        0.30188 * s - 0.000344 * s * T,
        0.017998 * s
      ];
      zCoeff = [
        base["default"].horner(T, ...zT),
        1.09468 * s + 0.000066 * s * T,
        0.018203 * s
      ];
      θCoeff = [
        base["default"].horner(T, ...θT),
        -0.42665 * s - 0.000217 * s * T,
        -0.041833 * s
      ];
    }
    const t = (epochTo - epochFrom) * 0.01;
    this.ζ = base["default"].horner(t, ...ζCoeff) * t;
    this.z = base["default"].horner(t, ...zCoeff) * t;
    const θ = base["default"].horner(t, ...θCoeff) * t;
    this.sθ = Math.sin(θ);
    this.cθ = Math.cos(θ);
  }

  /**
   * Precess precesses coordinates eqFrom, leaving result in eqTo.
   *
   * @param {Equatorial} eqFrom
   * @returns {Equatorial} eqTo
   */
  precess (eqFrom) {
    // (21.4) p. 134
    const [sδ, cδ] = base["default"].sincos(eqFrom.dec);
    const [sαζ, cαζ] = base["default"].sincos(eqFrom.ra + this.ζ);
    const A = cδ * sαζ;
    const B = this.cθ * cδ * cαζ - this.sθ * sδ;
    const C = this.sθ * cδ * cαζ + this.cθ * sδ;
    const eqTo = new coord.Equatorial();
    eqTo.ra = Math.atan2(A, B) + this.z;
    if (C < base["default"].CosSmallAngle) {
      eqTo.dec = Math.asin(C);
    } else {
      eqTo.dec = Math.acos(Math.hypot(A, B)); // near pole
    }
    return eqTo
  }
}

/**
 * Position precesses equatorial coordinates from one epoch to another,
 * including proper motions.
 *
 * If proper motions are not to be considered or are not applicable, pass 0, 0
 * for mα, mδ
 *
 * Both eqFrom and eqTo must be non-nil, although they may point to the same
 * struct.  EqTo is returned for convenience.
 * @param {Equatorial} eqFrom
 * @param {Number} epochFrom
 * @param {Number} epochTo
 * @param {Number} mα - in radians
 * @param {Number} mδ - in radians
 * @returns {Equatorial} [eqTo]
 */
function position (eqFrom, epochFrom, epochTo, mα, mδ) {
  const p = new Precessor(epochFrom, epochTo);
  const t = epochTo - epochFrom;
  const eqTo = new coord.Equatorial();
  eqTo.ra = eqFrom.ra + mα * t;
  eqTo.dec = eqFrom.dec + mδ * t;
  return p.precess(eqTo)
}

// coefficients from (21.5) p. 136
const ηT = [47.0029 * s, -0.06603 * s, 0.000598 * s];
const πT = [174.876384 * d, 3289.4789 * s, 0.60622 * s];
const pT = [5029.0966 * s, 2.22226 * s, -0.000042 * s];
const ηt = [47.0029 * s, -0.03302 * s, 0.000060 * s];
const πt = [174.876384 * d, -869.8089 * s, 0.03536 * s];
const pt = [5029.0966 * s, 1.11113 * s, -0.000006 * s];

/**
 * EclipticPrecessor represents precession from one epoch to another.
 *
 * Construct with NewEclipticPrecessor, then call method Precess.
 * After construction, Precess may be called multiple times to precess
 * different coordinates with the same initial and final epochs.
 */
class EclipticPrecessor {
  /**
   * constructs an EclipticPrecessor object and initializes
   * it to precess coordinates from epochFrom to epochTo.
   * @param {Number} epochFrom
   * @param {Number} epochTo
   */
  constructor (epochFrom, epochTo) {
    // (21.5) p. 136
    let ηCoeff = ηt;
    let πCoeff = πt;
    let pCoeff = pt;
    if (epochFrom !== 2000) {
      const T = (epochFrom - 2000) * 0.01;
      ηCoeff = [
        base["default"].horner(T, ...ηT),
        -0.03302 * s + 0.000598 * s * T,
        0.000060 * s
      ];
      πCoeff = [
        base["default"].horner(T, ...πT),
        -869.8089 * s - 0.50491 * s * T,
        0.03536 * s
      ];
      pCoeff = [
        base["default"].horner(T, ...pT),
        1.11113 * s - 0.000042 * s * T,
        -0.000006 * s
      ];
    }
    const t = (epochTo - epochFrom) * 0.01;
    this.π = base["default"].horner(t, ...πCoeff);
    this.p = base["default"].horner(t, ...pCoeff) * t;
    const η = base["default"].horner(t, ...ηCoeff) * t;
    this.sη = Math.sin(η);
    this.cη = Math.cos(η);
  }

  /**
   * EclipticPrecess precesses coordinates eclFrom, leaving result in eclTo.
   *
   * The same struct may be used for eclFrom and eclTo.
   * EclTo is returned for convenience.
   * @param {Ecliptic} eclFrom
   * @returns {Ecliptic} [eclTo]
   */
  precess (eclFrom) {
    // (21.7) p. 137
    const [sβ, cβ] = base["default"].sincos(eclFrom.lat);
    const [sd, cd] = base["default"].sincos(this.π - eclFrom.lon);
    const A = this.cη * cβ * sd - this.sη * sβ;
    const B = cβ * cd;
    const C = this.cη * sβ + this.sη * cβ * sd;
    const eclTo = new coord.Ecliptic(this.p + this.π - Math.atan2(A, B));
    if (C < base["default"].CosSmallAngle) {
      eclTo.lat = Math.asin(C);
    } else {
      eclTo.lat = Math.acos(Math.hypot(A, B)); // near pole
    }
    return eclTo
  }

  /**
   * ReduceElements reduces orbital elements of a solar system body from one
   * equinox to another.
   *
   * This function is described in chapter 24, but is located in this
   * package so it can be a method of EclipticPrecessor.
   *
   * @param {Elements} eFrom
   * @returns {Elements} eTo
   */
  reduceElements (eFrom) {
    const ψ = this.π + this.p;
    const [si, ci] = base["default"].sincos(eFrom.inc);
    const [snp, cnp] = base["default"].sincos(eFrom.node - this.π);
    const eTo = new elementequinox.Elements();
    // (24.1) p. 159
    eTo.inc = Math.acos(ci * this.cη + si * this.sη * cnp);
    // (24.2) p. 159
    eTo.node = Math.atan2(si * snp, this.cη * si * cnp - this.sη * ci) + ψ;
    // (24.3) p. 159
    eTo.peri = Math.atan2(-this.sη * snp, si * this.cη - ci * this.sη * cnp) + eFrom.peri;
    return eTo
  }
}

/**
 * eclipticPosition precesses ecliptic coordinates from one epoch to another,
 * including proper motions.
 * While eclFrom is given as ecliptic coordinates, proper motions mα, mδ are
 * still expected to be equatorial.  If proper motions are not to be considered
 * or are not applicable, pass 0, 0.
 * Both eclFrom and eclTo must be non-nil, although they may point to the same
 * struct.  EclTo is returned for convenience.
 *
 * @param {Ecliptic} eclFrom,
 * @param {Number} epochFrom
 * @param {HourAngle} [mα]
 * @param {Angle} [mδ]
 * @returns {Ecliptic} eclTo
 */
function eclipticPosition (eclFrom, epochFrom, epochTo, mα, mδ) {
  const p = new EclipticPrecessor(epochFrom, epochTo);

  if (mα && mδ && (mα.rad() !== 0 || mδ.rad() !== 0)) {
    const { lon, lat } = properMotion(mα.rad(), mδ.rad(), epochFrom, eclFrom);
    const t = epochTo - epochFrom;
    eclFrom.lon += lon * t;
    eclFrom.lat += lat * t;
  }
  return p.precess(eclFrom)
}

/**
 * @param {Number} mα - anual proper motion (ra)
 * @param {Number} mδ - anual proper motion (dec)
 * @param {Number} epoch
 * @param {Ecliptic} ecl
 * @returns {Ecliptic} {lon, lat}
 */
function properMotion (mα, mδ, epoch, ecl) {
  const ε = nutation["default"].meanObliquity(base["default"].JulianYearToJDE(epoch));
  const [εsin, εcos] = base["default"].sincos(ε);
  const { ra, dec } = ecl.toEquatorial(ε);
  const [sα, cα] = base["default"].sincos(ra);
  const [sδ, cδ] = base["default"].sincos(dec);
  const cβ = Math.cos(ecl.lat);
  const lon = (mδ * εsin * cα + mα * cδ * (εcos * cδ + εsin * sδ * sα)) / (cβ * cβ);
  const lat = (mδ * (εcos * cδ + εsin * sδ * sα) - mα * εsin * cα * cδ) / cβ;
  return new coord.Ecliptic(lon, lat)
}

/**
 * ProperMotion3D takes the 3D equatorial coordinates of an object
 * at one epoch and computes its coordinates at a new epoch, considering
 * proper motion and radial velocity.
 *
 * Radial distance (r) must be in parsecs, radial velocitiy (mr) in
 * parsecs per year.
 *
 * Both eqFrom and eqTo must be non-nil, although they may point to the same
 * struct.  EqTo is returned for convenience.
 *
 * @param {Equatorial} eqFrom,
 * @param {Number} epochFrom
 * @param {Number} r
 * @param {Number} mr
 * @param {HourAngle} mα
 * @param {Angle} mδ
 * @returns {Equatorial} eqTo
 */
function properMotion3D (eqFrom, epochFrom, epochTo, r, mr, mα, mδ) {
  const [sα, cα] = base["default"].sincos(eqFrom.ra);
  const [sδ, cδ] = base["default"].sincos(eqFrom.dec);
  const x = r * cδ * cα;
  const y = r * cδ * sα;
  const z = r * sδ;
  const mrr = mr / r;
  const zmδ = z * mδ.rad();
  const mx = x * mrr - zmδ * cα - y * mα.rad();
  const my = y * mrr - zmδ * sα + x * mα.rad();
  const mz = z * mrr + r * mδ.rad() * cδ;
  const t = epochTo - epochFrom;
  const xp = x + t * mx;
  const yp = y + t * my;
  const zp = z + t * mz;
  const eqTo = new coord.Equatorial();
  eqTo.ra = Math.atan2(yp, xp);
  eqTo.dec = Math.atan2(zp, Math.hypot(xp, yp));
  return eqTo
}

var precess = {
  approxAnnualPrecession,
  mn,
  approxPosition,
  Precessor,
  position,
  EclipticPrecessor,
  eclipticPosition,
  properMotion,
  properMotion3D
};

exports.EclipticPrecessor = EclipticPrecessor;
exports.Precessor = Precessor;
exports.approxAnnualPrecession = approxAnnualPrecession;
exports.approxPosition = approxPosition;
exports["default"] = precess;
exports.eclipticPosition = eclipticPosition;
exports.mn = mn;
exports.position = position;
exports.properMotion = properMotion;
exports.properMotion3D = properMotion3D;
