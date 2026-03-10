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

    // Create Topics
    const topics = [
      // TOPIC 1: ISO 9001
      {
        title: 'ISO 9001: Quality Management System',
        description: 'Understand the fundamentals of ISO 9001 and how it helps organizations ensure consistent quality in products and services.',
        documentUrl: 'https://docs.google.com/document/d/1h3TJxsEJE7YhuGij7w_l_xYsAaT1PBypibC2e9nFhwg/edit?usp=sharing',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/iso9001.png',
        badgeName: 'Quality Management Expert',
        badgeDescription: 'Mastered ISO 9001 Quality Management System standards',
        questions: [
          {
            question: 'What is the primary focus of ISO 9001?',
            options: [
              'Quality management and customer satisfaction',
              'Environmental protection',
              'Information security',
              'Occupational health and safety'
            ],
            correctAnswer: 0,
            explanation: 'ISO 9001 focuses on quality management systems, helping organizations ensure they consistently meet customer requirements and enhance customer satisfaction through effective application of the system.',
            isMandatory: true
          },
          {
            question: 'What does PDCA stand for in the context of ISO 9001?',
            options: [
              'Plan-Do-Check-Act',
              'Prepare-Deploy-Control-Assess',
              'Process-Document-Certify-Audit',
              'Plan-Design-Create-Approve'
            ],
            correctAnswer: 0,
            explanation: 'PDCA (Plan-Do-Check-Act) is the continuous improvement cycle at the heart of ISO 9001, also known as the Deming Cycle.',
            isMandatory: false
          },
          {
            question: 'Which of the following is a key principle of ISO 9001?',
            options: [
              'Customer focus',
              'Profit maximization',
              'Market dominance',
              'Cost reduction only'
            ],
            correctAnswer: 0,
            explanation: 'Customer focus is one of the seven quality management principles of ISO 9001. Organizations depend on their customers and should understand current and future customer needs.',
            isMandatory: false
          },
          {
            question: 'What is the purpose of internal audits in ISO 9001?',
            options: [
              'To verify compliance and identify improvement opportunities',
              'To punish employees for mistakes',
              'To satisfy external auditors only',
              'To create additional paperwork'
            ],
            correctAnswer: 0,
            explanation: 'Internal audits are conducted to determine whether the quality management system conforms to requirements and is effectively implemented and maintained, while identifying opportunities for improvement.',
            isMandatory: false
          },
          {
            question: 'What does "continual improvement" mean in ISO 9001?',
            options: [
              'Ongoing efforts to enhance products, services, and processes',
              'One-time improvement projects',
              'Only fixing problems when they occur',
              'Making changes every year'
            ],
            correctAnswer: 0,
            explanation: 'Continual improvement is a recurring activity to enhance performance. It involves continuously reviewing and improving the QMS to achieve better outcomes.',
            isMandatory: false
          }
        ],
        isActive: true
      },

      // TOPIC 2: ISO 27001
      {
        title: 'ISO 27001: Information Security Management',
        description: 'Learn about ISO 27001 standards and how to protect sensitive information through comprehensive information security management systems.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/1YCSSdoBZeaBXdPF36QUdZJiu1d5lHJC0/view?usp=drive_link',
        badgeImage: '/uploads/badges/iso 27001.png',
        badgeName: 'Information Security Guardian',
        badgeDescription: 'Completed ISO 27001 Information Security Management training',
        questions: [
          {
            question: 'What is the main purpose of ISO 27001?',
            options: [
              'To establish, implement, and maintain an information security management system',
              'To improve product quality',
              'To manage environmental impacts',
              'To ensure workplace safety'
            ],
            correctAnswer: 0,
            explanation: 'ISO 27001 provides a framework for establishing, implementing, maintaining, and continually improving an Information Security Management System (ISMS) to protect sensitive information.',
            isMandatory: true
          },
          {
            question: 'What are the three pillars of information security in ISO 27001?',
            options: [
              'Confidentiality, Integrity, and Availability (CIA)',
              'Privacy, Security, and Safety',
              'Authentication, Authorization, and Accounting',
              'Prevention, Detection, and Response'
            ],
            correctAnswer: 0,
            explanation: 'The CIA triad - Confidentiality (preventing unauthorized disclosure), Integrity (ensuring accuracy and completeness), and Availability (ensuring authorized access when needed) - forms the foundation of information security.',
            isMandatory: false
          },
          {
            question: 'What is a risk assessment in the context of ISO 27001?',
            options: [
              'The process of identifying, analyzing, and evaluating information security risks',
              'A financial audit',
              'A customer satisfaction survey',
              'A performance review'
            ],
            correctAnswer: 0,
            explanation: 'Risk assessment is the process of identifying threats and vulnerabilities, analyzing their likelihood and impact, and evaluating the level of risk to determine appropriate security controls.',
            isMandatory: false
          },
          {
            question: 'What does "asset" mean in ISO 27001?',
            options: [
              'Anything of value to the organization that requires protection',
              'Only physical computer hardware',
              'Only software applications',
              'Only financial resources'
            ],
            correctAnswer: 0,
            explanation: 'An information asset is anything of value to the organization, including data, hardware, software, people, facilities, and services that requires protection from security threats.',
            isMandatory: false
          },
          {
            question: 'How often should an organization review its ISMS under ISO 27001?',
            options: [
              'At planned intervals through management reviews',
              'Only when a security incident occurs',
              'Once every five years',
              'Never, once established it remains static'
            ],
            correctAnswer: 0,
            explanation: 'ISO 27001 requires organizations to conduct management reviews at planned intervals to ensure the ISMS continues to be suitable, adequate, and effective.',
            isMandatory: false
          }
        ],
        isActive: true
      },

      // TOPIC 3: Quality and Information Security
      {
        title: 'Quality and Information Security Integration',
        description: 'Explore how quality management and information security work together to create robust organizational processes and protect critical assets.',
        documentUrl: 'https://drive.google.com/file/d/YOUR_DOCUMENT_ID/view',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/quality and information security.png',
        badgeName: 'Integrated Systems Master',
        badgeDescription: 'Mastered the integration of Quality and Information Security systems',
        questions: [
          {
            question: 'Why is it beneficial to integrate ISO 9001 and ISO 27001?',
            options: [
              'To streamline processes and reduce duplication of effort',
              'To make the system more complex',
              'To satisfy regulatory requirements only',
              'To create more documentation'
            ],
            correctAnswer: 0,
            explanation: 'Integrating ISO 9001 and ISO 27001 creates synergies, reduces duplication, improves efficiency, and provides a holistic approach to managing quality and information security.',
            isMandatory: true
          },
          {
            question: 'Which element is common to both ISO 9001 and ISO 27001?',
            options: [
              'Risk-based thinking and continual improvement',
              'Product manufacturing',
              'Environmental management',
              'Health and safety protocols'
            ],
            correctAnswer: 0,
            explanation: 'Both standards share common elements including risk-based thinking, continual improvement (PDCA cycle), management commitment, documented information, and internal audits.',
            isMandatory: false
          },
          {
            question: 'What is the relationship between data quality and information security?',
            options: [
              'Poor data quality can compromise security, and security breaches can affect data quality',
              'They are completely unrelated',
              'Data quality only matters for marketing',
              'Information security is only about passwords'
            ],
            correctAnswer: 0,
            explanation: 'Data quality and information security are interconnected. Poor data quality can lead to security vulnerabilities, while security breaches can corrupt or compromise data integrity.',
            isMandatory: false
          },
          {
            question: 'In an integrated management system, who is responsible for quality and security?',
            options: [
              'Everyone in the organization',
              'Only the IT department',
              'Only quality managers',
              'Only top management'
            ],
            correctAnswer: 0,
            explanation: 'Both quality and security are everyone\'s responsibility. While specific roles have defined accountabilities, all employees must contribute to maintaining quality standards and security practices.',
            isMandatory: false
          },
          {
            question: 'What is a key benefit of having documented procedures for both quality and security?',
            options: [
              'Consistency, traceability, and reduced errors',
              'More paperwork',
              'Slower processes',
              'Less flexibility'
            ],
            correctAnswer: 0,
            explanation: 'Documented procedures ensure consistency in execution, provide traceability for audits, reduce errors through standardization, and help with training and knowledge transfer.',
            isMandatory: false
          }
        ],
        isActive: true
      },

      // TOPIC 4: Internet Access Policy
      {
        title: 'Internet Acceptable Use',
        description: 'Understand organizational policies for internet usage, acceptable use guidelines, and best practices for secure and responsible internet access.',
        documentUrl: 'https://docs.google.com/document/d/1soaIX11RWkl0-4Q1zNJCtvNUfUNSnPyLEtufkApwd84/edit?usp=sharing',
        videoUrl: 'https://drive.google.com/file/d/YOUR_VIDEO_ID/preview',
        badgeImage: '/uploads/badges/internet acceptable use.png',
        badgeName: 'Cyber Policy Champion',
        badgeDescription: 'Completed Internet Access Policy training and compliance',
        questions: [
          {
            question: 'What is the primary purpose of an Internet Access Policy?',
            options: [
              'To define acceptable use and protect organizational resources',
              'To prevent employees from using the internet',
              'To monitor personal emails',
              'To block all social media sites'
            ],
            correctAnswer: 0,
            explanation: 'An Internet Access Policy establishes guidelines for acceptable use of internet resources, protects the organization from legal and security risks, and ensures productivity while enabling legitimate business activities.',
            isMandatory: true
          },
          {
            question: 'Which of the following is typically considered acceptable internet use at work?',
            options: [
              'Accessing work-related research and business applications',
              'Downloading pirated software',
              'Visiting gambling websites',
              'Sharing confidential company information on social media'
            ],
            correctAnswer: 0,
            explanation: 'Acceptable use includes accessing legitimate business resources, conducting work-related research, and using approved business applications. Illegal activities, gambling, and unauthorized disclosure of information are prohibited.',
            isMandatory: false
          },
          {
            question: 'Why should employees avoid clicking on suspicious links or attachments?',
            options: [
              'They may contain malware or lead to phishing sites',
              'It wastes bandwidth',
              'It makes the computer slower',
              'The company monitors all clicks'
            ],
            correctAnswer: 0,
            explanation: 'Suspicious links and attachments are common vectors for malware, ransomware, and phishing attacks that can compromise systems, steal credentials, or allow unauthorized access to organizational data.',
            isMandatory: false
          },
          {
            question: 'What should you do if you accidentally access an inappropriate or restricted website?',
            options: [
              'Close the site immediately and report it to IT/Security',
              'Continue browsing to see what it is',
              'Share it with colleagues',
              'Try to hide your browsing history'
            ],
            correctAnswer: 0,
            explanation: 'If you accidentally access inappropriate content, close it immediately and report it to IT or Security. Transparency helps protect you and the organization, while attempting to hide it may appear suspicious.',
            isMandatory: false
          },
          {
            question: 'Is it acceptable to use company internet for brief personal use during breaks?',
            options: [
              'Only if permitted by company policy and it does not interfere with work',
              'Yes, always, it is your right',
              'No, never under any circumstances',
              'Only if nobody finds out'
            ],
            correctAnswer: 0,
            explanation: 'Many organizations allow reasonable personal use during breaks, but this must align with company policy, not interfere with productivity, and comply with acceptable use guidelines. Always check your organization\'s specific policy.',
            isMandatory: false
          }
        ],
        isActive: true
      },

      // TOPIC 5: Time Synchronization
      {
        title: 'Time Synchronization and NTP',
        description: 'Learn the importance of accurate time synchronization across systems using Network Time Protocol (NTP) for security, compliance, and operational integrity.',
        documentUrl: 'https://docs.google.com/document/d/1h3TJxsEJE7YhuGij7w_l_xYsAaT1PBypibC2e9nFhwg/edit?usp=sharing',
        videoUrl: 'https://drive.google.com/file/d/1wtM-FnCx0PQuwk5rDoPC5Bbt-3uCB84x/view?usp=drive_link',
        badgeImage: '/uploads/badges/time sync.png',
        badgeName: 'Time Synchronization Specialist',
        badgeDescription: 'Mastered time synchronization principles and NTP protocols',
        questions: [
          {
            question: 'Why is accurate time synchronization critical in IT systems?',
            options: [
              'For security logging, troubleshooting, and regulatory compliance',
              'To show the correct time on computers',
              'For aesthetic purposes only',
              'To schedule employee breaks'
            ],
            correctAnswer: 0,
            explanation: 'Accurate time synchronization is essential for security event correlation, accurate logging for audits and forensics, troubleshooting distributed systems, compliance requirements, and ensuring proper function of time-sensitive protocols.',
            isMandatory: true
          },
          {
            question: 'What does NTP stand for?',
            options: [
              'Network Time Protocol',
              'New Technology Process',
              'Network Transfer Protocol',
              'Node Timing Procedure'
            ],
            correctAnswer: 0,
            explanation: 'NTP stands for Network Time Protocol, a networking protocol used to synchronize clocks of computer systems over packet-switched, variable-latency data networks.',
            isMandatory: false
          },
          {
            question: 'What could happen if system clocks are not synchronized in a network?',
            options: [
              'Difficulty correlating security events and inaccurate logs',
              'Computers will crash',
              'Internet will stop working',
              'Emails will be deleted'
            ],
            correctAnswer: 0,
            explanation: 'Unsynchronized clocks make it difficult to correlate security events across systems, can cause authentication failures, create inaccurate audit logs, affect distributed transactions, and complicate incident investigation.',
            isMandatory: false
          },
          {
            question: 'What is a stratum in NTP terminology?',
            options: [
              'A level in the hierarchy of time sources',
              'A type of server',
              'A security protocol',
              'A time zone'
            ],
            correctAnswer: 0,
            explanation: 'Stratum refers to the hierarchical level of a time source in NTP. Stratum 0 are reference clocks (atomic clocks, GPS), Stratum 1 servers sync directly from Stratum 0, Stratum 2 sync from Stratum 1, and so on.',
            isMandatory: false
          },
          {
            question: 'How does time synchronization support security and compliance?',
            options: [
              'By enabling accurate audit trails and event correlation',
              'By encrypting data',
              'By blocking unauthorized access',
              'By scanning for viruses'
            ],
            correctAnswer: 0,
            explanation: 'Accurate timestamps in logs are crucial for security investigations, regulatory compliance (like GDPR, PCI-DSS), forensic analysis, and creating reliable audit trails that can withstand legal scrutiny.',
            isMandatory: false
          }
        ],
        isActive: true
      }
    ];

    await Topic.insertMany(topics);

    // Check/Create Admin User
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

    // Check/Create Employee User
    const employeeExists = await User.findOne({ username: 'employee' });
    if (!employeeExists) {
      await User.create({
        username: 'employee',
        email: 'employee@imsarcade.com',
        password: 'employee123',
        role: 'employee',
        isApproved: true
      });
    } else if (!employeeExists.isApproved) {
      employeeExists.isApproved = true;
      await employeeExists.save();
    }
    
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
  }
};

seedData();