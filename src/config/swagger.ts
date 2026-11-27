import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Job Tracker API",
    description: "API documentation for Job Tracker",
  },
  host: "localhost:5000",
  schemes: ["http"],
  basePath: "/api",

  tags: [
    {
      name: "Authentication",
      description: "User registration and login",
    },
    {
      name: "Applications",
      description: "Manage job applications",
    },
  ],

  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter: Bearer <your JWT token>",
    },
  },

  definitions: {
    UserApplicationUpdate: {
      jobType: "Full-time",
      company: "Google",
      position: "Backend Developer",
      description: "Backend development role",
    },

    AdminApplicationUpdate: {
      location: "Lagos",
      status: "applied",
    },
  },
};

const outputFile = "./swagger-output.json";

const endpointsFiles = [
  "./src/routes/authRoutes.ts",
  "./src/routes/applicationRoutes.ts",
];

swaggerAutogen()(outputFile, endpointsFiles, doc);
