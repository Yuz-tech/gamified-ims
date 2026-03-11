import mongoose from 'mongoose';
import Topic from './models/Topic.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await Topic.deleteMany({});


    // Create Topics (All 28 IMS Topics)
    const topics = [
      {
        title: 'ISO 9001: Quality Management System',
        description: 'Learn the fundamentals of ISO 9001 and quality management principles.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/iso9001.png',
        badgeName: '品質チャンピオン',
        badgeDescription: 'Mastered ISO 9001 Quality Management',
        questions: [
          {
            question: 'What is the primary focus of ISO 9001?',
            options: ['Quality management and customer satisfaction', 'Environmental protection', 'Information security', 'Health and safety'],
            correctAnswer: 0,
            explanation: 'ISO 9001 focuses on quality management systems to ensure consistent customer satisfaction.',
            isMandatory: true
          },
          {
            question: 'What does PDCA stand for?',
            options: ['Plan-Do-Check-Act', 'Prepare-Deploy-Control-Assess', 'Process-Document-Certify-Audit', 'Plan-Design-Create-Approve'],
            correctAnswer: 0,
            explanation: 'PDCA (Plan-Do-Check-Act) is the continuous improvement cycle in ISO 9001.',
            isMandatory: false
          },
          {
            question: 'Which is a key principle of ISO 9001?',
            options: ['Customer focus', 'Profit maximization', 'Market dominance', 'Cost reduction only'],
            correctAnswer: 0,
            explanation: 'Customer focus is one of the seven quality management principles.',
            isMandatory: false
          },
          {
            question: 'What is the purpose of internal audits?',
            options: ['Verify compliance and identify improvements', 'Punish employees', 'Satisfy auditors only', 'Create paperwork'],
            correctAnswer: 0,
            explanation: 'Internal audits verify QMS compliance and identify improvement opportunities.',
            isMandatory: false
          },
          {
            question: 'What does continual improvement mean?',
            options: ['Ongoing efforts to enhance processes', 'One-time projects', 'Only fixing problems', 'Annual changes'],
            correctAnswer: 0,
            explanation: 'Continual improvement is recurring activity to enhance performance.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'ISO 27001: Information Security Management',
        description: 'Understand ISO 27001 standards for protecting sensitive information.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/iso 27001.png',
        badgeName: 'セキュリティのプロ',
        badgeDescription: 'Completed ISO 27001 Training',
        questions: [
          {
            question: 'What is the main purpose of ISO 27001?',
            options: ['Establish and maintain an ISMS', 'Improve product quality', 'Manage environmental impacts', 'Ensure workplace safety'],
            correctAnswer: 0,
            explanation: 'ISO 27001 provides a framework for Information Security Management Systems.',
            isMandatory: true
          },
          {
            question: 'What are the three pillars of information security?',
            options: ['Confidentiality, Integrity, Availability', 'Privacy, Security, Safety', 'Authentication, Authorization, Accounting', 'Prevention, Detection, Response'],
            correctAnswer: 0,
            explanation: 'The CIA triad is the foundation of information security.',
            isMandatory: false
          },
          {
            question: 'What is risk assessment in ISO 27001?',
            options: ['Identifying and evaluating security risks', 'Financial audit', 'Customer survey', 'Performance review'],
            correctAnswer: 0,
            explanation: 'Risk assessment identifies threats, vulnerabilities, and determines appropriate controls.',
            isMandatory: false
          },
          {
            question: 'What is an information asset?',
            options: ['Anything of value requiring protection', 'Only hardware', 'Only software', 'Only financial resources'],
            correctAnswer: 0,
            explanation: 'Information assets include data, hardware, software, people, and facilities.',
            isMandatory: false
          },
          {
            question: 'How often should ISMS be reviewed?',
            options: ['At planned intervals', 'Only when incidents occur', 'Every five years', 'Never'],
            correctAnswer: 0,
            explanation: 'ISO 27001 requires management reviews at planned intervals.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Quality and Information Security Integration',
        description: 'Learn how quality management and information security work together.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/quality and information.png',
        badgeName: '統合',
        badgeDescription: 'Mastered Integrated Management Systems',
        questions: [
          {
            question: 'Why integrate ISO 9001 and ISO 27001?',
            options: ['Streamline processes and reduce duplication', 'Make system complex', 'Satisfy regulations only', 'Create more documents'],
            correctAnswer: 0,
            explanation: 'Integration creates synergies and improves efficiency.',
            isMandatory: true
          },
          {
            question: 'What is common to both standards?',
            options: ['Risk-based thinking and continual improvement', 'Product manufacturing', 'Environmental management', 'Health protocols'],
            correctAnswer: 0,
            explanation: 'Both standards share risk-based thinking and PDCA cycle.',
            isMandatory: false
          },
          {
            question: 'How are data quality and security related?',
            options: ['Poor quality affects security and vice versa', 'Completely unrelated', 'Quality only matters for marketing', 'Security is only passwords'],
            correctAnswer: 0,
            explanation: 'Data quality and security are interconnected and interdependent.',
            isMandatory: false
          },
          {
            question: 'Who is responsible for quality and security?',
            options: ['Everyone in the organization', 'Only IT department', 'Only quality managers', 'Only top management'],
            correctAnswer: 0,
            explanation: 'Quality and security are everyone\'s responsibility.',
            isMandatory: false
          },
          {
            question: 'What is a benefit of documented procedures?',
            options: ['Consistency, traceability, reduced errors', 'More paperwork', 'Slower processes', 'Less flexibility'],
            correctAnswer: 0,
            explanation: 'Documented procedures ensure consistency and reduce errors.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Internet Acceptable Use Policy',
        description: 'Understand acceptable use guidelines for internet access at work.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/internet acceptable use.png',
        badgeName: 'サイバープロ',
        badgeDescription: 'Mastered Internet Use Guidelines',
        questions: [
          {
            question: 'What is the purpose of Internet Acceptable Use Policy?',
            options: ['Define acceptable use and protect resources', 'Prevent all internet use', 'Monitor personal emails', 'Block social media'],
            correctAnswer: 0,
            explanation: 'The policy establishes guidelines for safe and appropriate internet use.',
            isMandatory: true
          },
          {
            question: 'Which is typically acceptable internet use?',
            options: ['Work-related research', 'Downloading pirated software', 'Gambling websites', 'Sharing confidential info on social media'],
            correctAnswer: 0,
            explanation: 'Acceptable use includes legitimate business activities.',
            isMandatory: false
          },
          {
            question: 'Why avoid suspicious links?',
            options: ['May contain malware or phishing', 'Wastes bandwidth', 'Slows computer', 'Company monitors clicks'],
            correctAnswer: 0,
            explanation: 'Suspicious links are common vectors for cyber attacks.',
            isMandatory: false
          },
          {
            question: 'What if you accidentally access restricted content?',
            options: ['Close immediately and report to IT', 'Continue browsing', 'Share with colleagues', 'Hide browsing history'],
            correctAnswer: 0,
            explanation: 'Transparency protects you and the organization.',
            isMandatory: false
          },
          {
            question: 'Is brief personal internet use allowed?',
            options: ['Only if permitted by policy', 'Yes, always', 'No, never', 'Only if nobody knows'],
            correctAnswer: 0,
            explanation: 'Personal use must align with company policy.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Anti-Malware Policy',
        description: 'Learn about malware protection and prevention measures.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/anti malware badge.png',
        badgeName: 'マルウェア防御者',
        badgeDescription: 'Completed Anti-Malware Training',
        questions: [
          {
            question: 'What is malware?',
            options: ['Malicious software designed to harm systems', 'Broken hardware', 'Slow internet', 'Old software'],
            correctAnswer: 0,
            explanation: 'Malware is software intentionally designed to cause damage.',
            isMandatory: true
          },
          {
            question: 'Which is a type of malware?',
            options: ['Ransomware', 'Firewall', 'Antivirus', 'Encryption'],
            correctAnswer: 0,
            explanation: 'Ransomware encrypts data and demands payment.',
            isMandatory: false
          },
          {
            question: 'How often should antivirus definitions update?',
            options: ['Daily or automatically', 'Monthly', 'Yearly', 'Never'],
            correctAnswer: 0,
            explanation: 'Daily updates protect against new threats.',
            isMandatory: false
          },
          {
            question: 'What should you do if antivirus detects malware?',
            options: ['Follow prompts and report to IT', 'Ignore it', 'Delete antivirus', 'Restart computer'],
            correctAnswer: 0,
            explanation: 'Follow antivirus prompts and notify IT immediately.',
            isMandatory: false
          },
          {
            question: 'Can malware spread through email?',
            options: ['Yes, through attachments and links', 'No, email is safe', 'Only on mobile', 'Only on old computers'],
            correctAnswer: 0,
            explanation: 'Email is a common malware delivery method.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Access Control Policy',
        description: 'Understand access control principles and user permissions.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/access control badge.png',
        badgeName: 'アクセス制御',
        badgeDescription: 'Mastered Access Control Principles',
        questions: [
          {
            question: 'What is the principle of least privilege?',
            options: ['Users get only access they need', 'Everyone gets full access', 'Managers get all access', 'No one gets access'],
            correctAnswer: 0,
            explanation: 'Least privilege minimizes security risks by limiting access.',
            isMandatory: true
          },
          {
            question: 'What is multi-factor authentication?',
            options: ['Multiple verification methods', 'Strong password only', 'Biometric only', 'Security questions only'],
            correctAnswer: 0,
            explanation: 'MFA requires two or more verification factors.',
            isMandatory: false
          },
          {
            question: 'Should you share your credentials?',
            options: ['Never, even with colleagues', 'Yes, with teammates', 'Yes, with managers', 'Yes, in emergencies'],
            correctAnswer: 0,
            explanation: 'Credentials are personal and must never be shared.',
            isMandatory: false
          },
          {
            question: 'When should access rights be reviewed?',
            options: ['Regularly and when roles change', 'Only when hired', 'Only when fired', 'Never'],
            correctAnswer: 0,
            explanation: 'Regular reviews ensure appropriate access levels.',
            isMandatory: false
          },
          {
            question: 'What is role-based access control?',
            options: ['Access based on job role', 'Everyone gets same access', 'Random access assignment', 'No access control'],
            correctAnswer: 0,
            explanation: 'RBAC grants access based on organizational roles.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Network Access Policy',
        description: 'Learn about secure network access and connection guidelines.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/network access.png',
        badgeName: '安全なネットワーク',
        badgeDescription: 'Completed Network Access Training',
        questions: [
          {
            question: 'Why is network segmentation important?',
            options: ['Limits damage from security breaches', 'Slows down network', 'Increases costs', 'Complicates management'],
            correctAnswer: 0,
            explanation: 'Segmentation contains breaches and limits lateral movement.',
            isMandatory: true
          },
          {
            question: 'Is public WiFi safe for work?',
            options: ['No, use VPN if necessary', 'Yes, always safe', 'Yes, if password-protected', 'Only at airports'],
            correctAnswer: 0,
            explanation: 'Public WiFi is insecure; use VPN for protection.',
            isMandatory: false
          },
          {
            question: 'What is a VPN?',
            options: ['Virtual Private Network for secure connection', 'Very Public Network', 'Virus Protection Network', 'Video Playback Network'],
            correctAnswer: 0,
            explanation: 'VPN encrypts traffic over untrusted networks.',
            isMandatory: false
          },
          {
            question: 'Should you connect personal devices to company network?',
            options: ['Only if approved and compliant', 'Yes, anytime', 'No, never', 'Only phones'],
            correctAnswer: 0,
            explanation: 'Personal devices must meet security requirements.',
            isMandatory: false
          },
          {
            question: 'What is a firewall?',
            options: ['Network security system controlling traffic', 'Physical barrier', 'Antivirus software', 'Password manager'],
            correctAnswer: 0,
            explanation: 'Firewalls monitor and control network traffic.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Data Protection & Privacy Policy',
        description: 'Understand data protection principles and privacy regulations.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/data protection and privacy.png',
        badgeName: 'Privacy Champion',
        badgeDescription: 'Mastered Data Protection & Privacy',
        questions: [
          {
            question: 'What is personal data?',
            options: ['Information identifying an individual', 'Company financial data', 'Public information', 'Marketing data'],
            correctAnswer: 0,
            explanation: 'Personal data is any information relating to an identifiable person.',
            isMandatory: true
          },
          {
            question: 'What is GDPR?',
            options: ['General Data Protection Regulation', 'Global Data Privacy Rules', 'Government Data Protection Rights', 'General Document Protection Rules'],
            correctAnswer: 0,
            explanation: 'GDPR is EU regulation protecting personal data.',
            isMandatory: false
          },
          {
            question: 'What is data minimization?',
            options: ['Collect only necessary data', 'Collect maximum data', 'Delete all data', 'Share all data'],
            correctAnswer: 0,
            explanation: 'Data minimization limits collection to what is needed.',
            isMandatory: false
          },
          {
            question: 'Can you share customer data freely?',
            options: ['No, only with authorization', 'Yes, within company', 'Yes, with partners', 'Yes, if encrypted'],
            correctAnswer: 0,
            explanation: 'Customer data requires proper authorization and controls.',
            isMandatory: false
          },
          {
            question: 'What is a data breach?',
            options: ['Unauthorized access to data', 'Slow database', 'Lost password', 'Full storage'],
            correctAnswer: 0,
            explanation: 'Data breach is unauthorized access, disclosure, or loss.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Cryptographic Control Policy',
        description: 'Learn about encryption and cryptographic controls.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/cryptographic control.png',
        badgeName: 'Crypto Control Vanquisher',
        badgeDescription: 'Completed Cryptography Training',
        questions: [
          {
            question: 'What is encryption?',
            options: ['Converting data to unreadable format', 'Deleting data', 'Compressing data', 'Copying data'],
            correctAnswer: 0,
            explanation: 'Encryption protects data by making it unreadable without the key.',
            isMandatory: true
          },
          {
            question: 'When should data be encrypted?',
            options: ['In transit and at rest', 'Only in transit', 'Only at rest', 'Never'],
            correctAnswer: 0,
            explanation: 'Encryption protects data both during transmission and storage.',
            isMandatory: false
          },
          {
            question: 'What is a cryptographic key?',
            options: ['Secret used to encrypt/decrypt data', 'Physical key', 'Password', 'Username'],
            correctAnswer: 0,
            explanation: 'Cryptographic keys are secrets used in encryption algorithms.',
            isMandatory: false
          },
          {
            question: 'Should encryption keys be shared?',
            options: ['No, protect like passwords', 'Yes, with team', 'Yes, in email', 'Yes, in documents'],
            correctAnswer: 0,
            explanation: 'Keys must be protected and never shared insecurely.',
            isMandatory: false
          },
          {
            question: 'What is SSL/TLS?',
            options: ['Protocols for secure web communication', 'Antivirus software', 'Firewall type', 'Password policy'],
            correctAnswer: 0,
            explanation: 'SSL/TLS encrypts web traffic (HTTPS).',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Cloud Service Policy',
        description: 'Understand cloud service usage and security requirements.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/cloud service.png',
        badgeName: 'Cloud Marauder',
        badgeDescription: 'Mastered Cloud Service Policy',
        questions: [
          {
            question: 'What is cloud computing?',
            options: ['Computing services over the internet', 'Weather prediction', 'Local storage', 'Physical servers only'],
            correctAnswer: 0,
            explanation: 'Cloud computing delivers services via internet.',
            isMandatory: true
          },
          {
            question: 'Can you use any cloud service for work?',
            options: ['No, only approved services', 'Yes, any service', 'Yes, free services', 'Only personal services'],
            correctAnswer: 0,
            explanation: 'Only approved cloud services meet security requirements.',
            isMandatory: false
          },
          {
            question: 'What is Shadow IT?',
            options: ['Unauthorized IT systems or services', 'Dark web', 'Black hat hackers', 'Backup systems'],
            correctAnswer: 0,
            explanation: 'Shadow IT is unapproved technology use that creates risks.',
            isMandatory: false
          },
          {
            question: 'Who is responsible for cloud data security?',
            options: ['Shared between provider and organization', 'Only provider', 'Only organization', 'No one'],
            correctAnswer: 0,
            explanation: 'Cloud security is a shared responsibility model.',
            isMandatory: false
          },
          {
            question: 'Should company data be stored in personal cloud accounts?',
            options: ['No, use approved business accounts', 'Yes, if convenient', 'Yes, if encrypted', 'Yes, if free'],
            correctAnswer: 0,
            explanation: 'Company data requires approved business-grade cloud services.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Data Leak Prevention',
        description: 'Learn how to prevent unauthorized data disclosure.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/data leak prevention.png',
        badgeName: 'DLP Specialist',
        badgeDescription: 'Mastered Data Leak Prevention',
        questions: [
          {
            question: 'What is Data Leak Prevention (DLP)?',
            options: ['Preventing unauthorized data disclosure', 'Fixing water leaks', 'Deleting old data', 'Backing up data'],
            correctAnswer: 0,
            explanation: 'DLP prevents sensitive data from leaving the organization.',
            isMandatory: true
          },
          {
            question: 'Which is a data leak risk?',
            options: ['Sending confidential files to personal email', 'Saving to approved cloud', 'Using encrypted USB', 'Following procedures'],
            correctAnswer: 0,
            explanation: 'Personal email is an unauthorized channel for company data.',
            isMandatory: false
          },
          {
            question: 'What should you do before emailing sensitive data?',
            options: ['Verify recipient and encrypt if needed', 'Send immediately', 'CC everyone', 'Use BCC'],
            correctAnswer: 0,
            explanation: 'Always verify recipients and protect sensitive data.',
            isMandatory: false
          },
          {
            question: 'Are screenshots of confidential data allowed?',
            options: ['Only if authorized and necessary', 'Yes, always', 'No, never', 'Only on phone'],
            correctAnswer: 0,
            explanation: 'Screenshots must follow same confidentiality rules.',
            isMandatory: false
          },
          {
            question: 'What is data classification?',
            options: ['Labeling data by sensitivity', 'Organizing files', 'Deleting data', 'Encrypting data'],
            correctAnswer: 0,
            explanation: 'Classification determines appropriate handling controls.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Secure Coding Policy',
        description: 'Understand secure software development practices.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/secure coding.png',
        badgeName: 'Coder gates',
        badgeDescription: 'Completed Secure Coding Training',
        questions: [
          {
            question: 'What is secure coding?',
            options: ['Writing software resistant to vulnerabilities', 'Fast coding', 'Code encryption', 'Code backup'],
            correctAnswer: 0,
            explanation: 'Secure coding prevents security vulnerabilities in software.',
            isMandatory: true
          },
          {
            question: 'What is SQL injection?',
            options: ['Attack inserting malicious SQL code', 'Database optimization', 'Data query', 'Backup method'],
            correctAnswer: 0,
            explanation: 'SQL injection exploits poor input validation.',
            isMandatory: false
          },
          {
            question: 'Should passwords be hardcoded in source code?',
            options: ['No, use secure configuration', 'Yes, for convenience', 'Yes, if commented', 'Only in test code'],
            correctAnswer: 0,
            explanation: 'Hardcoded credentials are a critical security flaw.',
            isMandatory: false
          },
          {
            question: 'What is input validation?',
            options: ['Checking user input for malicious content', 'User authentication', 'Data backup', 'Code review'],
            correctAnswer: 0,
            explanation: 'Input validation prevents injection attacks.',
            isMandatory: false
          },
          {
            question: 'When should code be reviewed for security?',
            options: ['During development and before release', 'Only after incidents', 'Only at release', 'Never'],
            correctAnswer: 0,
            explanation: 'Security reviews should be integrated throughout development.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Risk Assessment Procedure',
        description: 'Learn how to identify and assess information security risks.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/risk assessment.png',
        badgeName: 'Risk Analyst',
        badgeDescription: 'Mastered Risk Assessment',
        questions: [
          {
            question: 'What is a risk assessment?',
            options: ['Identifying and evaluating threats', 'Financial audit', 'Performance review', 'Customer survey'],
            correctAnswer: 0,
            explanation: 'Risk assessment identifies threats and vulnerabilities.',
            isMandatory: true
          },
          {
            question: 'What is a threat?',
            options: ['Potential cause of unwanted incident', 'Security control', 'Data backup', 'Password policy'],
            correctAnswer: 0,
            explanation: 'Threats are potential sources of harm.',
            isMandatory: false
          },
          {
            question: 'What is a vulnerability?',
            options: ['Weakness that can be exploited', 'Security control', 'Strong password', 'Firewall'],
            correctAnswer: 0,
            explanation: 'Vulnerabilities are weaknesses in systems or processes.',
            isMandatory: false
          },
          {
            question: 'How is risk calculated?',
            options: ['Likelihood x Impact', 'Assets + Threats', 'Controls - Vulnerabilities', 'Budget / Time'],
            correctAnswer: 0,
            explanation: 'Risk = Likelihood of occurrence × Impact of consequences.',
            isMandatory: false
          },
          {
            question: 'What is risk treatment?',
            options: ['Actions to modify risk', 'Risk acceptance', 'Risk avoidance only', 'Ignoring risk'],
            correctAnswer: 0,
            explanation: 'Risk treatment includes mitigation, transfer, acceptance, or avoidance.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Document Control Awareness',
        description: 'Understand document management and version control.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/document control.png',
        badgeName: 'Document Control',
        badgeDescription: 'Mastered Document Control',
        questions: [
          {
            question: 'Why is document control important?',
            options: ['Ensures use of correct versions', 'Creates paperwork', 'Slows processes', 'Increases storage'],
            correctAnswer: 0,
            explanation: 'Document control ensures accuracy and compliance.',
            isMandatory: true
          },
          {
            question: 'What is version control?',
            options: ['Tracking document changes over time', 'Deleting old files', 'Printing documents', 'Email backup'],
            correctAnswer: 0,
            explanation: 'Version control tracks changes and maintains history.',
            isMandatory: false
          },
          {
            question: 'Should you work from local copies of controlled documents?',
            options: ['No, use official repository', 'Yes, always', 'Yes, if convenient', 'Only offline'],
            correctAnswer: 0,
            explanation: 'Local copies may be outdated; use official versions.',
            isMandatory: false
          },
          {
            question: 'What is document retention?',
            options: ['Keeping documents for required period', 'Never deleting', 'Immediate deletion', 'Random storage'],
            correctAnswer: 0,
            explanation: 'Retention ensures documents are kept as legally required.',
            isMandatory: false
          },
          {
            question: 'Who can approve controlled documents?',
            options: ['Authorized personnel only', 'Anyone', 'Document creator', 'All employees'],
            correctAnswer: 0,
            explanation: 'Only authorized individuals can approve changes.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Exchange of Information Policy',
        description: 'Learn secure methods for sharing information.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/information exchange.png',
        badgeName: 'Information Exchange Pro',
        badgeDescription: 'Mastered Secure Information Sharing',
        questions: [
          {
            question: 'What should you do before sharing sensitive information?',
            options: ['Verify recipient authorization', 'Share immediately', 'Post publicly', 'Email to everyone'],
            correctAnswer: 0,
            explanation: 'Always verify recipients have authorization for sensitive data.',
            isMandatory: true
          },
          {
            question: 'Which method is secure for sharing confidential files?',
            options: ['Encrypted file transfer or secure portal', 'Personal email', 'Public cloud link', 'Social media'],
            correctAnswer: 0,
            explanation: 'Use approved secure channels for confidential information.',
            isMandatory: false
          },
          {
            question: 'Should you discuss confidential matters in public?',
            options: ['No, only in secure locations', 'Yes, if quiet', 'Yes, if necessary', 'Only with colleagues'],
            correctAnswer: 0,
            explanation: 'Public spaces pose eavesdropping and shoulder surfing risks.',
            isMandatory: false
          },
          {
            question: 'What is an NDA?',
            options: ['Non-Disclosure Agreement', 'New Data Access', 'Network Device Authorization', 'No Data Available'],
            correctAnswer: 0,
            explanation: 'NDAs legally protect confidential information.',
            isMandatory: false
          },
          {
            question: 'Can you forward confidential emails?',
            options: ['Only if authorized', 'Yes, within company', 'Yes, to anyone', 'Yes, if BCC'],
            correctAnswer: 0,
            explanation: 'Forwarding requires same authorization as original sharing.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Asset Inventory',
        description: 'Understand the importance of tracking organizational assets.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/asset inventory.png',
        badgeName: 'Asset Manager',
        badgeDescription: 'Completed Asset Inventory Training',
        questions: [
          {
            question: 'Why maintain an asset inventory?',
            options: ['Track and protect organizational assets', 'Create paperwork', 'Count equipment', 'Insurance only'],
            correctAnswer: 0,
            explanation: 'Asset inventory enables proper security and management.',
            isMandatory: true
          },
          {
            question: 'What is an information asset?',
            options: ['Hardware, software, data, or services', 'Only computers', 'Only data', 'Only buildings'],
            correctAnswer: 0,
            explanation: 'Information assets include all resources supporting information processing.',
            isMandatory: false
          },
          {
            question: 'Should personal devices be in the inventory?',
            options: ['Yes, if used for work', 'No, never', 'Only phones', 'Only laptops'],
            correctAnswer: 0,
            explanation: 'Work-used personal devices (BYOD) require tracking.',
            isMandatory: false
          },
          {
            question: 'What is asset classification?',
            options: ['Categorizing by value and sensitivity', 'Organizing by color', 'Sorting by age', 'Grouping by size'],
            correctAnswer: 0,
            explanation: 'Classification determines appropriate protection levels.',
            isMandatory: false
          },
          {
            question: 'When should inventory be updated?',
            options: ['When assets are added, changed, or removed', 'Yearly only', 'Never', 'When audited'],
            correctAnswer: 0,
            explanation: 'Inventory must reflect current state of assets.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Email Rules',
        description: 'Learn proper email usage and security practices.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/email-rules.png',
        badgeName: 'Email Expert',
        badgeDescription: 'Mastered Email Security',
        questions: [
          {
            question: 'What is phishing?',
            options: ['Fraudulent emails attempting to steal information', 'Spam filter', 'Email backup', 'Newsletter'],
            correctAnswer: 0,
            explanation: 'Phishing uses deceptive emails to trick victims.',
            isMandatory: true
          },
          {
            question: 'How to identify phishing emails?',
            options: ['Suspicious sender, urgency, unexpected attachments', 'All emails are phishing', 'Only spam is phishing', 'Check email length'],
            correctAnswer: 0,
            explanation: 'Phishing shows red flags like urgency and suspicious links.',
            isMandatory: false
          },
          {
            question: 'Should you click links in unexpected emails?',
            options: ['No, verify sender first', 'Yes, always', 'Yes, if from known company', 'Only on phone'],
            correctAnswer: 0,
            explanation: 'Always verify unexpected emails before clicking.',
            isMandatory: false
          },
          {
            question: 'Is email suitable for highly confidential information?',
            options: ['No, use encrypted channels', 'Yes, always', 'Yes, if internal', 'Yes, if password protected'],
            correctAnswer: 0,
            explanation: 'Standard email is not secure enough for highly confidential data.',
            isMandatory: false
          },
          {
            question: 'What should you do with suspicious emails?',
            options: ['Report to IT and delete', 'Reply asking questions', 'Forward to colleagues', 'Ignore them'],
            correctAnswer: 0,
            explanation: 'Report phishing attempts to help protect others.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Confidential Information Handling Policy',
        description: 'Learn how to properly handle confidential information.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/confidential.png',
        badgeName: 'Confidentiality Badge',
        badgeDescription: 'Mastered Confidential Information Handling',
        questions: [
          {
            question: 'What is confidential information?',
            options: ['Sensitive data requiring protection', 'Public information', 'Personal opinions', 'Marketing materials'],
            correctAnswer: 0,
            explanation: 'Confidential information requires special protection due to sensitivity.',
            isMandatory: true
          },
          {
            question: 'Can you discuss confidential projects in public?',
            options: ['No, only in secure locations', 'Yes, if careful', 'Yes, with colleagues', 'Yes, if necessary'],
            correctAnswer: 0,
            explanation: 'Public discussions risk unauthorized disclosure.',
            isMandatory: false
          },
          {
            question: 'How should confidential documents be stored?',
            options: ['Locked or encrypted storage', 'On desk', 'In trash', 'In email'],
            correctAnswer: 0,
            explanation: 'Confidential documents require physical or electronic protection.',
            isMandatory: false
          },
          {
            question: 'Should confidential info be taken outside work?',
            options: ['Only if authorized and protected', 'Yes, anytime', 'No, never', 'Only in briefcase'],
            correctAnswer: 0,
            explanation: 'Removing confidential information requires approval and safeguards.',
            isMandatory: false
          },
          {
            question: 'What if you accidentally disclose confidential info?',
            options: ['Report immediately to supervisor', 'Keep quiet', 'Delete evidence', 'Blame others'],
            correctAnswer: 0,
            explanation: 'Immediate reporting enables damage control.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Telework Policy',
        description: 'Understand secure remote work practices.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/telework.png',
        badgeName: 'Remote Work Badge',
        badgeDescription: 'Completed Telework Security Training',
        questions: [
          {
            question: 'What is most important when working remotely?',
            options: ['Maintain same security standards', 'Work faster', 'Skip security', 'Use personal devices'],
            correctAnswer: 0,
            explanation: 'Remote work requires same security as office work.',
            isMandatory: true
          },
          {
            question: 'Should you use public WiFi for work?',
            options: ['No, or use VPN if necessary', 'Yes, always', 'Yes, if password-protected', 'Only for email'],
            correctAnswer: 0,
            explanation: 'Public WiFi is insecure without VPN protection.',
            isMandatory: false
          },
          {
            question: 'How to secure your home workspace?',
            options: ['Lock devices, use privacy screens, secure network', 'Leave devices unlocked', 'Work in public areas', 'Share network openly'],
            correctAnswer: 0,
            explanation: 'Home workspace requires physical and digital security.',
            isMandatory: false
          },
          {
            question: 'Can family members use your work computer?',
            options: ['No, work devices are for authorized use only', 'Yes, anytime', 'Yes, if supervised', 'Only for browsing'],
            correctAnswer: 0,
            explanation: 'Work devices must be used only for authorized purposes.',
            isMandatory: false
          },
          {
            question: 'What if your work device is lost or stolen?',
            options: ['Report immediately to IT', 'Wait and see', 'Buy replacement', 'Search quietly'],
            correctAnswer: 0,
            explanation: 'Immediate reporting enables remote wipe and damage control.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Information Security Incident Policy',
        description: 'Learn how to identify and report security incidents.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/incident.png',
        badgeName: 'Incident Response Badge',
        badgeDescription: 'Mastered Incident Response',
        questions: [
          {
            question: 'What is a security incident?',
            options: ['Event compromising security', 'System update', 'Password change', 'Software installation'],
            correctAnswer: 0,
            explanation: 'Security incidents are events that breach or threaten security.',
            isMandatory: true
          },
          {
            question: 'When should you report a suspected incident?',
            options: ['Immediately', 'After confirming', 'Next day', 'Never if minor'],
            correctAnswer: 0,
            explanation: 'Quick reporting enables faster response and limits damage.',
            isMandatory: false
          },
          {
            question: 'What is NOT a security incident?',
            options: ['Scheduled maintenance', 'Malware infection', 'Data breach', 'Unauthorized access'],
            correctAnswer: 0,
            explanation: 'Scheduled maintenance is planned, not an incident.',
            isMandatory: false
          },
          {
            question: 'Who should handle security incidents?',
            options: ['IT security team', 'Any employee', 'Ignore them', 'Fix yourself'],
            correctAnswer: 0,
            explanation: 'Security incidents require specialized response team.',
            isMandatory: false
          },
          {
            question: 'What should you do if you suspect compromise?',
            options: ['Disconnect, report, preserve evidence', 'Continue working', 'Restart computer', 'Delete files'],
            correctAnswer: 0,
            explanation: 'Proper incident response includes containment and preservation.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Training Policy',
        description: 'Understand the importance of security awareness training.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/training.png',
        badgeName: 'Training Badge',
        badgeDescription: 'Completed Training Policy',
        questions: [
          {
            question: 'Why is security training important?',
            options: ['Builds awareness and reduces risk', 'Waste of time', 'Only for IT', 'Compliance checkbox'],
            correctAnswer: 0,
            explanation: 'Training empowers employees to protect information.',
            isMandatory: true
          },
          {
            question: 'How often should security training occur?',
            options: ['Regularly and when roles change', 'Once at hire', 'Never', 'Only after incidents'],
            correctAnswer: 0,
            explanation: 'Ongoing training maintains awareness of evolving threats.',
            isMandatory: false
          },
          {
            question: 'Who needs security training?',
            options: ['All employees', 'Only IT staff', 'Only managers', 'Only new hires'],
            correctAnswer: 0,
            explanation: 'Everyone plays a role in information security.',
            isMandatory: false
          },
          {
            question: 'What topics should training cover?',
            options: ['Policies, threats, best practices', 'Only passwords', 'Only phishing', 'Only compliance'],
            correctAnswer: 0,
            explanation: 'Comprehensive training covers all relevant security topics.',
            isMandatory: false
          },
          {
            question: 'Is completing training enough?',
            options: ['No, must apply knowledge daily', 'Yes, training is all', 'Yes, if passed test', 'Only need certificate'],
            correctAnswer: 0,
            explanation: 'Training effectiveness requires practical application.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Secured Area Policy',
        description: 'Learn about physical security and access controls.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/secured-area.png',
        badgeName: 'Physical Security Expert',
        badgeDescription: 'Mastered Secured Area Policy',
        questions: [
          {
            question: 'What is a secured area?',
            options: ['Restricted area requiring authorization', 'Any office', 'Parking lot', 'Break room'],
            correctAnswer: 0,
            explanation: 'Secured areas contain sensitive assets or information.',
            isMandatory: true
          },
          {
            question: 'Should you hold doors open for others?',
            options: ['No, everyone must use own access', 'Yes, to be polite', 'Yes, if you know them', 'Only for visitors'],
            correctAnswer: 0,
            explanation: 'Tailgating allows unauthorized access; everyone must authenticate.',
            isMandatory: false
          },
          {
            question: 'What should you do with your access badge?',
            options: ['Keep secure and never share', 'Share with colleagues', 'Lend to visitors', 'Leave at desk'],
            correctAnswer: 0,
            explanation: 'Access badges are personal and must not be shared.',
            isMandatory: false
          },
          {
            question: 'How should visitors be handled?',
            options: ['Escorted and monitored', 'Free access', 'Given employee badges', 'Ignored'],
            correctAnswer: 0,
            explanation: 'Visitors require escorting to prevent unauthorized access.',
            isMandatory: false
          },
          {
            question: 'What if you find an unlocked secured area?',
            options: ['Report to security immediately', 'Lock it yourself', 'Ignore it', 'Use the opportunity'],
            correctAnswer: 0,
            explanation: 'Security breaches must be reported for investigation.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Disposal Policy',
        description: 'Learn proper methods for disposing of sensitive information.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/disposal.png',
        badgeName: 'Disposal Specialist',
        badgeDescription: 'Completed Secure Disposal Training',
        questions: [
          {
            question: 'Why is secure disposal important?',
            options: ['Prevents data recovery by unauthorized parties', 'Recycles paper', 'Saves space', 'Reduces clutter'],
            correctAnswer: 0,
            explanation: 'Improper disposal can lead to data breaches.',
            isMandatory: true
          },
          {
            question: 'How should confidential paper be disposed?',
            options: ['Shredded with cross-cut shredder', 'Regular trash', 'Recycling bin', 'Torn by hand'],
            correctAnswer: 0,
            explanation: 'Cross-cut shredding makes document reconstruction impossible.',
            isMandatory: false
          },
          {
            question: 'How to dispose of old hard drives?',
            options: ['Degaussing, physical destruction, or certified wiping', 'Regular trash', 'Format and donate', 'Sell online'],
            correctAnswer: 0,
            explanation: 'Hard drives require certified data destruction methods.',
            isMandatory: false
          },
          {
            question: 'Can USB drives be reused after deleting files?',
            options: ['No, must be securely wiped or destroyed', 'Yes, always safe', 'Yes, if formatted', 'Yes, if files deleted'],
            correctAnswer: 0,
            explanation: 'Deleted files can be recovered without secure wiping.',
            isMandatory: false
          },
          {
            question: 'What about expired ID badges?',
            options: ['Return to security for destruction', 'Keep as souvenir', 'Regular trash', 'Give to others'],
            correctAnswer: 0,
            explanation: 'Old badges could be misused for unauthorized access.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Preventive Maintenance',
        description: 'Understand the importance of system maintenance for security.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/maintenance.png',
        badgeName: 'Maintenance Pro',
        badgeDescription: 'Completed Preventive Maintenance Training',
        questions: [
          {
            question: 'Why is preventive maintenance important for security?',
            options: ['Prevents failures that cause vulnerabilities', 'Keeps equipment clean', 'Saves money', 'Follows schedule'],
            correctAnswer: 0,
            explanation: 'Well-maintained systems are more secure and reliable.',
            isMandatory: true
          },
          {
            question: 'What is patch management?',
            options: ['Installing security updates', 'Fixing hardware', 'Cleaning computers', 'Replacing parts'],
            correctAnswer: 0,
            explanation: 'Patches fix security vulnerabilities in software.',
            isMandatory: false
          },
          {
            question: 'How often should systems be updated?',
            options: ['Regularly per policy', 'Never', 'Only when broken', 'Only annually'],
            correctAnswer: 0,
            explanation: 'Regular updates protect against known vulnerabilities.',
            isMandatory: false
          },
          {
            question: 'Should you delay security patches?',
            options: ['No, install promptly after testing', 'Yes, indefinitely', 'Yes, if inconvenient', 'Only for old systems'],
            correctAnswer: 0,
            explanation: 'Delays leave systems vulnerable to known exploits.',
            isMandatory: false
          },
          {
            question: 'What is vulnerability scanning?',
            options: ['Identifying security weaknesses', 'Antivirus scan', 'Disk cleanup', 'Speed test'],
            correctAnswer: 0,
            explanation: 'Scanning proactively identifies security issues.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Backup Policy',
        description: 'Learn about data backup and recovery procedures.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/backup.png',
        badgeName: 'Backup Master',
        badgeDescription: 'Mastered Backup Policy',
        questions: [
          {
            question: 'Why are backups critical?',
            options: ['Enable recovery from data loss', 'Use extra space', 'Slow systems', 'Create copies'],
            correctAnswer: 0,
            explanation: 'Backups protect against data loss from various causes.',
            isMandatory: true
          },
          {
            question: 'What is the 3-2-1 backup rule?',
            options: ['3 copies, 2 media types, 1 offsite', '3 backups daily, 2 weekly, 1 monthly', '3 servers, 2 locations, 1 admin', '3 files, 2 folders, 1 drive'],
            correctAnswer: 0,
            explanation: '3-2-1 rule ensures backup redundancy and availability.',
            isMandatory: false
          },
          {
            question: 'How often should critical data be backed up?',
            options: ['Daily or more frequently', 'Monthly', 'Yearly', 'Never'],
            correctAnswer: 0,
            explanation: 'Critical data requires frequent backups to minimize loss.',
            isMandatory: false
          },
          {
            question: 'Should backups be tested?',
            options: ['Yes, regularly verify restoration', 'No, assume they work', 'Only once at setup', 'Only after disasters'],
            correctAnswer: 0,
            explanation: 'Untested backups may fail when needed.',
            isMandatory: false
          },
          {
            question: 'Where should backup media be stored?',
            options: ['Secure offsite location', 'Next to computer', 'In same building', 'Public cloud only'],
            correctAnswer: 0,
            explanation: 'Offsite storage protects against site-wide disasters.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Software Regulation Policy',
        description: 'Understand software licensing and authorized usage.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/software-regulation.png',
        badgeName: 'Software Compliance Pro',
        badgeDescription: 'Mastered Software Regulation',
        questions: [
          {
            question: 'Why must software be approved before installation?',
            options: ['Ensure security, licensing, and compatibility', 'Waste time', 'Limit productivity', 'Control employees'],
            correctAnswer: 0,
            explanation: 'Unapproved software poses security and legal risks.',
            isMandatory: true
          },
          {
            question: 'Is pirated software allowed?',
            options: ['No, illegal and security risk', 'Yes, if free', 'Yes, if needed', 'Only at home'],
            correctAnswer: 0,
            explanation: 'Pirated software is illegal and often contains malware.',
            isMandatory: false
          },
          {
            question: 'What is software licensing?',
            options: ['Legal agreement for software use', 'Software installation', 'User manual', 'Security feature'],
            correctAnswer: 0,
            explanation: 'Licenses define legal terms for software usage.',
            isMandatory: false
          },
          {
            question: 'Can you share licensed software with others?',
            options: ['No, violates license terms', 'Yes, within company', 'Yes, if installed once', 'Only with friends'],
            correctAnswer: 0,
            explanation: 'Each user/device typically requires separate license.',
            isMandatory: false
          },
          {
            question: 'What is open source software?',
            options: ['Software with publicly available code', 'Free trial software', 'Shareware', 'Unfinished software'],
            correctAnswer: 0,
            explanation: 'Open source allows code inspection and modification.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Time Synchronization',
        description: 'Learn the importance of accurate time across systems.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/time sync.png',
        badgeName: 'Time Sync Badge',
        badgeDescription: 'Mastered Time Synchronization',
        questions: [
          {
            question: 'Why is time synchronization critical?',
            options: ['For logging, troubleshooting, and compliance', 'Show correct time', 'Aesthetic purposes', 'Schedule breaks'],
            correctAnswer: 0,
            explanation: 'Accurate time is essential for security event correlation.',
            isMandatory: true
          },
          {
            question: 'What does NTP stand for?',
            options: ['Network Time Protocol', 'New Technology Process', 'Network Transfer Protocol', 'Node Timing Procedure'],
            correctAnswer: 0,
            explanation: 'NTP synchronizes computer clocks over networks.',
            isMandatory: false
          },
          {
            question: 'What happens with unsynchronized clocks?',
            options: ['Difficult to correlate security events', 'Computers crash', 'Internet stops', 'Emails delete'],
            correctAnswer: 0,
            explanation: 'Time discrepancies hinder incident investigation.',
            isMandatory: false
          },
          {
            question: 'What is stratum in NTP?',
            options: ['Level in time source hierarchy', 'Server type', 'Security protocol', 'Time zone'],
            correctAnswer: 0,
            explanation: 'Stratum indicates distance from reference clock.',
            isMandatory: false
          },
          {
            question: 'How does time sync support security?',
            options: ['Enables accurate audit trails', 'Encrypts data', 'Blocks access', 'Scans viruses'],
            correctAnswer: 0,
            explanation: 'Accurate timestamps are crucial for forensics and compliance.',
            isMandatory: false
          }
        ],
        isActive: true
      },
      {
        title: 'Username & Password Management',
        description: 'Learn best practices for credential management.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/password.png',
        badgeName: 'Password Security Expert',
        badgeDescription: 'Mastered Password Management',
        questions: [
          {
            question: 'What makes a strong password?',
            options: ['Long, complex, unique', 'Short and simple', 'Name and birthdate', 'Same everywhere'],
            correctAnswer: 0,
            explanation: 'Strong passwords are at least 12 characters with mixed character types.',
            isMandatory: true
          },
          {
            question: 'Should you reuse passwords?',
            options: ['No, use unique password for each system', 'Yes, easier to remember', 'Yes, if complex', 'Only for unimportant sites'],
            correctAnswer: 0,
            explanation: 'Password reuse allows compromise to spread across accounts.',
            isMandatory: false
          },
          {
            question: 'What is a password manager?',
            options: ['Tool to securely store passwords', 'Password reset feature', 'IT helpdesk', 'Security policy'],
            correctAnswer: 0,
            explanation: 'Password managers encrypt and manage credentials securely.',
            isMandatory: false
          },
          {
            question: 'How often should passwords be changed?',
            options: ['When compromised or per policy', 'Daily', 'Never', 'Only at year end'],
            correctAnswer: 0,
            explanation: 'Regular changes without cause may weaken security through predictable patterns.',
            isMandatory: false
          },
          {
            question: 'What is multi-factor authentication?',
            options: ['Multiple verification methods', 'Complex password', 'Multiple passwords', 'Backup password'],
            correctAnswer: 0,
            explanation: 'MFA requires something you know, have, and/or are.',
            isMandatory: false
          }
        ],
        isActive: true
      }
    ];

    const createdTopics = await Topic.insertMany(topics);

    // Check/Create Users
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@imsarcade.com',
        password: 'admin123',
        role: 'admin',
        isApproved: true
      });
    }

    const employeeExists = await User.findOne({ username: 'employee' });
    if (!employeeExists) {
      await User.create({
        username: 'employee',
        email: 'employee@imsarcade.com',
        password: 'employee123',
        role: 'employee',
        isApproved: true
      });
      console.log('Employee user created');
    } else if (!employeeExists.isApproved) {
      employeeExists.isApproved = true;
      await employeeExists.save();
      console.log('Employee user approved');
    }

    
    process.exit(0);
  } catch (error) {
    console.error('SEED ERROR:', error);
    process.exit(1);
  }
};

seedData();