// ============================================================================
// SWISS PRIMARY SCHOOL GRADING SYSTEM - CORE CALCULATION LOGIC
// ============================================================================
// This module contains the mathematical models for converting raw test points
// into final grades, using different rounding strategies.
//
// Swiss grading system basics:
// - Grades range from 1.0 (worst) to 6.0 (best)
// - 4.0 is the passing grade  
// - Tests have Maximum Points (MP) and a Passing Points threshold (PPP)
// - Linear interpolation happens in two segments: 0→PPP and PPP→MP
// ============================================================================

// ----------------------------------------------------------------------------
// LINEAR INTERPOLATION HELPER
// ----------------------------------------------------------------------------
// Calculates a point on a line between two coordinates.
// Used for smooth grade progression from one point to another.
//
// Formula: y = y0 + (x - x0) * (y1 - y0) / (x1 - x0)
//
// Example: If 0 points = grade 1, and 12.5 points = grade 4
//          Then 6.25 points = linearInterpolate(6.25, 0, 1, 12.5, 4) = 2.5
// ----------------------------------------------------------------------------
function linearInterpolate(x, x0, y0, x1, y1) {
    // Prevent division by zero
    if (x1 - x0 === 0) {
        console.warn(\`[linearInterpolate] Division by zero! x0=\${x0}, x1=\${x1}. Returning y0=\${y0}\`);
        return y0;
    }
    const result = y0 + (x - x0) * (y1 - y0) / (x1 - x0);
    return result;
}

// ----------------------------------------------------------------------------
// MODEL 1: INCLUSIVE (NICE ROUNDING)
// ----------------------------------------------------------------------------
// Uses standard rounding (Math.round) - rounds to nearest value
// This is the "generous" model that benefits students on the edge
//
// Example: 4.25 rounds to 4.5, 4.74 rounds to 5.0
// ----------------------------------------------------------------------------
export const inclusiveModel = {
    name: "Inclusive",
    roundingMode: "nearest", // Round to nearest
    calculate: (points, mp, ppp) => {
        // Two-segment linear interpolation:
        // Segment 1: 0 points → grade 1, PPP points → grade 4
        if (points < ppp) {
            return linearInterpolate(points, 0, 1, ppp, 4);
        } 
        // Segment 2: PPP points → grade 4, MP points → grade 6
        else {
            return linearInterpolate(points, ppp, 4, mp, 6);
        }
    }
};

// ----------------------------------------------------------------------------
// MODEL 2: EXCLUSIVE (ABRUNDEN - ALWAYS ROUND DOWN)
// ----------------------------------------------------------------------------
// Uses floor rounding (Math.floor) - always rounds down
// This is the "demanding" model that requires students to clearly exceed thresholds
//
// Example: 4.25 rounds to 4.0, 4.74 rounds to 4.5
// 
// Note: Uses same linear calculation as Inclusive model, but different rounding
//       This is what makes it "demotivating" - you need more points for same grade
// ----------------------------------------------------------------------------
export const exclusiveModel = {
    name: "Exclusive (Abrunden)",
    roundingMode: "floor", // Always round down
    calculate: (points, mp, ppp) => {
        // Same linear calculation as Inclusive model
        if (points < ppp) {
            return linearInterpolate(points, 0, 1, ppp, 4);
        } else {
            return linearInterpolate(points, ppp, 4, mp, 6);
        }
    }
};

// ----------------------------------------------------------------------------
// MODEL 3: EQUAL WIDTH (HIDDEN)
// ----------------------------------------------------------------------------
// Ignores PPP entirely, divides the full range into 5 equal intervals
// Each grade occupies exactly 20% of the point range
// ----------------------------------------------------------------------------
export const equalWidthModel = {
    name: "Equal Width",
    roundingMode: "nearest",
    calculate: (points, mp, ppp) => {
        return 1 + 5 * (points / mp);
    }
};

// ----------------------------------------------------------------------------
// MODEL 4: COMPRESSED 6 (HIDDEN)
// ----------------------------------------------------------------------------
// Gives grade 6 a half-width interval, making it harder to achieve
// The range [0, mp] is divided into 5.5 intervals instead of 5
// ----------------------------------------------------------------------------
export const compressed6Model = {
    name: "Compressed 6",
    roundingMode: "nearest",
    calculate: (points, mp, ppp) => {
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

// Export only the two active models (3 & 4 are hidden but kept for reference)
export const models = [inclusiveModel, exclusiveModel];

// ----------------------------------------------------------------------------
// GRADE ROUNDING FUNCTION
// ----------------------------------------------------------------------------
// Rounds a grade to the nearest increment based on granularity and mode.
//
// Parameters:
//   - grade: The raw calculated grade (e.g., 4.37)
//   - granularity: Rounding increment (1=full, 0.5=half, 0.25=quarter, 0.1=tenth)
//   - roundingMode: "nearest" (standard) or "floor" (always round down)
//
// Examples:
//   roundGrade(4.37, 0.5, "nearest") → 4.5
//   roundGrade(4.37, 0.5, "floor")   → 4.0
// ----------------------------------------------------------------------------
export function roundGrade(grade, granularity, roundingMode = "nearest") {
    // "floor" mode: Always rounds down (more demanding, "Abrunden")
    // Example: 4.49 with granularity 0.5 → 4.0
    if (roundingMode === "floor") {
        return Math.floor(grade / granularity) * granularity;
    } else {
        // "nearest" mode: Standard rounding (more generous)
        // Example: 4.25 with granularity 0.5 → 4.5
        return Math.round(grade / granularity) * granularity;
    }
}

// ----------------------------------------------------------------------------
// FAIRNESS METRIC CALCULATION
// ----------------------------------------------------------------------------
// Calculates the average difference between rounded and linear grades.
// This metric reveals rounding bias:
//   - Positive value: System rounds up more (generous to students)
//   - Negative value: System rounds down more (demanding on students)
//   - Zero: Balanced rounding
//
// Example: If "Abrunden" always rounds down, fairness will be negative
//
// Parameters:
//   - gradesData: Array of objects with {points, linearGrade, roundedGrade}
//
// Returns: Average delta (Σ(rounded - linear) / count)
// ----------------------------------------------------------------------------
export function calculateFairness(gradesData) {
    // Sum all differences between rounded and linear grades
    const sum = gradesData.reduce((accumulator, dataPoint) => {
        return accumulator + (dataPoint.roundedGrade - dataPoint.linearGrade);
    }, 0);
    
    // Return average
    return sum / gradesData.length;
}
