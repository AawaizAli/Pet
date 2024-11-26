import { createClient } from "../../../db/index";
import { NextRequest, NextResponse } from "next/server";

// POST method to add vet schedules
export async function POST(req: NextRequest): Promise<NextResponse> {
    const schedules = await req.json(); // Expect an array of schedules
    const client = createClient();

    try {
        await client.connect(); // Connect to the database

        if (!Array.isArray(schedules) || schedules.length === 0) {
            return NextResponse.json(
                { error: "An array of schedules is required." },
                { status: 400 }
            );
        }

        for (const schedule of schedules) {
            const { vet_id, day_of_week, start_time, end_time } = schedule;

            if (!vet_id || !day_of_week || !start_time || !end_time) {
                return NextResponse.json(
                    {
                        error: "Each schedule must include vet_id, day_of_week, start_time, and end_time.",
                    },
                    { status: 400 }
                );
            }

            await client.query(
                `INSERT INTO vet_availability 
                    (vet_id, day_of_week, start_time, end_time) 
                 VALUES ($1, $2, $3, $4)`,
                [vet_id, day_of_week, start_time, end_time]
            );
        }

        return NextResponse.json(
            { message: "Schedules added successfully." },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Internal Server Error", message: (err as Error).message },
            { status: 500 }
        );
    } finally {
        await client.end(); // Always close the connection
    }
}

// GET method to fetch vet schedules
export async function GET(req: NextRequest): Promise<NextResponse> {
    const client = createClient();

    try {
        await client.connect(); // Connect to the database

        const result = await client.query(
            `SELECT 
                vet_availability.*, 
                vets.vet_name 
             FROM vet_availability
             JOIN vets ON vet_availability.vet_id = vets.vet_id
             ORDER BY vet_availability.vet_id, vet_availability.day_of_week`
        );

        return NextResponse.json(result.rows, {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Internal Server Error", message: (err as Error).message },
            { status: 500 }
        );
    } finally {
        await client.end(); // Always close the connection
    }
}