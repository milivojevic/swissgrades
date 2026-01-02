/**
 * Grid Squares Calculator
 *
 * Solves the problem: In which grids can we count exactly N squares?
 *
 * Mathematical Background:
 * In an m×n grid, the total number of squares is:
 * Σ(k=1 to min(m,n)) (m-k+1) × (n-k+1)
 *
 * Where k represents the size of the square (1×1, 2×2, 3×3, etc.)
 */
/**
 * Count the total number of squares in an m×n grid
 * @param m - Grid height (rows)
 * @param n - Grid width (columns)
 * @returns Total number of squares of all sizes
 */
export function countSquares(m, n) {
    if (m <= 0 || n <= 0) {
        return 0;
    }
    let total = 0;
    const maxSize = Math.min(m, n);
    // Count squares of each size
    for (let k = 1; k <= maxSize; k++) {
        total += (m - k + 1) * (n - k + 1);
    }
    return total;
}
/**
 * Find all grid dimensions that contain exactly the target number of squares
 * @param targetCount - The desired number of squares
 * @param maxDimension - Maximum dimension to search (default: targetCount, to include 1×n grids)
 * @returns Array of grid dimensions that contain exactly targetCount squares
 */
export function findGridsWithSquares(targetCount, maxDimension) {
    const solutions = [];
    // Default maxDimension to targetCount to ensure 1×n grids are included
    const searchLimit = maxDimension !== null && maxDimension !== void 0 ? maxDimension : targetCount;
    // Search through all possible dimensions
    for (let m = 1; m <= searchLimit; m++) {
        for (let n = m; n <= searchLimit; n++) {
            if (countSquares(m, n) === targetCount) {
                // Add both orientations (m×n and n×m)
                solutions.push({ width: n, height: m });
                if (m !== n) {
                    solutions.push({ width: m, height: n });
                }
            }
        }
    }
    return solutions;
}
/**
 * Find all factorizations of a number
 * @param n - The number to factorize
 * @returns Array of factor pairs {a, b} where a * b = n
 */
export function findFactorizations(n) {
    const factorizations = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            factorizations.push({ a: i, b: n / i });
        }
    }
    return factorizations;
}
export function analyzePerfectSquare(area) {
    const factorizations = findFactorizations(area);
    const analyses = [];
    for (const { a, b } of factorizations) {
        analyses.push({
            a,
            b,
            area,
            squareCount: countSquares(a, b)
        });
    }
    // Sort by square count descending
    analyses.sort((x, y) => y.squareCount - x.squareCount);
    return analyses;
}
/**
 * Get detailed breakdown of squares by size in a grid
 * @param m - Grid height
 * @param n - Grid width
 * @returns Object mapping square size to count
 */
export function getSquareBreakdown(m, n) {
    const breakdown = {};
    const maxSize = Math.min(m, n);
    for (let k = 1; k <= maxSize; k++) {
        const count = (m - k + 1) * (n - k + 1);
        breakdown[`${k}×${k}`] = count;
    }
    return breakdown;
}
