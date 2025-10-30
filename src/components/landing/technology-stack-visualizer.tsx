import React from 'react';
import { motion } from 'framer-motion';

interface TechnologyCategory {
  name: string;
  color: string;
  technologies: {
    name: string;
    icon: string;
    description: string;
  }[];
}

const TechnologyStackVisualizer = (): JSX.Element => {
  const categories: TechnologyCategory[] = [
    {
      name: 'Frontend',
      color: 'bg-blue-500',
      technologies: [
        {
          name: 'React',
          icon: '⚛️',
          description: 'UI component library'
        },
        {
          name: 'TypeScript',
          icon: '🔷',
          description: 'Type-safe JavaScript'
        },
        {
          name: 'Tailwind CSS',
          icon: '🎨',
          description: 'Utility-first CSS framework'
        },
        {
          name: 'Framer Motion',
          icon: '✨',
          description: 'Animation library'
        },
        {
          name: 'Three.js',
          icon: '🌐',
          description: '3D visualization'
        }
      ]
    },
    {
      name: 'Backend',
      color: 'bg-green-500',
      technologies: [
        {
          name: 'Node.js',
          icon: '🟢',
          description: 'JavaScript runtime'
        },
        {
          name: 'Express',
          icon: '🚂',
          description: 'Web framework'
        },
        {
          name: 'NestJS',
          icon: '🐱',
          description: 'API framework'
        },
        {
          name: 'WebSocket',
          icon: '🔌',
          description: 'Real-time communication'
        }
      ]
    },
    {
      name: 'Database',
      color: 'bg-purple-500',
      technologies: [
        {
          name: 'PostgreSQL',
          icon: '🐘',
          description: 'Relational database'
        },
        {
          name: 'MongoDB',
          icon: '🍃',
          description: 'Document database'
        },
        {
          name: 'Redis',
          icon: '⚡',
          description: 'In-memory database'
        },
        {
          name: 'Neo4j',
          icon: '🔄',
          description: 'Graph database'
        }
      ]
    },
    {
      name: 'AI & ML',
      color: 'bg-red-500',
      technologies: [
        {
          name: 'TensorFlow',
          icon: '🧠',
          description: 'Machine learning framework'
        },
        {
          name: 'PyTorch',
          icon: '🔥',
          description: 'Deep learning framework'
        },
        {
          name: 'NLP Models',
          icon: '💬',
          description: 'Natural language processing'
        },
        {
          name: 'OpenAI',
          icon: '🤖',
          description: 'AI model integration'
        }
      ]
    },
    {
      name: 'DevOps',
      color: 'bg-yellow-500',
      technologies: [
        {
          name: 'Docker',
          icon: '🐳',
          description: 'Containerization'
        },
        {
          name: 'Kubernetes',
          icon: '☸️',
          description: 'Container orchestration'
        },
        {
          name: 'GitHub Actions',
          icon: '🔄',
          description: 'CI/CD automation'
        },
        {
          name: 'Vercel',
          icon: '▲',
          description: 'Deployment platform'
        }
      ]
    }
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center">
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="w-full md:w-1/2 lg:w-1/3 p-4"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
              <div className={`${category.color} p-4 text-white`}>
                <h3 className="text-xl font-bold">{category.name}</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-4">
                  {category.technologies.map((tech, techIndex) => (
                    <motion.li
                      key={tech.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: categoryIndex * 0.1 + techIndex * 0.05 }}
                      className="flex items-start"
                    >
                      <div className="mr-3 text-2xl">{tech.icon}</div>
                      <div>
                        <div className="font-semibold">{tech.name}</div>
                        <div className="text-sm text-gray-600">{tech.description}</div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TechnologyStackVisualizer;