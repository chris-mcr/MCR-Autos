import { NextRequest, NextResponse } from "next/server";

// In-memory demo customer accounts
 const users: Record<
  string,
  { id: string; name: string; email: string; password: string }
> = {
  "chris@torqueautoparts.com": {
    id: "user-1",
    name: "Chris",
    email: "chris@torqueautoparts.com",
    password: "Torque@2024",
  },
  "alice.johnson@torqueautoparts.com": {
    id: "user-2",
    name: "Alice",
    email: "alice.johnson@torqueautoparts.com",
    password: "SecurePass#1",
  },
  "bob.smith@torqueautoparts.com": {
    id: "user-3",
    name: "Bob",
    email: "bob.smith@torqueautoparts.com",
    password: "BobPass$2024",
  },
  "carol.williams@torqueautoparts.com": {
    id: "user-4",
    name: "Carol",
    email: "carol.williams@torqueautoparts.com",
    password: "CarolKey@123",
  },
  "david.brown@torqueautoparts.com": {
    id: "user-5",
    name: "David",
    email: "david.brown@torqueautoparts.com",
    password: "DavidPwd#99",
  },
  "emma.davis@torqueautoparts.com": {
    id: "user-6",
    name: "Emma",
    email: "emma.davis@torqueautoparts.com",
    password: "EmmaSecure$1",
  },
  "frank.miller@torqueautoparts.com": {
    id: "user-7",
    name: "Frank",
    email: "frank.miller@torqueautoparts.com",
    password: "FrankCode@456",
  },
  "grace.wilson@torqueautoparts.com": {
    id: "user-8",
    name: "Grace",
    email: "grace.wilson@torqueautoparts.com",
    password: "GracePass#2024",
  },
  "henry.moore@torqueautoparts.com": {
    id: "user-9",
    name: "Henry",
    email: "henry.moore@torqueautoparts.com",
    password: "HenryKey@789",
  },
  "isabella.taylor@torqueautoparts.com": {
    id: "user-10",
    name: "Isabella",
    email: "isabella.taylor@torqueautoparts.com",
    password: "IsabellaAuth#1",
  },
  "james.anderson@torqueautoparts.com": {
    id: "user-11",
    name: "James",
    email: "james.anderson@torqueautoparts.com",
    password: "JamesKey@2024",
  },
  "katherine.thomas@torqueautoparts.com": {
    id: "user-12",
    name: "Katherine",
    email: "katherine.thomas@torqueautoparts.com",
    password: "KatherinePass#99",
  },
  "liam.jackson@torqueautoparts.com": {
    id: "user-13",
    name: "Liam",
    email: "liam.jackson@torqueautoparts.com",
    password: "LiamCode$123",
  },
  "mia.white@torqueautoparts.com": {
    id: "user-14",
    name: "Mia",
    email: "mia.white@torqueautoparts.com",
    password: "MiaSecure@456",
  },
  "noah.harris@torqueautoparts.com": {
    id: "user-15",
    name: "Noah",
    email: "noah.harris@torqueautoparts.com",
    password: "NoahPwd#789",
  },
  "olivia.martin@torqueautoparts.com": {
    id: "user-16",
    name: "Olivia",
    email: "olivia.martin@torqueautoparts.com",
    password: "OliviaKey@2024",
  },
  "parker.thompson@torqueautoparts.com": {
    id: "user-17",
    name: "Parker",
    email: "parker.thompson@torqueautoparts.com",
    password: "ParkerAuth#55",
  },
  "quinn.garcia@torqueautoparts.com": {
    id: "user-18",
    name: "Quinn",
    email: "quinn.garcia@torqueautoparts.com",
    password: "QuinnPass$2024",
  },
  "rachel.martinez@torqueautoparts.com": {
    id: "user-19",
    name: "Rachel",
    email: "rachel.martinez@torqueautoparts.com",
    password: "RachelCode@111",
  },
  "samuel.robinson@torqueautoparts.com": {
    id: "user-20",
    name: "Samuel",
    email: "samuel.robinson@torqueautoparts.com",
    password: "SamuelKey#2024",
  },
  "teresa.clark@torqueautoparts.com": {
    id: "user-21",
    name: "Teresa",
    email: "teresa.clark@torqueautoparts.com",
    password: "TeresaPass@777",
  },
  "underwood.rodriguez@torqueautoparts.com": {
    id: "user-22",
    name: "Underwood",
    email: "underwood.rodriguez@torqueautoparts.com",
    password: "UnderCode$999",
  },
  "victoria.lewis@torqueautoparts.com": {
    id: "user-23",
    name: "Victoria",
    email: "victoria.lewis@torqueautoparts.com",
    password: "VictoriaAuth#88",
  },
  "william.walker@torqueautoparts.com": {
    id: "user-24",
    name: "William",
    email: "william.walker@torqueautoparts.com",
    password: "WilliamKey@333",
  },
  "xavier.hall@torqueautoparts.com": {
    id: "user-25",
    name: "Xavier",
    email: "xavier.hall@torqueautoparts.com",
    password: "XavierPass#444",
  },
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Convert email to lowercase for case-insensitive lookup
    const lowerEmail = email.toLowerCase();

    // Check user credentials
    const user = users[lowerEmail];
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Return user and token
    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token: "mock-jwt-token",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
