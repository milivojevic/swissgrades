// static/grading.ts

export interface GradingModel {
    name: string;
    calculate: (points: number, mp: number, ppp: number) => number;
}

// Shared linear interpolation function
function linearInterpolate(x: number, x0: number, y0: number, x1: number, y1: number): number {
    if (x1 - x0 === 0) {
        return y0;
    }
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
}

// 1. Inclusive Model
export const inclusiveModel: GradingModel = {
    name: "Inclusive",
    calculate: (points, mp, ppp) => {
        if (points < ppp) {
            return linearInterpolate(points, 0, 1, ppp, 4);
        } else {
            return linearInterpolate(points, ppp, 4, mp, 6);
        }
    }
};

// 2. Exclusive Model (Abrunden)
export const exclusiveModel: GradingModel = {
    name: "Exclusive (Abrunden)",
    calculate: (points, mp, ppp) => {
        // You must reach EXACT thresholds to achieve integer grades
        // This is the most demotivating model - always rounding down
        if (points < ppp) {
            // Below PPP: you can never reach grade 4
            // Scale from 1.0 at 0 points to 3.999... at just below PPP
            if (points === 0) return 1.0;
            return linearInterpolate(points, 0, 1, ppp - 0.0001, 3.9999);
        } else if (points === ppp) {
            // Exactly at PPP: you get exactly grade 4
            return 4.0;
        } else if (points < mp) {
            // Between PPP and MP: you can never reach grade 6
            // Scale from 4.0 at PPP to 5.999... at just below MP
            return linearInterpolate(points, ppp, 4, mp - 0.0001, 5.9999);
        } else {
            // Only at exactly MP do you get grade 6
            return 6.0;
        }
    }
};

// 3. Equal Width Model
export const equalWidthModel: GradingModel = {
    name: "Equal Width",
    calculate: (points, mp, ppp) => {
        const grade = 1 + 5 * (points / mp);
        return Math.min(6, grade);
    }
};

// 4. Compressed 6 Model
export const compressed6Model: GradingModel = {
    name: "Compressed 6",
    calculate: (points, mp, ppp) => {
        // This model gives grade 6 a half-width interval.
        // Let's define the point threshold for grade 6.
        // The range [0, mp] is divided into 5.5 intervals (1-2, 2-3, 3-4, 4-5, 5-6, 6)
        // Normal interval width
        const regularInterval = mp / 5.5;
        const grade5_5_points = mp - regularInterval / 2;

        if (points < ppp) {
            return linearInterpolate(points, 0, 1, ppp, 4);
        } else if (points < grade5_5_points) {
            return linearInterpolate(points, ppp, 4, grade5_5_points, 5.5);
        } else {
            return linearInterpolate(points, grade5_5_points, 5.5, mp, 6);
        }
    }
};

export const models: GradingModel[] = [inclusiveModel, exclusiveModel, equalWidthModel, compressed6Model];

export function roundGrade(grade: number, granularity: number): number {
    return Math.round(grade / granularity) * granularity;
}

export function calculateFairness(grades: { points: number, grade: number }[]): number {
    if (grades.length < 2) {
        return 100;
    }
    const mp = grades[grades.length - 1].points;
    const idealGrades = grades.map(g => 1 + 5 * (g.points / mp));
    
    const deviation = grades.reduce((sum, g, i) => {
        return sum + Math.abs(g.grade - idealGrades[i]);
    }, 0);

    const maxDeviation = grades.length * 5; // Max possible deviation
    return 100 * (1 - deviation / maxDeviation);
}
