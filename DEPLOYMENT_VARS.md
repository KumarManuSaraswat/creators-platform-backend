# Deployment Environment Variables

The following environment variables must be configured on the deployment platform (e.g., Vercel, Render, Heroku) for the production environment:

* `DATABASE_URL`: The MongoDB connection string for the production database (must include the `creator-platform-prod` database name and the `prod-admin` credentials).