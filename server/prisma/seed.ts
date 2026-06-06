import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean database
  await prisma.userInterest.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.thread.deleteMany({});
  await prisma.opportunity.deleteMany({});
  await prisma.researchInterest.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Database cleaned.');

  // 2. Create Research Interests
  const interestsData = [
    'Generative AI & LLMs',
    'Quantum Computing',
    'Silicon Photonics',
    'Nanomaterials & Thin Films',
    'Cancer Immunotherapy',
    '5G/6G Wireless Networks',
    'VLSI System Design',
    'Reinforcement Learning',
    'Bioinformatics',
    'Structural Health Monitoring',
    'Blockchains & Smart Contracts'
  ];

  const interestsMap: Record<string, any> = {};
  for (const name of interestsData) {
    const interest = await prisma.researchInterest.create({
      data: { name }
    });
    interestsMap[name] = interest;
  }
  console.log(`✅ Created ${Object.keys(interestsMap).length} research interests.`);

  // 3. Create Users (Faculty & Scholars)
  const users = [
    {
      name: 'Dr. Anand Ramachandran',
      email: 'dr.anand@srmist.edu.in',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      role: Role.RESEARCH_SUPERVISOR,
      department: 'Computing Technologies (CSE / IT / Swe)',
      bio: 'Professor of Computer Science. Researching distributed systems, edge computing, and large language model optimizations for low-resource environments.',
      interests: ['Generative AI & LLMs', 'Reinforcement Learning', 'Blockchains & Smart Contracts']
    },
    {
      name: 'Dr. Priya Subramanian',
      email: 'dr.priya@srmist.edu.in',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: Role.RESEARCH_SUPERVISOR,
      department: 'Biotechnology & Bioengineering',
      bio: 'Associate Professor of Bioengineering. Focused on genomic sequencing algorithms, targeted drug delivery, and computational oncology.',
      interests: ['Cancer Immunotherapy', 'Bioinformatics', 'Nanomaterials & Thin Films']
    },
    {
      name: 'Dr. Ramesh Kumar',
      email: 'dr.ramesh@srmist.edu.in',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: Role.RESEARCH_SUPERVISOR,
      department: 'Electronics & Communication Engineering (ECE)',
      bio: 'Professor & Head of ECE Dept. Researching high-speed transceiver design, silicon-photonic modulators, and 6G cellular networks.',
      interests: ['Silicon Photonics', '5G/6G Wireless Networks', 'VLSI System Design']
    },
    {
      name: 'Suresh Karthik',
      email: 'scholar.suresh@srmist.edu.in',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      role: Role.RESEARCH_SCHOLAR,
      department: 'Computing Technologies (CSE / IT / Swe)',
      bio: 'PhD Candidate supervised by Dr. Anand. Working on parameter-efficient fine-tuning (PEFT) methods for vision-language models.',
      interests: ['Generative AI & LLMs', 'Reinforcement Learning']
    },
    {
      name: 'Divya Nambiar',
      email: 'scholar.divya@srmist.edu.in',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      role: Role.RESEARCH_SCHOLAR,
      department: 'Biotechnology & Bioengineering',
      bio: 'PhD Scholar researching nano-carriers in bioinformatics under Dr. Priya. Exploring molecular modeling using graph neural networks.',
      interests: ['Bioinformatics', 'Cancer Immunotherapy', 'Nanomaterials & Thin Films']
    }
  ];

  const createdUsers: Record<string, any> = {};
  for (const u of users) {
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        image: u.image,
        role: u.role,
        department: u.department,
        bio: u.bio,
        approved: u.role === Role.RESEARCH_SUPERVISOR ? true : false
      }
    });
    createdUsers[u.email] = user;

    // Link interests
    for (const interestName of u.interests) {
      const interest = interestsMap[interestName];
      if (interest) {
        await prisma.userInterest.create({
          data: {
            userId: user.id,
            interestId: interest.id
          }
        });
      }
    }
  }
  console.log(`✅ Created ${Object.keys(createdUsers).length} faculty/scholar profiles with interests.`);

  // 4. Create Threads
  const t1 = await prisma.thread.create({
    data: {
      title: 'Call for Collaboration: GPGPU Resource Sharing for LLM Fine-Tuning',
      content: `Hello Colleagues,

Our lab in the Computing Technologies department has recently set up a cluster of 4x NVIDIA H100 GPUs for fine-tuning custom models on institutional datasets. 

We are currently looking to collaborate with faculty members in the **Biotechnology & Bioengineering** department who need GPU cycles to accelerate protein fold sequencing or drug discovery workflows. 

If your PhD scholars have computationally demanding deep learning workloads (written in PyTorch or JAX), please reach out. We would love to co-author and share these resources to produce high-impact joint publications.

Best regards,
Dr. Anand Ramachandran`,
      authorId: createdUsers['dr.anand@srmist.edu.in'].id,
      tags: ['GPU Cluster', 'Generative AI & LLMs', 'Bioinformatics', 'Collaboration']
    }
  });

  const t2 = await prisma.thread.create({
    data: {
      title: 'Interdisciplinary Study on Silicon Photonics-based Genomic Sequencing Chips',
      content: `Hi everyone,

I am drafting a proposal for the upcoming **DST-SERB Core Research Grant** focusing on creating high-throughput genomic sequencing sensors integrated directly on-chip using silicon photonics.

This is a highly cross-disciplinary endeavor requiring:
1. **ECE experts** with experience in silicon waveguide fabrication and optical resonators (Dr. Ramesh's team).
2. **Biotech experts** with experience in bio-functionalizing chip surfaces to bind DNA molecules (my team).
3. **Computer Science experts** to design fast signal decoding algorithms directly running on raw optical sensor data.

We are holding an initial brainstorming session in the ECE Seminar Hall next Friday at 2:00 PM. Please reply to this thread if you are interested in joining the proposal!

Best,
Dr. Priya Subramanian`,
      authorId: createdUsers['dr.priya@srmist.edu.in'].id,
      tags: ['Silicon Photonics', 'Bioinformatics', 'Research Grant', 'DST-SERB']
    }
  });

  console.log('✅ Created research threads.');

  // 5. Create Comments
  await prisma.comment.create({
    data: {
      content: `This is incredibly timely, Dr. Priya! My PhD scholars have been exploring silicon-photonic ring modulators for optical communications, and adapting them to work as molecular refractive index sensors would be an amazing extension. Count us in!`,
      threadId: t2.id,
      authorId: createdUsers['dr.ramesh@srmist.edu.in'].id
    }
  });

  await prisma.comment.create({
    data: {
      content: `Dr. Anand, my PhD scholar Divya Nambiar is currently running molecular modeling using very heavy Graph Neural Networks. Our current local RTX 3090s are taking weeks to complete the epochs. Access to your H100 cluster would speed up her thesis work by at least 10x. We would be absolutely thrilled to collaborate!`,
      threadId: t1.id,
      authorId: createdUsers['dr.priya@srmist.edu.in'].id
    }
  });

  await prisma.comment.create({
    data: {
      content: `Thank you Dr. Priya! Yes, Divya is welcome to share our cluster. I have asked my PhD scholar Suresh to set up Docker containers and provision SSH keys for her. Let's schedule a Zoom call this Monday to align on the technical details.`,
      threadId: t1.id,
      authorId: createdUsers['dr.anand@srmist.edu.in'].id
    }
  });

  console.log('✅ Created comments.');

  // 6. Create Research Opportunities
  await prisma.opportunity.create({
    data: {
      title: 'PhD Position: Reinforcement Learning for Smart Grid Optimization',
      description: `We are seeking an outstanding PhD candidate to join the EEE department under the joint supervision of EEE and CSE faculty.

The project involves designing multi-agent reinforcement learning (MARL) algorithms to optimize energy distribution and load balancing in next-generation microgrids.

**Required Qualifications:**
- B.Tech/M.Tech in EEE, ECE, or CSE with a strong academic track record.
- Exceptional programming skills in Python (PyTorch or TensorFlow).
- Solid foundation in linear algebra, probability, and control systems.

**Funding:** Monthly stipend of ₹38,000 + HRA as per institutional norms for the first 2 years, upgradable to SRF in the 3rd year.`,
      department: 'Electrical & Electronics Engineering (EEE)',
      researchDomain: 'Reinforcement Learning',
      authorId: createdUsers['dr.anand@srmist.edu.in'].id
    }
  });

  await prisma.opportunity.create({
    data: {
      title: 'Research Assistant: 2D Nanomaterials for Energy Storage',
      description: `The Materials Science Lab is recruiting a full-time Research Assistant (RA) for a sponsored project on synthesizing transition metal dichalcogenide (TMD) thin films for supercapacitor electrodes.

**Key Responsibilities:**
- Physical vapor deposition (PVD) and chemical vapor deposition (CVD) synthesis of thin films.
- Characterization using XRD, SEM, and Raman spectroscopy.
- Electrochemical performance evaluation using cyclic voltammetry.

**Duration:** 12 Months (extendable based on performance and fund availability).
**Stipend:** ₹31,000 consolidated per month.`,
      department: 'Chemistry & Materials Science',
      researchDomain: 'Nanomaterials & Thin Films',
      authorId: createdUsers['dr.priya@srmist.edu.in'].id
    }
  });

  console.log('✅ Created research opportunities.');

  // 7. Create Events
  await prisma.event.deleteMany({});
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];

  await prisma.event.create({
    data: {
      title: 'PhD Viva Defense: GPGPU Virtualization & LLM Tuning',
      date: new Date(today),
      time: '10:00 AM',
      venue: 'ECE Seminar Hall (PG Block)',
      status: 'PUBLISHED', eventType: 'Seminar'
    }
  });

  await prisma.event.create({
    data: {
      title: 'Seminar: DNA-functionalized Silicon Photonics Ring Resonators',
      date: new Date(tomorrow),
      time: '02:30 PM',
      venue: 'Biotech Conference Room',
      status: 'PUBLISHED', eventType: 'Seminar'
    }
  });

  await prisma.event.create({
    data: {
      title: 'Workshop: DST-SERB Proposal Drafting & Grant Compliance',
      date: new Date(dayAfter),
      time: '11:15 AM',
      venue: 'Main Auditorium (Administrative Block)',
      status: 'PUBLISHED', eventType: 'Seminar'
    }
  });

  console.log('✅ Created research events.');
  console.log('🌟 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
