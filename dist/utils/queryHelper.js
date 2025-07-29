"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryHelper = void 0;
const queryHelper = (query) => {
    const { page = 1, limit = 10, search = "", sort, genres, moods, languageId, songFormatId, status, role, transactionType, } = query;
    const pageNum = typeof page === "string" ? parseInt(page, 10) : page;
    const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit;
    const skip = (pageNum - 1) * limitNum;
    const orConditions = [];
    if (search) {
        const regex = { $regex: search, $options: "i" };
        orConditions.push({ title: regex }, { first_name: regex }, { last_name: regex }, { status: regex }, { label: regex }, { email: regex }, { "team.team_name": regex }, // ✅ Corrected for your model
        { "adminTeams.team_name": regex }, // ✅ Corrected for your model
        { mood_name: regex }, { language_name: regex }, { genre_name: regex });
    }
    if (genres)
        orConditions.push({ genres: { $in: [].concat(genres) } });
    if (moods)
        orConditions.push({ moods: { $in: [].concat(moods) } });
    if (languageId)
        orConditions.push({ languageId: { $in: [].concat(languageId) } });
    if (songFormatId)
        orConditions.push({ songFormatId: { $in: [].concat(songFormatId) } });
    if (status)
        orConditions.push({ status: { $in: [].concat(status) } });
    if (role)
        orConditions.push({ role: { $in: [].concat(role) } });
    const finalQuery = orConditions.length > 0 ? { $or: orConditions } : {};
    const sortQuery = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };
    return {
        skip,
        limit: limitNum,
        finalQuery,
        sortQuery,
        transactionType,
        page: pageNum,
    };
};
exports.queryHelper = queryHelper;
