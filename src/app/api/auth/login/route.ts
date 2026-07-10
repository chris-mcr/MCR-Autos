import { NextRequest, NextResponse } from "next/server";

// In-memory demo customer accounts
 const users: Record<
  string,
  { id: string; name: string; email: string; password: string }
> = {
  "chris@mcrautos.com": {
    id: "user-1",
    name: "Chris",
    email: "chris@mcrautos.com",
    password: "password123",
  },
  "alice.johnson@mcrautos.com": {
    id: "user-2",
    name: "Alice",
    email: "alice.johnson@mcrautos.com",
    password: "SecurePass#1",
  },
  "bob.smith@mcrautos.com": {
    id: "user-3",
    name: "Bob",
    email: "bob.smith@mcrautos.com",
    password: "BobPass$2024",
  },
  "carol.williams@mcrautos.com": {
    id: "user-4",
    name: "Carol",
    email: "carol.williams@mcrautos.com",
    password: "CarolKey@123",
  },
  "david.brown@mcrautos.com": {
    id: "user-5",
    name: "David",
    email: "david.brown@mcrautos.com",
    password: "DavidPwd#99",
  },
  "emma.davis@mcrautos.com": {
    id: "user-6",
    name: "Emma",
    email: "emma.davis@mcrautos.com",
    password: "EmmaSecure$1",
  },
  "frank.miller@mcrautos.com": {
    id: "user-7",
    name: "Frank",
    email: "frank.miller@mcrautos.com",
    password: "FrankCode@456",
  },
  "grace.wilson@mcrautos.com": {
    id: "user-8",
    name: "Grace",
    email: "grace.wilson@mcrautos.com",
    password: "GracePass#2024",
  },
  "henry.moore@mcrautos.com": {
    id: "user-9",
    name: "Henry",
    email: "henry.moore@mcrautos.com",
    password: "HenryKey@789",
  },
  "isabella.taylor@mcrautos.com": {
    id: "user-10",
    name: "Isabella",
    email: "isabella.taylor@mcrautos.com",
    password: "IsabellaAuth#1",
  },
  "james.anderson@mcrautos.com": {
    id: "user-11",
    name: "James",
    email: "james.anderson@mcrautos.com",
    password: "JamesKey@2024",
  },
  "katherine.thomas@mcrautos.com": {
    id: "user-12",
    name: "Katherine",
    email: "katherine.thomas@mcrautos.com",
    password: "KatherinePass#99",
  },
  "liam.jackson@mcrautos.com": {
    id: "user-13",
    name: "Liam",
    email: "liam.jackson@mcrautos.com",
    password: "LiamCode$123",
  },
  "mia.white@mcrautos.com": {
    id: "user-14",
    name: "Mia",
    email: "mia.white@mcrautos.com",
    password: "MiaSecure@456",
  },
  "noah.harris@mcrautos.com": {
    id: "user-15",
    name: "Noah",
    email: "noah.harris@mcrautos.com",
    password: "NoahPwd#789",
  },
  "olivia.martin@mcrautos.com": {
    id: "user-16",
    name: "Olivia",
    email: "olivia.martin@mcrautos.com",
    password: "OliviaKey@2024",
  },
  "parker.thompson@mcrautos.com": {
    id: "user-17",
    name: "Parker",
    email: "parker.thompson@mcrautos.com",
    password: "ParkerAuth#55",
  },
  "quinn.garcia@mcrautos.com": {
    id: "user-18",
    name: "Quinn",
    email: "quinn.garcia@mcrautos.com",
    password: "QuinnPass$2024",
  },
  "rachel.martinez@mcrautos.com": {
    id: "user-19",
    name: "Rachel",
    email: "rachel.martinez@mcrautos.com",
    password: "RachelCode@111",
  },
  "samuel.robinson@mcrautos.com": {
    id: "user-20",
    name: "Samuel",
    email: "samuel.robinson@mcrautos.com",
    password: "SamuelKey#2024",
  },
  "teresa.clark@mcrautos.com": {
    id: "user-21",
    name: "Teresa",
    email: "teresa.clark@mcrautos.com",
    password: "TeresaPass@777",
  },
  "underwood.rodriguez@mcrautos.com": {
    id: "user-22",
    name: "Underwood",
    email: "underwood.rodriguez@mcrautos.com",
    password: "UnderCode$999",
  },
  "victoria.lewis@mcrautos.com": {
    id: "user-23",
    name: "Victoria",
    email: "victoria.lewis@mcrautos.com",
    password: "VictoriaAuth#88",
  },
  "william.walker@mcrautos.com": {
    id: "user-24",
    name: "William",
    email: "william.walker@mcrautos.com",
    password: "WilliamKey@333",
  },
  "xavier.hall@mcrautos.com": {
    id: "user-25",
    name: "Xavier",
    email: "xavier.hall@mcrautos.com",
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
