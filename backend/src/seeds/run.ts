import 'reflect-metadata';
import { AppDataSource } from '../database';
import { User } from '../entity/User';
import { ResearchField } from '../entity/ResearchField';
import { ResearchSubfield } from '../entity/ResearchSubfield';
import { Dataset } from '../entity/Dataset';
import { hashPassword } from '../utils/password';
import { logger } from '../utils/logger';

async function seed() {
  try {
    logger.info('Initializing DataSource for seeding...');
    await AppDataSource.initialize();

    const userRepo = AppDataSource.getRepository(User);
    const fieldRepo = AppDataSource.getRepository(ResearchField);
    const subfieldRepo = AppDataSource.getRepository(ResearchSubfield);
    const datasetRepo = AppDataSource.getRepository(Dataset);

    // 1. Create Default Admin / Researcher User
    let admin = await userRepo.findOne({ where: { email: 'admin@research-os.dev' } });
    if (!admin) {
      const password_hash = await hashPassword('Admin123!');
      admin = userRepo.create({
        email: 'admin@research-os.dev',
        password_hash,
        full_name: 'Lead Researcher',
        institution: 'Research Discovery Lab',
        country: 'Global',
        role: 'ADMIN',
        research_interests: ['IoT Security', 'Anomaly Detection', 'RF Signals', 'Adversarial AI'],
      });
      await userRepo.save(admin);
      logger.info('Created default admin: admin@research-os.dev / Admin123!');
    }

    // 2. Seed 9 Top-Level Research Taxonomy Fields
    const taxonomy = [
      {
        name: 'Computer Science',
        slug: 'computer-science',
        color: '#3B82F6',
        icon: 'Cpu',
        description: 'Algorithms, data structures, distributed systems, and core computing foundations.',
        subfields: ['Artificial Intelligence', 'Systems Architecture', 'Theoretical Computer Science', 'Software Engineering'],
      },
      {
        name: 'Cybersecurity',
        slug: 'cybersecurity',
        color: '#EF4444',
        icon: 'Shield',
        description: 'Network security, hardware vulnerability, cryptography, malware analysis, and zero-trust.',
        subfields: ['IoT Security', 'Network Intrusion Detection', 'Adversarial Machine Learning', 'Applied Cryptography'],
      },
      {
        name: 'IoT & Embedded Systems',
        slug: 'iot-embedded-systems',
        color: '#10B981',
        icon: 'Radio',
        description: 'Smart devices, edge computing, sensor networks, microcontrollers, and IoT protocols.',
        subfields: ['Edge Intelligence', 'Sensor Telemetry', 'Microcontroller Security', 'Wireless Sensor Networks'],
      },
      {
        name: 'Signal & Information Processing',
        slug: 'signal-information-processing',
        color: '#8B5CF6',
        icon: 'Activity',
        description: 'Digital signal processing, time-series analysis, statistical inference, and wavelets.',
        subfields: ['Statistical Signal Processing', 'Time-Series Anomaly Detection', 'Acoustic & Audio Analysis', 'Wavelet Transforms'],
      },
      {
        name: 'Waves / Frequency / Electromagnetics',
        slug: 'waves-frequency-electromagnetics',
        color: '#F59E0B',
        icon: 'Wifi',
        description: 'RF fingerprinting, electromagnetic radiation, antenna theory, and spectrum sensing.',
        subfields: ['RF Fingerprinting', 'Physical Layer Security', 'Electromagnetic Side-Channel', 'Spectrum Sensing'],
      },
      {
        name: 'Physics + Computing',
        slug: 'physics-computing',
        color: '#6366F1',
        icon: 'Compass',
        description: 'Computational physics, geomagnetic sensing, quantum information, and numerical simulation.',
        subfields: ['Geomagnetic Sensing', 'Quantum Information', 'Computational Magnetism', 'Physical Simulation'],
      },
      {
        name: 'Mathematics for Research',
        slug: 'mathematics-for-research',
        color: '#EC4899',
        icon: 'Calculator',
        description: 'Linear algebra, optimization theory, graph theory, probability, and topological data analysis.',
        subfields: ['Non-Convex Optimization', 'Graph Theory', 'High-Dimensional Statistics', 'Information Theory'],
      },
      {
        name: 'Robotics & Autonomous Systems',
        slug: 'robotics-autonomous-systems',
        color: '#14B8A6',
        icon: 'Bot',
        description: 'Kinematics, SLAM, multi-agent control, perception, and reinforcement learning in robotics.',
        subfields: ['Autonomous Navigation', 'Multi-Agent Coordination', 'Sensor Fusion', 'Sim-to-Real Transfer'],
      },
      {
        name: 'Emerging / Interdisciplinary',
        slug: 'emerging-interdisciplinary',
        color: '#F97316',
        icon: 'Sparkles',
        description: 'Cross-cutting paradigms, neuromorphic computing, bio-inspired algorithms, and cyber-physical systems.',
        subfields: ['Neuromorphic Computing', 'Bio-Inspired AI', 'Cyber-Physical Systems', 'Quantum Machine Learning'],
      },
    ];

    for (const item of taxonomy) {
      let field = await fieldRepo.findOne({ where: { slug: item.slug } });
      if (!field) {
        field = fieldRepo.create({
          name: item.name,
          slug: item.slug,
          color: item.color,
          icon: item.icon,
          description: item.description,
          created_by: admin.id,
        });
        await fieldRepo.save(field);
        logger.info(`Seeded Field: ${item.name}`);
      }

      for (const subName of item.subfields) {
        const subSlug = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const existingSub = await subfieldRepo.findOne({ where: { field_id: field.id, slug: subSlug } });
        if (!existingSub) {
          const subfield = subfieldRepo.create({
            field_id: field.id,
            name: subName,
            slug: subSlug,
            created_by: admin.id,
          });
          await subfieldRepo.save(subfield);
        }
      }
    }

    // 3. Seed Benchmark Datasets
    const benchmarkDatasets = [
      {
        name: 'N-BaIoT',
        description: 'Network traffic anomaly detection dataset for identifying IoT botnet attacks from 9 commercial IoT devices.',
        domain: 'Cybersecurity / IoT',
        size_mb: 5400,
        num_samples: 7062604,
        num_features: 115,
        license: 'CC BY 4.0',
        source_url: 'https://archive.ics.uci.edu/dataset/442/n+baiot+dataset',
      },
      {
        name: 'IoTID20',
        description: 'IoT network intrusion detection dataset generated for novel smart home environments.',
        domain: 'Cybersecurity / IoT',
        size_mb: 1200,
        num_samples: 625783,
        num_features: 86,
        license: 'Open Access',
        source_url: 'https://sites.google.com/view/iot-network-intrusion-dataset/home',
      },
      {
        name: 'CICIoT2023',
        description: 'Large-scale real-world IoT attack dataset with 33 attack classes across 105 smart devices.',
        domain: 'Cybersecurity',
        size_mb: 18000,
        num_samples: 46686579,
        num_features: 46,
        license: 'Free for Research',
        source_url: 'https://www.unb.ca/cic/datasets/iot-dataset-2023.html',
      },
      {
        name: 'IoTGeM',
        description: 'Geomagnetic anomaly detection dataset for detecting physical tampering of IoT nodes.',
        domain: 'Physics / IoT',
        size_mb: 850,
        num_samples: 1250000,
        num_features: 32,
        license: 'MIT',
        source_url: 'https://github.com/research/iotgem',
      },
    ];

    for (const ds of benchmarkDatasets) {
      const existing = await datasetRepo.findOne({ where: { name: ds.name, user_id: admin.id } });
      if (!existing) {
        const dataset = datasetRepo.create({
          ...ds,
          user_id: admin.id,
        });
        await datasetRepo.save(dataset);
        logger.info(`Seeded Dataset: ${ds.name}`);
      }
    }

    logger.info('Database seeding completed successfully.');
    process.exit(0);
  } catch (error: any) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

seed();
