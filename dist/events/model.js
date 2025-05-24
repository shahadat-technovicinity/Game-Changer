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
exports.Event = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const eventSchema = new mongoose_1.Schema({
    admin_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    team_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', required: true },
    opponent_team_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', required: true },
    event_type: { type: String, enum: ['Game', 'Practice', 'Other'], default: 'Game', required: true },
    home_away: { type: String, enum: ['TBD', 'Home', 'Away'], default: 'Home', required: true },
    start_date: { type: Date, required: true },
    duration: { type: Number, required: true },
    arrive_time: { type: Number, required: false },
    all_day: { type: Boolean, default: false },
    repeats: { type: String, enum: ['Never', 'Daily', 'Weekly', 'Monthly'], default: 'Never' },
    location: { type: String, default: null },
    image: { type: String, default: null },
    notes: { type: String, default: null },
}, { timestamps: true });
const Event = mongoose_1.default.model('Event', eventSchema);
exports.Event = Event;
