import { App } from './src/app';

async function main(): Promise<App> {
  const app = new App();
  return app.run();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
