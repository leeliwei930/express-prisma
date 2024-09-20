import express from "express";
import apiRoutes from "../routes/api";

const app = express();
app.use(express.json());

app.use("/api/v1", apiRoutes);

type StartParams = { address: string; port: number };

const start = function ({ address, port }: StartParams) {
  console.log(`⏳ Starting up server`);
  app.listen(port, address, () => {
    console.log(`🚀 Server listen on port http://${address}:${port}`);
  });
};

export default { start };
