import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./utils/dotenv.js";
import { connectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import doctorRoutes from "./routes/doctors.routes.js";
import slotRoutes from "./routes/slot.routes.js";
import patientRoutes from "./routes/patients.routes.js";
import appointmentRoutes from "./routes/appoinments.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import helmet from "helmet";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://adam-finastra-assesment.vercel.app/",
    /\.vercel\.app$/,
  ],
  credentials: true,
};

// Connect to MongoDB
connectDb();
// Middleware
app.use(cors(corsOptions));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/superadmin", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/audit", auditRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
