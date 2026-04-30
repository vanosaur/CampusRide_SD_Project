"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = exports.GenderPreference = exports.RideStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var RideStatus;
(function (RideStatus) {
    RideStatus["OPEN"] = "OPEN";
    RideStatus["FULL"] = "FULL";
    RideStatus["CONFIRMED"] = "CONFIRMED";
    RideStatus["COMPLETED"] = "COMPLETED";
    RideStatus["CANCELLED"] = "CANCELLED";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
var GenderPreference;
(function (GenderPreference) {
    GenderPreference["ANY"] = "ANY";
    GenderPreference["MALE"] = "MALE";
    GenderPreference["FEMALE"] = "FEMALE";
})(GenderPreference || (exports.GenderPreference = GenderPreference = {}));
const RideSchema = new mongoose_1.Schema({
    creatorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    date: { type: String, required: true },
    departureTime: { type: Date, required: true },
    maxSeats: { type: Number, required: true, min: 1 },
    totalFare: { type: Number, required: true, min: 0 },
    status: { type: String, enum: Object.values(RideStatus), default: RideStatus.OPEN },
    autoAccept: { type: Boolean, default: false },
    genderPreference: { type: String, enum: Object.values(GenderPreference), default: GenderPreference.ANY },
    createdAt: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
exports.Ride = mongoose_1.default.model('Ride', RideSchema);
