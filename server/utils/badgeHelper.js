import User from '../models/User.js';
import Badge from '../models/Badge.js';

async function awardBadgeToUser(userId, topicId, badgeName, badgeImage) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const existingBadgeIndex = user.badges.findIndex(
            badge => badge.topicId.toString() === topicId.toString()
        );

        if (existingBadgeIndex !== -1) {
            user.badges[existingBadgeIndex].badgeCount += 1;
            user.badges[existingBadgeIndex].earnedAt = new Date();
        } else {
            user.badges.push({
                topicId,
                badgeName,
                badgeImage,
                earnedAt: new Date(),
                badgeCount: 1
            });
        }

        await user.save();

        const currentYear = new Date().getFullYear();
        const badge = await Badge.findOne({ topicId, year: currentYear });

        if (badge) {
            badge.badgeCount += 1;
            await badge.save();
        } else {
            await Badge.create({
                name: badgeName,
                description: `Badge earned by completing topic`,
                imageUrl: badgeImage,
                topicId,
                year: currentYear,
                badgeCount: 1,
                isActive: true
            });
        }

        return {
            success: true,
            isReEarned: existingBadgeIndex !== -1,
            badgeCount: existingBadgeIndex !== -1 ? user.badges[existingBadgeIndex].badgeCount : 1
        };
    } catch (error) {
        throw error;
    }
}

// get user's badge count for a topic
async function getUserBadgeCount(userId, topicId) {
    try {
        const user = await User.findById(userId);
        if (!user) return 0;

        const badge = user.badges.find( b => b.topicId.toString() === topicId.toString());

        return badge ? badge.badgeCount : 0;
    } catch (error) {
        console.error('Error getting user badge count: ', error);
        return 0;
    }
}

// get total badge count across all users

async function getTotalBadgeCount(topicId, year = new Date().getFullYear()) {
    try {
        const badge = await Badge.findOne({ topicId, year });
        return badge ? badge.badgeCount : 0;
    } catch (error) {
        console.error('Error getting total badge count: ', error);
        return 0;
    }
}

export {
    awardBadgeToUser,
    getUserBadgeCount,
    getTotalBadgeCount
};