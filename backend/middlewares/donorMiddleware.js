import jwt from "jsonwebtoken";
import Donor from "../models/donorModel.js";

export const protectDonor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const donor = await Donor.findById(decoded.id).select("-password");

    if (!donor) {
      return res.status(401).json({ message: "Donor not found" });
    }

    req.donor = donor;

    next();
  } catch (error) {
    console.error("Donor auth error:", error);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
