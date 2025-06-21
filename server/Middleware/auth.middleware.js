import { clerkClient, getAuth } from "@clerk/express";
export const protectAdmin = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    console.log("Auth info:", auth); // ✅ LOG THIS

    if (!auth || !auth.userId) {
      return res
        .status(401)
        .json({ success: false, error: "No userId found in auth" });
    }

    const user = await clerkClient.users.getUser(auth.userId);
    console.log("User fetched from Clerk:", user.id); // ✅ LOG THIS

    if (user.privateMetadata.role !== "admin") {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error("protectAdmin error:", error); // ✅ LOG FULL ERROR
    return res.status(500).json({ success: false, error: error.message });
  }
};
