  import "express-async-errors"; // 🔥 FIRST LINE
  import cookieParser from "cookie-parser";
  import express from "express";
  import cors from "cors";
  import routes from "./routes";
  // import authRoutes from "./routes/auth.routes.js";
  // import schoolRoutes from "./routes/school.routes.js";
  // import planRoutes from "./routes/plan.routes.js";
  import { errorHandler } from "./middlewares/error.middleware.js";


  // const app = express();

  // app.use(
  //   cors({
  //     origin: "http://localhost:3000", // frontend URL
  //     credentials: true,
  //   })
  // );

  // app.use(express.json());

  // app.get("/", (_req, res) => {
  //   res.send("Server is running 🚀");
  // });
  // app.use(cookieParser());   
  // // ✅ MOUNT ROUTES
  // // app.use("/api/auth", authRoutes);
  // // app.use("/api/school", schoolRoutes);
  // // app.use("/api/plans", planRoutes);
  // app.use("/api", routes);
  // app.use(errorHandler);
  // export default app;


  const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ✅ cookieParser FIRST
app.use(cookieParser());

// ✅ then body parser
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Server is running 🚀");
});

app.use("/api", routes);
app.use(errorHandler);

export default app;