import { connectDB } from "@/app/utils/database";
import { NextResponse } from "next/server";
import Attendance from "../../models/attendence";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("📝 Attendance POST request received");

    const body = await req.json();
    console.log("📝 Request body:", body);

    const { userName, userEmail, date, value } = body;

    // Validate required fields
    if (!userName || !userEmail || !date || !value) {
      console.error("❌ Missing required fields:", { userName, userEmail, date, value });
      return NextResponse.json({
        message: "Missing required fields: userName, userEmail, date, and value are required"
      }, { status: 400 });
    }

    // Validate value
    if (!['present', 'absent'].includes(value)) {
      console.error("❌ Invalid value:", value);
      return NextResponse.json({
        message: "Value must be either 'present' or 'absent'"
      }, { status: 400 });
    }

    console.log("📝 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected");

    // Parse the date properly
    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      console.error("❌ Invalid date format:", date);
      return NextResponse.json({
        message: "Invalid date format"
      }, { status: 400 });
    }

    console.log("📝 Checking for existing attendance...");
    // Check if attendance already exists for this user on this date
    const startOfDay = new Date(attendanceDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      userEmail,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (existingAttendance) {
      console.log("📝 Updating existing attendance...");
      // Update existing attendance
      existingAttendance.value = value;
      await existingAttendance.save();
      console.log("✅ Attendance updated successfully");

      return NextResponse.json({
        message: "Attendance updated successfully",
        attendance: existingAttendance
      }, { status: 200 });
    }

    console.log("📝 Creating new attendance record...");
    // Create new attendance record
    const newAttendance = new Attendance({
      userName,
      userEmail,
      date: attendanceDate,
      value,
    });

    await newAttendance.save();
    console.log("✅ New attendance record created successfully");

    return NextResponse.json({
      message: "Attendance recorded successfully",
      attendance: newAttendance
    }, { status: 201 });

  } catch (error: any) {
    console.error("❌ Error recording attendance:", error);
    console.error("❌ Error stack:", error.stack);

    return NextResponse.json({
      message: "Internal Server Error",
      error: error.message || "Unknown error occurred"
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const isAdmin = searchParams.get('isAdmin');

    let query: any = {};

    // If not admin, only show user's own attendance
    if (!isAdmin || isAdmin !== 'true') {
      if (!userEmail) {
        return NextResponse.json({ message: "User email is required" }, { status: 400 });
      }
      query.userEmail = userEmail;
    } else if (userEmail && userEmail !== 'all') {
      query.userEmail = userEmail;
    }

    // Add date range filter if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendanceRecords = await Attendance.find(query).sort({ date: -1 });

    return NextResponse.json({
      message: "Attendance records retrieved successfully",
      attendance: attendanceRecords
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
