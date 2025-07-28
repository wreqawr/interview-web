/**
 * 角色功能配置
 * 基于角色的功能映射，用于动态生成页面功能列表
 */

// 角色功能映射配置
export const ROLE_FEATURES = {
  // 管理员功能
  'ROLE_ADMIN': [
    {
      key: 'user_management',
      name: '用户管理',
      icon: 'UserFilled',
      type: 'danger',
      path: '/admin/users',
      description: '管理系统用户、角色和权限'
    },
    {
      key: 'company_management',
      name: '企业管理',
      icon: 'OfficeBuilding',
      type: 'warning',
      path: '/admin/companies',
      description: '管理企业信息、认证和套餐'
    },
    {
      key: 'system_config',
      name: '系统配置',
      icon: 'Setting',
      type: 'info',
      path: '/admin/system',
      description: '系统参数配置和功能开关'
    },
    {
      key: 'data_management',
      name: '数据管理',
      icon: 'DataAnalysis',
      type: 'success',
      path: '/admin/data',
      description: '数据备份、恢复和归档'
    },
    {
      key: 'system_monitor',
      name: '系统监控',
      icon: 'Monitor',
      type: 'warning',
      path: '/admin/monitor',
      description: '服务器状态和性能监控'
    }
  ],

  // HR功能
  'ROLE_HR': [
    {
      key: 'candidate_management',
      name: '候选人管理',
      icon: 'User',
      type: 'primary',
      path: '/hr/candidates',
      description: '管理候选人信息和状态'
    },
    {
      key: 'resume_screening',
      name: '简历筛选',
      icon: 'Filter',
      type: 'warning',
      path: '/hr/screening',
      description: 'AI智能筛选和评分'
    },
    {
      key: 'interview_management',
      name: '面试管理',
      icon: 'VideoPlay',
      type: 'success',
      path: '/hr/interviews',
      description: '面试安排和流程管理'
    },
    {
      key: 'position_management',
      name: '岗位管理',
      icon: 'Briefcase',
      type: 'info',
      path: '/hr/positions',
      description: '招聘岗位和需求管理'
    },
    {
      key: 'communication',
      name: '沟通管理',
      icon: 'ChatDotRound',
      type: 'primary',
      path: '/hr/communication',
      description: '候选人沟通和消息通知'
    },
    {
      key: 'interview_evaluation',
      name: '面试评估',
      icon: 'Edit',
      type: 'success',
      path: '/hr/evaluation',
      description: '面试评分和结果管理'
    },
    {
      key: 'data_analytics',
      name: '数据分析',
      icon: 'TrendCharts',
      type: 'info',
      path: '/hr/analytics',
      description: '招聘数据分析和报告'
    },
    {
      key: 'company_info',
      name: '企业信息',
      icon: 'OfficeBuilding',
      type: 'warning',
      path: '/hr/company',
      description: '企业基本信息和设置'
    }
  ],

  // 求职者功能
  'ROLE_JOB_SEEKER': [
    {
      key: 'resume_management',
      name: '简历管理',
      icon: 'Document',
      type: 'info',
      path: '/jobseeker/resume',
      description: '简历上传、编辑和版本管理'
    },
    {
      key: 'mock_interview',
      name: 'AI模拟面试',
      icon: 'ChatDotRound',
      type: 'warning',
      path: '/jobseeker/mock-interview',
      description: 'AI驱动的面试模拟训练'
    },
    {
      key: 'real_interview',
      name: '实时面试',
      icon: 'VideoPlay',
      type: 'danger',
      path: '/jobseeker/real-interview',
      description: '在线视频面试'
    },
    {
      key: 'interview_history',
      name: '面试记录',
      icon: 'Clock',
      type: 'info',
      path: '/jobseeker/interview-history',
      description: '历史面试记录和回放'
    },
    {
      key: 'interview_reports',
      name: '面试报告',
      icon: 'DataAnalysis',
      type: 'success',
      path: '/jobseeker/reports',
      description: '面试表现分析和报告'
    },
    {
      key: 'appointment',
      name: '面试预约',
      icon: 'Calendar',
      type: 'primary',
      path: '/jobseeker/appointment',
      description: '面试时间预约管理'
    },
    {
      key: 'learning_center',
      name: '学习中心',
      icon: 'Reading',
      type: 'warning',
      path: '/jobseeker/learning',
      description: '面试技巧和学习资源'
    },
    {
      key: 'user_profile',
      name: '个人中心',
      icon: 'User',
      type: 'primary',
      path: '/jobseeker/profile',
      description: '个人信息和设置管理'
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
      icon: 'Document',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      value: '3'
    },
    {
      key: 'interview_count',
      name: '面试次数',
      icon: 'VideoPlay',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      value: '8'
    },
    {
      key: 'overall_score',
      name: '综合评分',
      icon: 'Star',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      value: '85'
    },
    {
      key: 'received_offers',
      name: '收到Offer',
      icon: 'Trophy',
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
