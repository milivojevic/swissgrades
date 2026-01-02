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

export interface GridDimensions {
    width: number;
    height: number;
}

export interface GridSolution {
    dimensions: GridDimensions;
    squareCount: number;
}

/**
 * Count the total number of squares in an m×n grid
 * @param m - Grid height (rows)
 * @param n - Grid width (columns)
 * @returns Total number of squares of all sizes
 */
export function countSquares(m: number, n: number): number {
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
 * @param maxDimension - Maximum dimension to search (default: 100)
 * @returns Array of grid dimensions that contain exactly targetCount squares
 */
export function findGridsWithSquares(targetCount: number, maxDimension: number = 100): GridDimensions[] {
    const solutions: GridDimensions[] = [];
    
    // Search through all possible dimensions
    for (let m = 1; m <= maxDimension; m++) {
        for (let n = m; n <= maxDimension; n++) {
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
 * Get detailed breakdown of squares by size in a grid
 * @param m - Grid height
 * @param n - Grid width
 * @returns Object mapping square size to count
 */
export function getSquareBreakdown(m: number, n: number): Record<string, number> {
    const breakdown: Record<string, number> = {};
    const maxSize = Math.min(m, n);
    
    for (let k = 1; k <= maxSize; k++) {
        const count = (m - k + 1) * (n - k + 1);
        breakdown[`${k}×${k}`] = count;
    }
    
    return breakdown;
}
