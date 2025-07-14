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
exports.Team = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const teamSchema = new mongoose_1.Schema({
    admin_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    game_type: { type: mongoose_1.Schema.Types.ObjectId, ref: 'GameType', required: true },
    team_type: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TeamType', required: true },
    age_type: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AgeType', required: true },
    team_place: { type: String, required: true },
    image: { type: String, default: null, required: false },
    team_name: { type: String, required: true },
    team_code: { type: String, required: true, unique: true },
    season_type: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SeasonType', required: true },
    players_id: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    coaches_id: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
const Team = mongoose_1.default.model('Team', teamSchema);
exports.Team = Team;
