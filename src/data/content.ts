export const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const

export const HERO = {
  greeting: "Hi, I'm Shayan.",
  subtext:
    'Software engineer crafting efficient, user-friendly applications that drive results.',
}

export const ABOUT = {
  headline: 'Robust software, thoughtfully built.',
  body: "As a dedicated software engineer, I've honed my expertise in a diverse set of programming languages and frameworks to deliver robust and scalable solutions. My passion lies in crafting efficient and user-friendly applications that drive results and enhance user experiences.",
}

export const CAPABILITIES = [
  {
    title: 'Frontend Development',
    description:
      'Interfaces built with React and TypeScript, designed to feel fast and stay maintainable.',
  },
  {
    title: 'Backend Development',
    description:
      'APIs and services on Node, engineered for reliability and seamless data interchange.',
  },
  {
    title: 'Automation',
    description:
      'Pipelines and tooling that remove repetitive work and keep deployments predictable.',
  },
  {
    title: 'SEO',
    description:
      'Performance and structure tuned so the work actually gets found.',
  },
] as const

export const EXPERIENCE = [
  {
    title: 'Senior Full-Stack Engineer',
    company: 'Incite AI',
    date: 'Dec 2024 - Present',
    points: [
      'Led front-end architecture and development for web and mobile platforms, building scalable UI components and delivering core user-facing features.',
      'Developed and launched a React Native mobile application, contributing to a 60% increase in active users.',
      'Optimized API integrations between React Native clients and Ruby on Rails backend services, improving latency, reliability, and data synchronization.',
      'Designed, built, and deployed full-stack features end-to-end across frontend and backend systems.',
      'Built multi-agent AI workflows using deterministic orchestration and LLM-based processing to automate complex tasks and improve product intelligence.',
      'Designed and implemented agentic pipelines for task routing, decision-making, and execution with a focus on scalability, maintainability, and production readiness.',
    ],
  },
  {
    title: 'Senior Full-Stack Engineer',
    company: 'Myna',
    date: 'Feb 2024 - Oct 2024',
    points: [
      'Engineered key features across the full stack, ensuring scalability and optimized performance.',
      'Designed and implemented GraphQL and Relay APIs, improving the efficiency of data queries and enhancing frontend-backend communication.',
      'Built robust, user-friendly interfaces with Next.js, driving an intuitive user experience while maintaining seamless integration with the blockchain.',
      'Led unit testing efforts, ensuring reliability and high code quality across all modules and features.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Gas POS',
    date: 'Sept 2023 - Feb 2024',
    points: [
      "Assumed ownership and led the strategic development of the company's web portal, implementing user-friendly design, robust functionality, and efficient security measures.",
      'Engineered validation and compression algorithms to enhance the efficiency and reliability of data processing within the enterprise software solution.',
      'Developed RESTful APIs using .NET and C#, enabling seamless data interchange between internal systems and third-party services.',
      'Managed, optimized, and monitored cloud computing resources on Azure to ensure high availability, scalability, and cost-efficiency.',
      'Created an AI-powered chatbot to alleviate customer-support backlogs, cutting support costs by 40% while improving response times.',
    ],
  },
  {
    title: 'React Engineer',
    company: "Bru'd Rewards",
    date: 'Feb 2021 - Mar 2023',
    points: [
      'Engineered an intuitive user-friendly interface for a rewards application tailored for small to medium-sized businesses.',
      'Seamlessly integrated multiple APIs, enhancing backend functionality and broadening application capabilities.',
      'Conducted thorough end-to-end quality assurance testing to ensure software reliability and performance.',
    ],
  },
] as const

/* Simple Icons CDN slugs; rendered single-color to match the palette. */
export const TECHNOLOGIES = [
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'Go', slug: 'go' },
  { name: 'Python', slug: 'python' },
  { name: 'React', slug: 'react' },
  { name: 'Next.js', slug: 'nextdotjs' },
  { name: 'Node.js', slug: 'nodedotjs' },
  { name: 'GraphQL', slug: 'graphql' },
  /* The dotnet glyph is already the ".NET" wordmark, so no text label. */
  { name: '.NET', slug: 'dotnet', iconOnly: true },
  { name: 'Django', slug: 'django' },
  { name: 'Tailwind CSS', slug: 'tailwindcss' },
  { name: 'RabbitMQ', slug: 'rabbitmq' },
  { name: 'PostgreSQL', slug: 'postgresql' },
  { name: 'MongoDB', slug: 'mongodb' },
  { name: 'Solidity', slug: 'solidity' },
  { name: 'Google Cloud', slug: 'googlecloud' },
] as const

export const CONTACT = {
  headline: 'Contact',
  body: 'Have a project in mind, a role to discuss, or just want to say hi? My inbox is always open.',
  email: 'valaieshayanse@gmail.com',
  /* Existing EmailJS integration, carried over from the current site. */
  emailjs: {
    serviceId: 'service_8ap6hya',
    templateId: 'template_2e65hhh',
    publicKey: '3Q63r0ES5OylojtvS',
  },
}
