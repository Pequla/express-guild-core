import { Response } from "express";

// Not found response
export function notFoundResponse(res: Response, msg = 'Not found') {
    res.status(404).json({
        message: msg,
        timestamp: new Date()
    });
}

// Handle exception
export async function responseHandler(res: Response, callback: Promise<any>) {
    try {
        res.json(await callback)
    } catch (e) {
        res.status(500).json({
            message: e.message,
            timestamp: new Date()
        });
    }
}

export function addHourToDate(date: Date) {
    date.setHours(date.getHours() + 1)
    return date;
}