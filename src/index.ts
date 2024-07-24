import fastifyInstance from "./server";

const start = async () => {
  try {
    await fastifyInstance.listen({ port: 8000 });
  } catch (err) {
    fastifyInstance.log.error(err);
    process.exit(1);
  }
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, async () => {
    await fastifyInstance.close();

    process.exit(0);
  });
});

start();
