'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _immutable = require('immutable');

var _constants = require('./constants');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = (0, _immutable.fromJS)({
  auth: undefined,
  authError: undefined,
  profile: undefined,
  data: {},
  snapshot: {}
});

var pathToArr = function pathToArr(path) {
  return path.split(/\//).filter(function (p) {
    return !!p;
  });
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];
  var path = action.path;

  var pathArr = void 0;
  var retVal = void 0;

  var _ret = function () {
    switch (action.type) {

      case _constants.SET:
        var data = action.data;
        var snapshot = action.snapshot;

        pathArr = pathToArr(path);

        retVal = data !== undefined ? state.setIn(['data'].concat(_toConsumableArray(pathArr)), (0, _immutable.fromJS)(data)) : state.deleteIn(['data'].concat(_toConsumableArray(pathArr)));

        retVal = snapshot !== undefined ? retVal.setIn(['snapshot'].concat(_toConsumableArray(pathArr)), (0, _immutable.fromJS)(snapshot)) : retVal.deleteIn(['snapshot'].concat(_toConsumableArray(pathArr)));

        return {
          v: retVal
        };

      case _constants.NO_VALUE:
        pathArr = pathToArr(path);
        retVal = state.setIn(['data'].concat(_toConsumableArray(pathArr)), (0, _immutable.fromJS)({}));
        retVal = retVal.setIn(['snapshot'].concat(_toConsumableArray(pathArr)), (0, _immutable.fromJS)({}));
        return {
          v: retVal
        };

      case _constants.SET_PROFILE:
        var profile = action.profile;

        return {
          v: profile !== undefined ? state.setIn(['profile'], (0, _immutable.fromJS)(profile)) : state.deleteIn(['profile'])
        };

      case _constants.LOGOUT:
        var _action$preserve = action.preserve;
        var preserve = _action$preserve === undefined ? [] : _action$preserve;
        var _action$remove = action.remove;
        var remove = _action$remove === undefined ? [] : _action$remove;

        var preserved = (0, _immutable.fromJS)({ data: {}, snapshot: {} });

        // preserving and removing must be applied to both the 'data' and 'snapshot' subtrees of the state
        ['data', 'snapshot'].map(function (type) {
          // some predefined paths should not be removed after logout
          preserve.map(function (path) {
            return [type].concat(_toConsumableArray(pathToArr(path)));
          }).map(function (pathArr) {
            if (state.hasIn(pathArr)) {
              preserved = preserved.setIn(pathArr, state.getIn(pathArr));
            }
          });

          // but some sub-parts of this preserved state should be still removed
          remove.map(function (path) {
            return [type].concat(_toConsumableArray(pathToArr(path)));
          }).map(function (pathArr) {
            preserved = preserved.removeIn(pathArr);
          });
        });

        return {
          v: preserved.merge((0, _immutable.fromJS)({
            auth: null,
            authError: null,
            profile: null
          }))
        };

      case _constants.LOGIN:
        return {
          v: state.setIn(['auth'], (0, _immutable.fromJS)(action.auth)).setIn(['authError'], null)
        };

      case _constants.LOGIN_ERROR:
        return {
          v: state.setIn(['authError'], action.authError).setIn(['auth'], null).setIn(['profile'], null)
        };

      default:
        return {
          v: state
        };

    }
  }();

  if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
};