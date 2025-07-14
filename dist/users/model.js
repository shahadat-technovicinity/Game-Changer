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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Role options
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "Super Admin";
    UserRole["ADMIN"] = "Admin";
    UserRole["PLAYER"] = "Player";
    UserRole["COACH"] = "Coach";
})(UserRole || (exports.UserRole = UserRole = {}));
// Define schema
const userSchema = new mongoose_1.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String, default: null },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.ADMIN
    },
    device_token: { type: String },
    access_token: { type: String },
    refresh_token: { type: String },
    jersey_no: { type: String, default: null },
    is_deleted: { type: Boolean, default: false },
    forget_password_code: { type: String },
    forget_password_code_time: { type: Date },
    team_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team' },
    admin_teams: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Team' }],
    storage_size: { type: Number, default: 0 }, // in GB
    storage_used: { type: Number, default: 0 } // in MB
}, {
    timestamps: true
});
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        this.password = await bcrypt_1.default.hash(this.password, salt);
        next();
    }
    catch (err) {
        return next(err);
    }
});
// Compare candidate password with stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
