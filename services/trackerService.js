import prisma from "@/lib/prisma"

/**
 * Creates a new job application entry.
 * @param {string} userId
 * @param {Object} data - { companyName, roleTitle, jdText }
 */
export async function createApplication(userId, data) {
    return await prisma.jobApplication.create({
        data: {
            userId,
            companyName: data.companyName,
            roleTitle: data.roleTitle,
            jdText: data.jdText || "",
            status: "BOOKMARKED"
        }
    })
}

/**
 * Updates application status.
 * @param {string} applicationId
 * @param {string} userId - Security check
 * @param {string} status - APPLIED, INTERVIEWING...
 */
export async function updateStatus(applicationId, userId, status) {
    return await prisma.jobApplication.update({
        where: {
            id: applicationId,
            userId: userId // Security: Ensure ownership
        },
        data: { status }
    })
}

/**
 * Retrieves all jobs for the dashboard.
 */
export async function getUserApplications(userId) {
    return await prisma.jobApplication.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        select: {
            id: true,
            companyName: true,
            roleTitle: true,
            status: true,
            matchScore: true,
            updatedAt: true
        }
    })
}
