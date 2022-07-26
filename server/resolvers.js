import { Job, Company } from "./db.js";

function rejectIf(condition) {
    if (condition) {
        throw new Error('Unauthorized');
    }
}

export const resolvers = {
    Query: {
        // here we destrucure args to {id}
        job: (_root, { id }) => Job.findById(id),
        jobs: () => Job.findAll(),
        company: (_root, { id }) => Company.findById(id),
    },
    Mutations: {
        createJob: (_root, { input }, { user }) => {
            rejectIf(!user);
            return Job.create({ ...input, companyId: user.companyId })
        },
        deleteJob: async (_root, { id }, { user }) => {
            rejectIf(!user);
            const job = await Job.findById(id);
            rejectIf(job.companyId !== user.companyId);
            return Job.delete(id);
        },
        updateJob: async (_root, { input }, { user }) => {
            rejectIf(!user);
            const job = await Job.findById(input.id);
            rejectIf(job.companyId !== user.companyId);
            return Job.update({ ...input, companyId: user.companyId });
        },
    },
    Job: {
        company: (job) => Company.findById(job.companyId)
    }
};