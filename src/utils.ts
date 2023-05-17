import { Request, Response } from "express";

// Not found response
export function notFoundResponse(res: Response, msg = 'Not found') {
    res.status(404).json({
        message: msg,
        timestamp: new Date()
    });
}

export function addHourToDate(date: Date) {
    date.setHours(date.getHours() + 1)
    return date;
}