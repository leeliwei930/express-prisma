import express, { ErrorRequestHandler } from "express";
import apiRoutes from "../routes/api";

const app = express();

const exceptionHandler: ErrorRequestHandler = (err, _, res, __) => {
  console.error(err.stack);
  return res.status(500).json({ error: "Something broke!" });
};

app.use(express.json());

app.use("/api/v1", apiRoutes);
type StartParams = { address: string; port: number };

app.use(exceptionHandler);

const start = function ({ address, port }: StartParams) {
  console.log(`⏳ Starting up server`);
  app.listen(port, address, () => {
    console.log(`🚀 Server listen on port http://${address}:${port}`);
  });
};

export default { start };
