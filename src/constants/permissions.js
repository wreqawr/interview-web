/**
 * 权限功能配置
 * 基于角色的功能映射，包含188个权限点
 */

// 权限代码常量定义
export const PERMISSION_CODES = {
  // 求职者权限 (JOB_SEEKER)
  // 简历管理模块
  RESUME_UPLOAD: 'ai-interview:resume:upload',
  RESUME_MODIFY: 'ai-interview:resume:modify',
  RESUME_TEMPLATE_CHOOSE: 'ai-interview:resume:template:choose',
  RESUME_VIEW: 'ai-interview:resume:view',
  RESUME_EXPORT: 'ai-interview:resume:export',
  RESUME_VERSION_MANAGE: 'ai-interview:resume:version:manage',
  RESUME_PARSE: 'ai-interview:resume:parse',
  RESUME_SKILL_EXTRACT: 'ai-interview:resume:skill:extract',
  RESUME_EXPERIENCE_ANALYZE: 'ai-interview:resume:experience:analyze',
  RESUME_EDUCATION_RECOGNIZE: 'ai-interview:resume:education:recognize',

  // 面试预约模块
  APPOINTMENT_VIEW: 'ai-interview:appointment:view',
  APPOINTMENT_CREATE: 'ai-interview:appointment:create',
  APPOINTMENT_MODIFY: 'ai-interview:appointment:modify',
  APPOINTMENT_CANCEL: 'ai-interview:appointment:cancel',
  APPOINTMENT_REMINDER_SET: 'ai-interview:appointment:reminder:set',
  APPOINTMENT_POSITION_SELECT: 'ai-interview:appointment:position:select',
  APPOINTMENT_COMPANY_SELECT: 'ai-interview:appointment:company:select',

  // AI模拟面试模块
  MOCK_TECHNICAL_START: 'ai-interview:mock:technical:start',
  MOCK_BEHAVIORAL_START: 'ai-interview:mock:behavioral:start',
  MOCK_STRESS_START: 'ai-interview:mock:stress:start',
  MOCK_SCENARIO_SELECT: 'ai-interview:mock:scenario:select',
  MOCK_QUESTION_VIEW: 'ai-interview:mock:question:view',
  MOCK_ANSWER_SUBMIT: 'ai-interview:mock:answer:submit',
  MOCK_RESULT_VIEW: 'ai-interview:mock:result:view',

  // 实时面试模块
  INTERVIEW_VIDEO_JOIN: 'ai-interview:interview:video:join',
  INTERVIEW_SCREEN_SHARE: 'ai-interview:interview:screen:share',
  INTERVIEW_CODE_EDIT: 'ai-interview:interview:code:edit',
  INTERVIEW_TIMER_VIEW: 'ai-interview:interview:timer:view',
  INTERVIEW_RECORD_START: 'ai-interview:interview:record:start',
  INTERVIEW_RECORD_STOP: 'ai-interview:interview:record:stop',

  // 面试记录模块
  HISTORY_VIEW: 'ai-interview:history:view',
  HISTORY_RECORD_PLAY: 'ai-interview:history:record:play',
  HISTORY_VIDEO_PLAY: 'ai-interview:history:video:play',
  HISTORY_NOTE_CREATE: 'ai-interview:history:note:create',
  HISTORY_NOTE_MODIFY: 'ai-interview:history:note:modify',
  HISTORY_FEEDBACK_VIEW: 'ai-interview:history:feedback:view',

  // 面试报告模块
  REPORT_PERSONAL_VIEW: 'ai-interview:report:personal:view',
  REPORT_PERFORMANCE_ANALYZE: 'ai-interview:report:performance:analyze',
  REPORT_SKILL_ASSESS: 'ai-interview:report:skill:assess',
  REPORT_IMPROVEMENT_VIEW: 'ai-interview:report:improvement:view',
  REPORT_TREND_ANALYZE: 'ai-interview:report:trend:analyze',
  REPORT_COMPARE_VIEW: 'ai-interview:report:compare:view',
  REPORT_INDUSTRY_COMPARE: 'ai-interview:report:industry:compare',
  REPORT_GROWTH_TRACK: 'ai-interview:report:growth:track',

  // 个人中心模块
  PROFILE_INFO_VIEW: 'ai-interview:profile:info:view',
  PROFILE_INFO_MODIFY: 'ai-interview:profile:info:modify',
  PROFILE_AVATAR_UPLOAD: 'ai-interview:profile:avatar:upload',
  PROFILE_CONTACT_MANAGE: 'ai-interview:profile:contact:manage',
  PROFILE_PRIVACY_SET: 'ai-interview:profile:privacy:set',

  // 学习中心模块
  LEARNING_SKILL_VIEW: 'ai-interview:learning:skill:view',
  LEARNING_IMPROVEMENT_VIEW: 'ai-interview:learning:improvement:view',
  LEARNING_NEWS_VIEW: 'ai-interview:learning:news:view',
  LEARNING_PROGRESS_TRACK: 'ai-interview:learning:progress:track',

  // HR权限 (ROLE_HR)
  // 候选人管理模块
  CANDIDATE_VIEW: 'ai-interview:candidate:view',
  CANDIDATE_CREATE: 'ai-interview:candidate:create',
  CANDIDATE_MODIFY: 'ai-interview:candidate:modify',
  CANDIDATE_DELETE: 'ai-interview:candidate:delete',
  CANDIDATE_TAG_MANAGE: 'ai-interview:candidate:tag:manage',
  CANDIDATE_STATUS_TRACK: 'ai-interview:candidate:status:track',
  CANDIDATE_BATCH_OPERATE: 'ai-interview:candidate:batch:operate',
  CANDIDATE_SEARCH: 'ai-interview:candidate:search',
  CANDIDATE_FILTER: 'ai-interview:candidate:filter',

  // 简历筛选模块
  RESUME_FILTER_AI: 'ai-interview:resume:filter:ai',
  RESUME_FILTER_KEYWORD: 'ai-interview:resume:filter:keyword',
  RESUME_FILTER_SKILL: 'ai-interview:resume:filter:skill',
  RESUME_FILTER_SCORE: 'ai-interview:resume:filter:score',
  RESUME_FILTER_BATCH: 'ai-interview:resume:filter:batch',

  // 候选人沟通模块
  COMMUNICATION_MESSAGE_SEND: 'ai-interview:communication:message:send',
  COMMUNICATION_INVITATION_SEND: 'ai-interview:communication:invitation:send',
  COMMUNICATION_FEEDBACK_COLLECT: 'ai-interview:communication:feedback:collect',
  COMMUNICATION_RECORD_VIEW: 'ai-interview:communication:record:view',
  COMMUNICATION_TEMPLATE_MANAGE: 'ai-interview:communication:template:manage',

  // 面试管理模块
  INTERVIEW_ARRANGE_CREATE: 'ai-interview:interview:arrange:create',
  INTERVIEW_ARRANGE_MODIFY: 'ai-interview:interview:arrange:modify',
  INTERVIEW_ARRANGE_CANCEL: 'ai-interview:interview:arrange:cancel',
  INTERVIEW_INTERVIEWER_ASSIGN: 'ai-interview:interview:interviewer:assign',
  INTERVIEW_ROOM_MANAGE: 'ai-interview:interview:room:manage',
  INTERVIEW_PROCESS_SET: 'ai-interview:interview:process:set',
  INTERVIEW_MONITOR_REAL_TIME: 'ai-interview:interview:monitor:real-time',
  INTERVIEW_QUALITY_ASSESS: 'ai-interview:interview:quality:assess',
  INTERVIEW_INTERVIEWER_EVALUATE: 'ai-interview:interview:interviewer:evaluate',
  INTERVIEW_EXCEPTION_HANDLE: 'ai-interview:interview:exception:handle',

  // 面试评估模块
  EVALUATION_SCORE_CREATE: 'ai-interview:evaluation:score:create',
  EVALUATION_SCORE_MODIFY: 'ai-interview:evaluation:score:modify',
  EVALUATION_DIMENSION_MANAGE: 'ai-interview:evaluation:dimension:manage',
  EVALUATION_TEMPLATE_MANAGE: 'ai-interview:evaluation:template:manage',
  EVALUATION_RESULT_SUMMARY: 'ai-interview:evaluation:result:summary',
  EVALUATION_REPORT_GENERATE: 'ai-interview:evaluation:report:generate',

  // 数据分析模块
  ANALYTICS_FUNNEL_ANALYZE: 'ai-interview:analytics:funnel:analyze',
  ANALYTICS_SOURCE_STATISTICS: 'ai-interview:analytics:source:statistics',
  ANALYTICS_PASS_RATE_ANALYZE: 'ai-interview:analytics:pass-rate:analyze',
  ANALYTICS_EFFICIENCY_ASSESS: 'ai-interview:analytics:efficiency:assess',
  ANALYTICS_QUALITY_REPORT: 'ai-interview:analytics:quality:report',
  ANALYTICS_INTERVIEWER_REPORT: 'ai-interview:analytics:interviewer:report',
  ANALYTICS_CANDIDATE_REPORT: 'ai-interview:analytics:candidate:report',
  ANALYTICS_TREND_ANALYZE: 'ai-interview:analytics:trend:analyze',

  // 企业管理模块
  COMPANY_INFO_VIEW: 'ai-interview:company:info:view',
  COMPANY_INFO_MODIFY: 'ai-interview:company:info:modify',
  COMPANY_DEPARTMENT_MANAGE: 'ai-interview:company:department:manage',
  COMPANY_POSITION_MANAGE: 'ai-interview:company:position:manage',
  COMPANY_REQUIREMENT_MANAGE: 'ai-interview:company:requirement:manage',
  COMPANY_INTERVIEWER_MANAGE: 'ai-interview:company:interviewer:manage',
  COMPANY_INTERVIEWER_PERMISSION_SET: 'ai-interview:company:interviewer:permission:set',
  COMPANY_INTERVIEWER_TRAINING_RECORD: 'ai-interview:company:interviewer:training:record',
  COMPANY_INTERVIEWER_PERFORMANCE_EVALUATE: 'ai-interview:company:interviewer:performance:evaluate',
  COMPANY_PROCESS_DESIGN: 'ai-interview:company:process:design',
  COMPANY_PROCESS_CONFIGURE: 'ai-interview:company:process:configure',
  COMPANY_PROCESS_STANDARD_SET: 'ai-interview:company:process:standard:set',
  COMPANY_PROCESS_TEMPLATE_MANAGE: 'ai-interview:company:process:template:manage',

  // 管理员权限 (ROLE_ADMIN)
  // 用户管理模块
  ADMIN_USER_REGISTER_AUDIT: 'ai-interview:admin:user:register:audit',
  ADMIN_USER_INFO_VIEW: 'ai-interview:admin:user:info:view',
  ADMIN_USER_INFO_MODIFY: 'ai-interview:admin:user:info:modify',
  ADMIN_USER_STATUS_CONTROL: 'ai-interview:admin:user:status:control',
  ADMIN_USER_PASSWORD_RESET: 'ai-interview:admin:user:password:reset',
  ADMIN_USER_DELETE: 'ai-interview:admin:user:delete',
  ADMIN_ROLE_DEFINE: 'ai-interview:admin:role:define',
  ADMIN_ROLE_ASSIGN: 'ai-interview:admin:role:assign',
  ADMIN_PERMISSION_CONFIGURE: 'ai-interview:admin:permission:configure',
  ADMIN_PERMISSION_GROUP_MANAGE: 'ai-interview:admin:permission:group:manage',
  ADMIN_PERMISSION_AUDIT: 'ai-interview:admin:permission:audit',

  // 企业用户管理模块
  ADMIN_COMPANY_REGISTER_AUDIT: 'ai-interview:admin:company:register:audit',
  ADMIN_COMPANY_INFO_MANAGE: 'ai-interview:admin:company:info:manage',
  ADMIN_COMPANY_CERTIFICATION_MANAGE: 'ai-interview:admin:company:certification:manage',
  ADMIN_COMPANY_STATUS_CONTROL: 'ai-interview:admin:company:status:control',
  ADMIN_COMPANY_BLACKLIST_MANAGE: 'ai-interview:admin:company:blacklist:manage',

  // 企业服务模块
  ADMIN_COMPANY_PACKAGE_MANAGE: 'ai-interview:admin:company:package:manage',
  ADMIN_COMPANY_SERVICE_LEVEL_SET: 'ai-interview:admin:company:service:level:set',
  ADMIN_COMPANY_QUOTA_MANAGE: 'ai-interview:admin:company:quota:manage',
  ADMIN_COMPANY_BILLING_MANAGE: 'ai-interview:admin:company:billing:manage',

  // 系统配置模块
  ADMIN_SYSTEM_PARAMETER_CONFIGURE: 'ai-interview:admin:system:parameter:configure',
  ADMIN_SYSTEM_FUNCTION_SWITCH: 'ai-interview:admin:system:function:switch',
  ADMIN_SYSTEM_ANNOUNCEMENT_MANAGE: 'ai-interview:admin:system:announcement:manage',
  ADMIN_SYSTEM_HELP_MANAGE: 'ai-interview:admin:system:help:manage',
  ADMIN_AI_MODEL_CONFIGURE: 'ai-interview:admin:ai:model:configure',
  ADMIN_AI_MODEL_VERSION_MANAGE: 'ai-interview:admin:ai:model:version:manage',
  ADMIN_AI_MODEL_PERFORMANCE_MONITOR: 'ai-interview:admin:ai:model:performance:monitor',
  ADMIN_AI_MODEL_TRAINING_MANAGE: 'ai-interview:admin:ai:model:training:manage',
  ADMIN_INTERVIEW_QUESTION_MANAGE: 'ai-interview:admin:interview:question:manage',
  ADMIN_INTERVIEW_SCORING_CONFIGURE: 'ai-interview:admin:interview:scoring:configure',
  ADMIN_INTERVIEW_PROCESS_TEMPLATE: 'ai-interview:admin:interview:process:template',
  ADMIN_INTERVIEW_DIMENSION_SET: 'ai-interview:admin:interview:dimension:set',

  // 数据管理模块
  ADMIN_DATA_USER_STATISTICS: 'ai-interview:admin:data:user:statistics',
  ADMIN_DATA_SYSTEM_USAGE_STATISTICS: 'ai-interview:admin:data:system:usage:statistics',
  ADMIN_DATA_INTERVIEW_STATISTICS: 'ai-interview:admin:data:interview:statistics',
  ADMIN_DATA_REVENUE_STATISTICS: 'ai-interview:admin:data:revenue:statistics',
  ADMIN_DATA_BACKUP_STRATEGY: 'ai-interview:admin:data:backup:strategy',
  ADMIN_DATA_BACKUP_FILE_MANAGE: 'ai-interview:admin:data:backup:file:manage',
  ADMIN_DATA_RECOVERY: 'ai-interview:admin:data:recovery',
  ADMIN_DATA_ARCHIVE: 'ai-interview:admin:data:archive',

  // 监控与日志模块
  ADMIN_MONITOR_SERVER_STATUS: 'ai-interview:admin:monitor:server:status',
  ADMIN_MONITOR_PERFORMANCE_METRICS: 'ai-interview:admin:monitor:performance:metrics',
  ADMIN_MONITOR_ERROR_RATE: 'ai-interview:admin:monitor:error:rate',
  ADMIN_MONITOR_RESOURCE_USAGE: 'ai-interview:admin:monitor:resource:usage',
  ADMIN_LOG_USER_OPERATION: 'ai-interview:admin:log:user:operation',
  ADMIN_LOG_SYSTEM_OPERATION: 'ai-interview:admin:log:system:operation',
  ADMIN_LOG_SECURITY_EVENT: 'ai-interview:admin:log:security:event',
  ADMIN_LOG_AUDIT: 'ai-interview:admin:log:audit',
  ADMIN_SECURITY_LOGIN_DETECT: 'ai-interview:admin:security:login:detect',
  ADMIN_SECURITY_SENSITIVE_MONITOR: 'ai-interview:admin:security:sensitive:monitor',
  ADMIN_SECURITY_LEAK_DETECT: 'ai-interview:admin:security:leak:detect',
  ADMIN_SECURITY_INCIDENT_HANDLE: 'ai-interview:admin:security:incident:handle',

  // 通用功能权限
  // 认证授权模块
  AUTH_LOGIN_PASSWORD: 'ai-interview:auth:login:password',
  AUTH_LOGIN_SMS: 'ai-interview:auth:login:sms',
  AUTH_LOGIN_THIRD_PARTY: 'ai-interview:auth:login:third-party',
  AUTH_REGISTER: 'ai-interview:auth:register',
  AUTH_PASSWORD_FORGOT: 'ai-interview:auth:password:forgot',
  AUTH_SECURITY_SET: 'ai-interview:auth:security:set',
  AUTH_ROLE_CONTROL: 'ai-interview:auth:role:control',
  AUTH_FUNCTION_CONTROL: 'ai-interview:auth:function:control',
  AUTH_DATA_CONTROL: 'ai-interview:auth:data:control',
  AUTH_OPERATION_AUDIT: 'ai-interview:auth:operation:audit',

  // 消息通知模块
  NOTIFICATION_INTERVIEW_SEND: 'ai-interview:notification:interview:send',
  NOTIFICATION_SYSTEM_SEND: 'ai-interview:notification:system:send',
  NOTIFICATION_REMINDER_SEND: 'ai-interview:notification:reminder:send',
  NOTIFICATION_PUSH_SEND: 'ai-interview:notification:push:send',
  NOTIFICATION_CENTER_VIEW: 'ai-interview:notification:center:view',
  NOTIFICATION_CATEGORY_MANAGE: 'ai-interview:notification:category:manage',
  NOTIFICATION_SETTING_MANAGE: 'ai-interview:notification:setting:manage',
  NOTIFICATION_HISTORY_VIEW: 'ai-interview:notification:history:view',

  // 系统工具模块
  TOOL_FILE_UPLOAD: 'ai-interview:tool:file:upload',
  TOOL_FILE_DOWNLOAD: 'ai-interview:tool:file:download',
  TOOL_FILE_CONVERT: 'ai-interview:tool:file:convert',
  TOOL_FILE_PREVIEW: 'ai-interview:tool:file:preview',
  TOOL_STORAGE_MANAGE: 'ai-interview:tool:storage:manage',
  TOOL_HELP_ONLINE: 'ai-interview:tool:help:online',
  TOOL_FAQ_VIEW: 'ai-interview:tool:faq:view',
  TOOL_CUSTOMER_CONTACT: 'ai-interview:tool:customer:contact',
  TOOL_FEEDBACK_SUBMIT: 'ai-interview:tool:feedback:submit'
}

// 角色功能映射配置
export const ROLE_FEATURES = {
  // 管理员功能
  'ROLE_ADMIN': [
    {
      key: 'user_management',
      name: '用户管理',
      icon: '@/assets/function/user-management.svg',
      type: 'danger',
      path: '/admin/users',
      description: '管理系统用户、角色和权限',
      permissions: [
        PERMISSION_CODES.ADMIN_USER_REGISTER_AUDIT,
        PERMISSION_CODES.ADMIN_USER_INFO_VIEW,
        PERMISSION_CODES.ADMIN_USER_INFO_MODIFY,
        PERMISSION_CODES.ADMIN_USER_STATUS_CONTROL,
        PERMISSION_CODES.ADMIN_USER_PASSWORD_RESET,
        PERMISSION_CODES.ADMIN_USER_DELETE,
        PERMISSION_CODES.ADMIN_ROLE_DEFINE,
        PERMISSION_CODES.ADMIN_ROLE_ASSIGN,
        PERMISSION_CODES.ADMIN_PERMISSION_CONFIGURE,
        PERMISSION_CODES.ADMIN_PERMISSION_GROUP_MANAGE,
        PERMISSION_CODES.ADMIN_PERMISSION_AUDIT
      ]
    },
    {
      key: 'company_management',
      name: '企业管理',
      icon: '@/assets/function/company-management.svg',
      type: 'warning',
      path: '/admin/companies',
      description: '管理企业信息、认证和套餐',
      permissions: [
        PERMISSION_CODES.ADMIN_COMPANY_REGISTER_AUDIT,
        PERMISSION_CODES.ADMIN_COMPANY_INFO_MANAGE,
        PERMISSION_CODES.ADMIN_COMPANY_CERTIFICATION_MANAGE,
        PERMISSION_CODES.ADMIN_COMPANY_STATUS_CONTROL,
        PERMISSION_CODES.ADMIN_COMPANY_BLACKLIST_MANAGE,
        PERMISSION_CODES.ADMIN_COMPANY_PACKAGE_MANAGE,
        PERMISSION_CODES.ADMIN_COMPANY_SERVICE_LEVEL_SET,
        PERMISSION_CODES.ADMIN_COMPANY_QUOTA_MANAGE,
        PERMISSION_CODES.ADMIN_COMPANY_BILLING_MANAGE
      ]
    },
    {
      key: 'system_config',
      name: '系统配置',
      icon: '@/assets/function/system-setting.svg',
      type: 'info',
      path: '/admin/system',
      description: '系统参数配置和功能开关',
      permissions: [
        PERMISSION_CODES.ADMIN_SYSTEM_PARAMETER_CONFIGURE,
        PERMISSION_CODES.ADMIN_SYSTEM_FUNCTION_SWITCH,
        PERMISSION_CODES.ADMIN_SYSTEM_ANNOUNCEMENT_MANAGE,
        PERMISSION_CODES.ADMIN_SYSTEM_HELP_MANAGE,
        PERMISSION_CODES.ADMIN_AI_MODEL_CONFIGURE,
        PERMISSION_CODES.ADMIN_AI_MODEL_VERSION_MANAGE,
        PERMISSION_CODES.ADMIN_AI_MODEL_PERFORMANCE_MONITOR,
        PERMISSION_CODES.ADMIN_AI_MODEL_TRAINING_MANAGE,
        PERMISSION_CODES.ADMIN_INTERVIEW_QUESTION_MANAGE,
        PERMISSION_CODES.ADMIN_INTERVIEW_SCORING_CONFIGURE,
        PERMISSION_CODES.ADMIN_INTERVIEW_PROCESS_TEMPLATE,
        PERMISSION_CODES.ADMIN_INTERVIEW_DIMENSION_SET
      ]
    },
    {
      key: 'data_management',
      name: '数据管理',
      icon: '@/assets/function/data-management.svg',
      type: 'success',
      path: '/admin/data',
      description: '数据备份、恢复和归档',
      permissions: [
        PERMISSION_CODES.ADMIN_DATA_USER_STATISTICS,
        PERMISSION_CODES.ADMIN_DATA_SYSTEM_USAGE_STATISTICS,
        PERMISSION_CODES.ADMIN_DATA_INTERVIEW_STATISTICS,
        PERMISSION_CODES.ADMIN_DATA_REVENUE_STATISTICS,
        PERMISSION_CODES.ADMIN_DATA_BACKUP_STRATEGY,
        PERMISSION_CODES.ADMIN_DATA_BACKUP_FILE_MANAGE,
        PERMISSION_CODES.ADMIN_DATA_RECOVERY,
        PERMISSION_CODES.ADMIN_DATA_ARCHIVE
      ]
    },
    {
      key: 'system_monitor',
      name: '系统监控',
      icon: '@/assets/function/system-monitor.svg',
      type: 'warning',
      path: '/admin/monitor',
      description: '服务器状态和性能监控',
      permissions: [
        PERMISSION_CODES.ADMIN_MONITOR_SERVER_STATUS,
        PERMISSION_CODES.ADMIN_MONITOR_PERFORMANCE_METRICS,
        PERMISSION_CODES.ADMIN_MONITOR_ERROR_RATE,
        PERMISSION_CODES.ADMIN_MONITOR_RESOURCE_USAGE,
        PERMISSION_CODES.ADMIN_LOG_USER_OPERATION,
        PERMISSION_CODES.ADMIN_LOG_SYSTEM_OPERATION,
        PERMISSION_CODES.ADMIN_LOG_SECURITY_EVENT,
        PERMISSION_CODES.ADMIN_LOG_AUDIT,
        PERMISSION_CODES.ADMIN_SECURITY_LOGIN_DETECT,
        PERMISSION_CODES.ADMIN_SECURITY_SENSITIVE_MONITOR,
        PERMISSION_CODES.ADMIN_SECURITY_LEAK_DETECT,
        PERMISSION_CODES.ADMIN_SECURITY_INCIDENT_HANDLE
      ]
    }
  ],

  // HR功能
  'ROLE_HR': [
    {
      key: 'candidate_management',
      name: '候选人管理',
      icon: '@/assets/function/candidate-management.svg',
      type: 'primary',
      path: '/hr/candidates',
      description: '管理候选人信息和状态',
      permissions: [
        PERMISSION_CODES.CANDIDATE_VIEW,
        PERMISSION_CODES.CANDIDATE_CREATE,
        PERMISSION_CODES.CANDIDATE_MODIFY,
        PERMISSION_CODES.CANDIDATE_DELETE,
        PERMISSION_CODES.CANDIDATE_TAG_MANAGE,
        PERMISSION_CODES.CANDIDATE_STATUS_TRACK,
        PERMISSION_CODES.CANDIDATE_BATCH_OPERATE,
        PERMISSION_CODES.CANDIDATE_SEARCH,
        PERMISSION_CODES.CANDIDATE_FILTER
      ]
    },
    {
      key: 'resume_screening',
      name: '简历筛选',
      icon: '@/assets/function/resume-select.svg',
      type: 'warning',
      path: '/hr/screening',
      description: 'AI智能筛选和评分',
      permissions: [
        PERMISSION_CODES.RESUME_FILTER_AI,
        PERMISSION_CODES.RESUME_FILTER_KEYWORD,
        PERMISSION_CODES.RESUME_FILTER_SKILL,
        PERMISSION_CODES.RESUME_FILTER_SCORE,
        PERMISSION_CODES.RESUME_FILTER_BATCH
      ]
    },
    {
      key: 'interview_management',
      name: '面试管理',
      icon: '@/assets/function/interview-management.svg',
      type: 'success',
      path: '/hr/interviews',
      description: '面试安排和流程管理',
      permissions: [
        PERMISSION_CODES.INTERVIEW_ARRANGE_CREATE,
        PERMISSION_CODES.INTERVIEW_ARRANGE_MODIFY,
        PERMISSION_CODES.INTERVIEW_ARRANGE_CANCEL,
        PERMISSION_CODES.INTERVIEW_INTERVIEWER_ASSIGN,
        PERMISSION_CODES.INTERVIEW_ROOM_MANAGE,
        PERMISSION_CODES.INTERVIEW_PROCESS_SET,
        PERMISSION_CODES.INTERVIEW_MONITOR_REAL_TIME,
        PERMISSION_CODES.INTERVIEW_QUALITY_ASSESS,
        PERMISSION_CODES.INTERVIEW_INTERVIEWER_EVALUATE,
        PERMISSION_CODES.INTERVIEW_EXCEPTION_HANDLE
      ]
    },
    {
      key: 'position_management',
      name: '岗位管理',
      icon: '@/assets/function/jobs-management.svg',
      type: 'info',
      path: '/hr/positions',
      description: '招聘岗位和需求管理',
      permissions: [
        PERMISSION_CODES.COMPANY_POSITION_MANAGE,
        PERMISSION_CODES.COMPANY_REQUIREMENT_MANAGE
      ]
    },
    {
      key: 'communication',
      name: '沟通管理',
      icon: '@/assets/function/communication-management.svg',
      type: 'primary',
      path: '/hr/communication',
      description: '候选人沟通和消息通知',
      permissions: [
        PERMISSION_CODES.COMMUNICATION_MESSAGE_SEND,
        PERMISSION_CODES.COMMUNICATION_INVITATION_SEND,
        PERMISSION_CODES.COMMUNICATION_FEEDBACK_COLLECT,
        PERMISSION_CODES.COMMUNICATION_RECORD_VIEW,
        PERMISSION_CODES.COMMUNICATION_TEMPLATE_MANAGE
      ]
    },
    {
      key: 'interview_evaluation',
      name: '面试评估',
      icon: '@/assets/function/interview-assessment.svg',
      type: 'success',
      path: '/hr/evaluation',
      description: '面试评分和结果管理',
      permissions: [
        PERMISSION_CODES.EVALUATION_SCORE_CREATE,
        PERMISSION_CODES.EVALUATION_SCORE_MODIFY,
        PERMISSION_CODES.EVALUATION_DIMENSION_MANAGE,
        PERMISSION_CODES.EVALUATION_TEMPLATE_MANAGE,
        PERMISSION_CODES.EVALUATION_RESULT_SUMMARY,
        PERMISSION_CODES.EVALUATION_REPORT_GENERATE
      ]
    },
    {
      key: 'data_analytics',
      name: '数据分析',
      icon: '@/assets/function/data-analyze.svg',
      type: 'info',
      path: '/hr/analytics',
      description: '招聘数据分析和报告',
      permissions: [
        PERMISSION_CODES.ANALYTICS_FUNNEL_ANALYZE,
        PERMISSION_CODES.ANALYTICS_SOURCE_STATISTICS,
        PERMISSION_CODES.ANALYTICS_PASS_RATE_ANALYZE,
        PERMISSION_CODES.ANALYTICS_EFFICIENCY_ASSESS,
        PERMISSION_CODES.ANALYTICS_QUALITY_REPORT,
        PERMISSION_CODES.ANALYTICS_INTERVIEWER_REPORT,
        PERMISSION_CODES.ANALYTICS_CANDIDATE_REPORT,
        PERMISSION_CODES.ANALYTICS_TREND_ANALYZE
      ]
    },
    {
      key: 'company_info',
      name: '企业信息',
      icon: '@/assets/function/company-info.svg',
      type: 'warning',
      path: '/hr/company',
      description: '企业基本信息和设置',
      permissions: [
        PERMISSION_CODES.COMPANY_INFO_VIEW,
        PERMISSION_CODES.COMPANY_INFO_MODIFY,
        PERMISSION_CODES.COMPANY_DEPARTMENT_MANAGE,
        PERMISSION_CODES.COMPANY_INTERVIEWER_MANAGE,
        PERMISSION_CODES.COMPANY_INTERVIEWER_PERMISSION_SET,
        PERMISSION_CODES.COMPANY_INTERVIEWER_TRAINING_RECORD,
        PERMISSION_CODES.COMPANY_INTERVIEWER_PERFORMANCE_EVALUATE,
        PERMISSION_CODES.COMPANY_PROCESS_DESIGN,
        PERMISSION_CODES.COMPANY_PROCESS_CONFIGURE,
        PERMISSION_CODES.COMPANY_PROCESS_STANDARD_SET,
        PERMISSION_CODES.COMPANY_PROCESS_TEMPLATE_MANAGE
      ]
    }
  ],

  // 求职者功能
  'ROLE_JOB_SEEKER': [
    {
      key: 'resume_management',
      name: '简历管理',
      icon: '@/assets/resume/resume-management.svg',
      type: 'info',
      path: '/resume/management',
      description: '简历上传、编辑和版本管理',
      permissions: [
        PERMISSION_CODES.RESUME_UPLOAD,
        PERMISSION_CODES.RESUME_MODIFY,
        PERMISSION_CODES.RESUME_TEMPLATE_CHOOSE,
        PERMISSION_CODES.RESUME_VIEW,
        PERMISSION_CODES.RESUME_EXPORT,
        PERMISSION_CODES.RESUME_VERSION_MANAGE,
        PERMISSION_CODES.RESUME_PARSE,
        PERMISSION_CODES.RESUME_SKILL_EXTRACT,
        PERMISSION_CODES.RESUME_EXPERIENCE_ANALYZE,
        PERMISSION_CODES.RESUME_EDUCATION_RECOGNIZE
      ]
    },
    {
      key: 'appointment',
      name: '面试预约',
      icon: '@/assets/function/jobseeker/interview-appointment.svg',
      type: 'primary',
      path: '/jobseeker/appointment',
      description: '面试时间预约管理',
      permissions: [
        PERMISSION_CODES.APPOINTMENT_VIEW,
        PERMISSION_CODES.APPOINTMENT_CREATE,
        PERMISSION_CODES.APPOINTMENT_MODIFY,
        PERMISSION_CODES.APPOINTMENT_CANCEL,
        PERMISSION_CODES.APPOINTMENT_REMINDER_SET,
        PERMISSION_CODES.APPOINTMENT_POSITION_SELECT,
        PERMISSION_CODES.APPOINTMENT_COMPANY_SELECT
      ]
    },
    {
      key: 'mock_interview',
      name: 'AI模拟面试',
      icon: '@/assets/function/jobseeker/ai-interview.svg',
      type: 'warning',
      path: '/jobseeker/mock-interview',
      description: 'AI驱动的面试模拟训练',
      permissions: [
        PERMISSION_CODES.MOCK_TECHNICAL_START,
        PERMISSION_CODES.MOCK_BEHAVIORAL_START,
        PERMISSION_CODES.MOCK_STRESS_START,
        PERMISSION_CODES.MOCK_SCENARIO_SELECT,
        PERMISSION_CODES.MOCK_QUESTION_VIEW,
        PERMISSION_CODES.MOCK_ANSWER_SUBMIT,
        PERMISSION_CODES.MOCK_RESULT_VIEW
      ]
    },
    {
      key: 'real_interview',
      name: '实时面试',
      icon: '@/assets/function/jobseeker/realtime-interview.svg',
      type: 'danger',
      path: '/jobseeker/real-interview',
      description: '在线视频面试',
      permissions: [
        PERMISSION_CODES.INTERVIEW_VIDEO_JOIN,
        PERMISSION_CODES.INTERVIEW_SCREEN_SHARE,
        PERMISSION_CODES.INTERVIEW_CODE_EDIT,
        PERMISSION_CODES.INTERVIEW_TIMER_VIEW,
        PERMISSION_CODES.INTERVIEW_RECORD_START,
        PERMISSION_CODES.INTERVIEW_RECORD_STOP
      ]
    },
    {
      key: 'interview_history',
      name: '面试记录',
      icon: '@/assets/function/jobseeker/interview-record.svg',
      type: 'info',
      path: '/jobseeker/interview-history',
      description: '历史面试记录和回放',
      permissions: [
        PERMISSION_CODES.HISTORY_VIEW,
        PERMISSION_CODES.HISTORY_RECORD_PLAY,
        PERMISSION_CODES.HISTORY_VIDEO_PLAY,
        PERMISSION_CODES.HISTORY_NOTE_CREATE,
        PERMISSION_CODES.HISTORY_NOTE_MODIFY,
        PERMISSION_CODES.HISTORY_FEEDBACK_VIEW
      ]
    },
    {
      key: 'interview_reports',
      name: '面试报告',
      icon: '@/assets/function/jobseeker/interview-report.svg',
      type: 'success',
      path: '/jobseeker/reports',
      description: '面试表现分析和报告',
      permissions: [
        PERMISSION_CODES.REPORT_PERSONAL_VIEW,
        PERMISSION_CODES.REPORT_PERFORMANCE_ANALYZE,
        PERMISSION_CODES.REPORT_SKILL_ASSESS,
        PERMISSION_CODES.REPORT_IMPROVEMENT_VIEW,
        PERMISSION_CODES.REPORT_TREND_ANALYZE,
        PERMISSION_CODES.REPORT_COMPARE_VIEW,
        PERMISSION_CODES.REPORT_INDUSTRY_COMPARE,
        PERMISSION_CODES.REPORT_GROWTH_TRACK
      ]
    },
    {
      key: 'learning_center',
      name: '学习中心',
      icon: '@/assets/function/jobseeker/study-center.svg',
      type: 'warning',
      path: '/jobseeker/learning',
      description: '面试技巧和学习资源',
      permissions: [
        PERMISSION_CODES.LEARNING_SKILL_VIEW,
        PERMISSION_CODES.LEARNING_IMPROVEMENT_VIEW,
        PERMISSION_CODES.LEARNING_NEWS_VIEW,
        PERMISSION_CODES.LEARNING_PROGRESS_TRACK
      ]
    },
    {
      key: 'user_profile',
      name: '个人中心',
      icon: '@/assets/function/jobseeker/user-profile.svg',
      type: 'primary',
      path: '/jobseeker/profile',
      description: '个人信息和设置管理',
      permissions: [
        PERMISSION_CODES.PROFILE_INFO_VIEW,
        PERMISSION_CODES.PROFILE_INFO_MODIFY,
        PERMISSION_CODES.PROFILE_AVATAR_UPLOAD,
        PERMISSION_CODES.PROFILE_CONTACT_MANAGE,
        PERMISSION_CODES.PROFILE_PRIVACY_SET
      ]
    }
  ]
}

// 角色统计配置
export const ROLE_STATISTICS = {
  'ROLE_ADMIN': [
    {
      key: 'total_users',
      name: '总用户数',
      icon: 'UserFilled',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      value: '1,234'
    },
    {
      key: 'total_companies',
      name: '企业数量',
      icon: 'OfficeBuilding',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      value: '89'
    },
    {
      key: 'total_interviews',
      name: '面试总数',
      icon: 'VideoPlay',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      value: '5,678'
    },
    {
      key: 'monthly_revenue',
      name: '本月收入',
      icon: 'Money',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      value: '¥123,456'
    }
  ],

  'ROLE_HR': [
    {
      key: 'total_candidates',
      name: '候选人总数',
      icon: 'User',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      value: '156'
    },
    {
      key: 'today_interviews',
      name: '今日面试',
      icon: 'VideoPlay',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      value: '23'
    },
    {
      key: 'active_positions',
      name: '招聘岗位',
      icon: 'Briefcase',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      value: '12'
    },
    {
      key: 'pass_rate',
      name: '面试通过率',
      icon: 'TrendCharts',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      value: '68%'
    }
  ],

  'ROLE_JOB_SEEKER': [
    {
      key: 'resume_versions',
      name: '简历版本',
      icon: '@/assets/resume/resume-version.svg',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      value: '3'
    },
    {
      key: 'interview_count',
      name: '面试次数',
      icon: '@/assets/interview/interview-count.svg',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      value: '8'
    },
    {
      key: 'overall_score',
      name: '综合评分',
      icon: '@/assets/other/comprehensive-score.svg',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      value: '85'
    },
    {
      key: 'received_offers',
      name: '收到Offer',
      icon: '@/assets/other/get-offer.svg',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      value: '2'
    }
  ]
}

// 根据角色获取功能列表
export function getRoleFeatures(role) {
  return ROLE_FEATURES[role] || []
}

// 根据角色获取统计配置
export function getRoleStatistics(role) {
  return ROLE_STATISTICS[role] || []
}

// 获取所有角色
export function getAllRoles() {
  return Object.keys(ROLE_FEATURES)
}

// 检查角色是否有某个功能
export function hasRoleFeature(role, featureKey) {
  const features = getRoleFeatures(role)
  return features.some(feature => feature.key === featureKey)
}

// 根据功能键获取功能信息
export function getFeatureByKey(role, featureKey) {
  const features = getRoleFeatures(role)
  return features.find(feature => feature.key === featureKey)
}

// 检查用户是否有某个权限
export function hasPermission(userPermissions, permissionCode) {
  return userPermissions && userPermissions.includes(permissionCode)
}

// 获取功能的所有权限
export function getFeaturePermissions(role, featureKey) {
  const feature = getFeatureByKey(role, featureKey)
  return feature ? feature.permissions : []
}

// 检查用户是否有功能的某个权限
export function hasFeaturePermission(userPermissions, role, featureKey, permissionCode) {
  const featurePermissions = getFeaturePermissions(role, featureKey)
  return hasPermission(userPermissions, permissionCode) && featurePermissions.includes(permissionCode)
}

// 获取所有权限代码
export function getAllPermissionCodes() {
  return Object.values(PERMISSION_CODES)
}

// 根据权限代码获取权限描述
export function getPermissionDescription(permissionCode) {
  const permissionMap = {
    // 这里可以根据需要添加权限代码到描述的映射
    // 由于权限描述在数据库中是动态的，这里提供一个基础框架
  }
  return permissionMap[permissionCode] || permissionCode
}
 