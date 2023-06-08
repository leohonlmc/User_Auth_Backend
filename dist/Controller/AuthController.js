"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.register = exports.login = void 0;
var mongoose_1 = require("mongoose");
var UserModel_1 = require("../Model/UserModel");
var User = (0, mongoose_1.model)("User", UserModel_1.schema);
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
var bcrypt_1 = __importDefault(require("bcrypt"));
var loginAuth = function (email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var user, auth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User.findOne({ email: email })];
                case 1:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 3];
                    return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                case 2:
                    auth = _a.sent();
                    if (auth) {
                        return [2 /*return*/, user];
                    }
                    throw Error("incorrect password");
                case 3: throw Error("incorrect email");
            }
        });
    });
};
var signToken = function (id) {
    return jsonwebtoken_1.default.sign({ id: id }, "".concat(process.env.JWT_SECRET), {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
var createSendToken = function (user, statusCode, res) {
    var token = signToken(user._id.toString());
    var cookieOptions = {
        expires: new Date(Date.now() +
            parseInt("".concat(process.env.JWT_EXPIRES_IN)) * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    res.cookie("jwt", token, cookieOptions);
    user.password = "";
    res.status(statusCode).json({
        status: "success",
        token: token,
        data: {
            user: user,
        },
    });
};
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, loginAuth(email, password)];
            case 2:
                user = _b.sent();
                console.log(user);
                if (user) {
                    createSendToken(user, 200, res);
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                res.status(400).json({
                    status: "fail",
                    message: "Login failed",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                });
                return [4 /*yield*/, user.save()];
            case 1:
                _a.sent();
                createSendToken(user, 201, res);
                return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var getUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.findById(req.params.id)];
            case 1:
                user = _a.sent();
                console.log(req.params.id);
                res.status(200).json({
                    status: "success",
                    data: {
                        user: user,
                    },
                });
                return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
