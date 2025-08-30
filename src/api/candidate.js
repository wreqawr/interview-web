import http from './http';
import { CANDIDATE_JOBS_URL } from './endpoints';

/**
 * 获取求职者投递的岗位列表接口
 * @returns {Promise}
 */
export async function getCandidateJobList() {
    return await http.get(CANDIDATE_JOBS_URL);
} 