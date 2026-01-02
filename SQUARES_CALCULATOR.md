# Grid Squares Calculator

## Problem Statement

**In a 3×6 grid, there are 32 smaller or bigger squares in total.**

**In a 4×4 grid, there are 30 squares.**

**In which grids can we count 1365 squares?**

## Solution

The answer is: **1×1365, 1365×1, 9×33, 33×9, 13×19, and 19×13 grids**

## New Feature: Perfect Square Factorization Analysis

A visual analysis tool has been added at `/perfect-square-analysis.html` that explores how different grid configurations affect the number of identifiable squares for a given area.

**Key Insights:**
- For a 20×20 perfect square (400 unit squares), there are 8 different ways to arrange it as an a×b grid
- The square configuration (20×20) maximizes the number of identifiable squares (2870 squares)
- Long thin rectangles (like 1×400) have the minimum number of squares (400 squares)
- **Generic Formula for perfect squares:** S(n,n) = n(n+1)(2n+1)/6

This interactive tool includes:
- Visual bar chart comparing all factorizations
- Detailed table with efficiency percentages
- Generic mathematical formulas
- Mathematical insights on why square configurations are optimal

## Mathematical Formula

In an m×n grid, the total number of squares of all sizes is:

```
Total Squares = Σ(k=1 to min(m,n)) (m-k+1) × (n-k+1)
```

Where:
- `m` is the height of the grid (number of rows)
- `n` is the width of the grid (number of columns)
- `k` represents the size of the square (1×1, 2×2, 3×3, etc.)

### Explanation

For each square size `k`, we can calculate how many k×k squares fit in the grid:
- **1×1 squares**: `m × n` (every cell is a 1×1 square)
- **2×2 squares**: `(m-1) × (n-1)` 
- **3×3 squares**: `(m-2) × (n-2)`
- ...
- **k×k squares**: `(m-k+1) × (n-k+1)` where k ≤ min(m,n)

## Verification

### Example 1: 3×6 Grid
- 1×1 squares: (3-1+1) × (6-1+1) = 3 × 6 = 18
- 2×2 squares: (3-2+1) × (6-2+1) = 2 × 5 = 10
- 3×3 squares: (3-3+1) × (6-3+1) = 1 × 4 = 4
- **Total: 18 + 10 + 4 = 32 ✓**

### Example 2: 4×4 Grid
- 1×1 squares: 4 × 4 = 16
- 2×2 squares: 3 × 3 = 9
- 3×3 squares: 2 × 2 = 4
- 4×4 squares: 1 × 1 = 1
- **Total: 16 + 9 + 4 + 1 = 30 ✓**

### Solution: Grids with 1365 Squares

#### 9×33 Grid (or 33×9)
- 1×1: 9 × 33 = 297
- 2×2: 8 × 32 = 256
- 3×3: 7 × 31 = 217
- 4×4: 6 × 30 = 180
- 5×5: 5 × 29 = 145
- 6×6: 4 × 28 = 112
- 7×7: 3 × 27 = 81
- 8×8: 2 × 26 = 52
- 9×9: 1 × 25 = 25
- **Total: 1365 ✓**

#### 13×19 Grid (or 19×13)
- 1×1: 13 × 19 = 247
- 2×2: 12 × 18 = 216
- 3×3: 11 × 17 = 187
- 4×4: 10 × 16 = 160
- 5×5: 9 × 15 = 135
- 6×6: 8 × 14 = 112
- 7×7: 7 × 13 = 91
- 8×8: 6 × 12 = 72
- 9×9: 5 × 11 = 55
- 10×10: 4 × 10 = 40
- 11×11: 3 × 9 = 27
- 12×12: 2 × 8 = 16
- 13×13: 1 × 7 = 7
- **Total: 1365 ✓**

## Interactive Calculator

An interactive web-based calculator has been created at `/squares.html` that allows you to:
- Enter any target number of squares
- Find all grid dimensions (up to 100×100) that contain exactly that number of squares
- View detailed breakdowns showing how many squares of each size exist in the grid
- Verify the calculations

## Usage

### Access the Calculator

1. Start the development server:
   ```bash
   npm run start
   ```

2. Navigate to: `http://localhost:8787/squares.html`

3. Enter a target number of squares (e.g., 1365) and click "Calculate Grid Dimensions"

### Production Deployment

The calculator is deployed alongside the main Swiss Grading Visualizer application and can be accessed at:
```
https://swissgrades.cheddar.workers.dev/squares.html
```

## Implementation

### Files Created

1. **`static/squares.ts`** - TypeScript module with core calculation functions:
   - `countSquares(m, n)` - Count total squares in an m×n grid
   - `findGridsWithSquares(targetCount, maxDimension)` - Find all grids with exact square count
   - `getSquareBreakdown(m, n)` - Get detailed breakdown by square size

2. **`static/squares.js`** - Compiled JavaScript module (auto-generated from TypeScript)

3. **`static/squares.html`** - Interactive web interface with:
   - Problem statement display
   - Input form for target square count
   - Results display with all matching grid dimensions
   - Verification section showing square counts
   - Detailed breakdown table for the first solution

### API Reference

#### `countSquares(m: number, n: number): number`
Counts the total number of squares in an m×n grid.

**Parameters:**
- `m` - Grid height (rows)
- `n` - Grid width (columns)

**Returns:** Total number of squares of all sizes

**Example:**
```javascript
countSquares(3, 6); // Returns 32
countSquares(4, 4); // Returns 30
```

#### `findGridsWithSquares(targetCount: number, maxDimension?: number): GridDimensions[]`
Finds all grid dimensions that contain exactly the target number of squares.

**Parameters:**
- `targetCount` - The desired number of squares
- `maxDimension` - Maximum dimension to search (default: 100)

**Returns:** Array of `{width, height}` objects

**Example:**
```javascript
findGridsWithSquares(1365);
// Returns: [
//   {width: 33, height: 9},
//   {width: 9, height: 33},
//   {width: 19, height: 13},
//   {width: 13, height: 19}
// ]
```

#### `getSquareBreakdown(m: number, n: number): Record<string, number>`
Gets a detailed breakdown of squares by size.

**Parameters:**
- `m` - Grid height
- `n` - Grid width

**Returns:** Object mapping square size (e.g., "3×3") to count

**Example:**
```javascript
getSquareBreakdown(3, 6);
// Returns: {
//   "1×1": 18,
//   "2×2": 10,
//   "3×3": 4
// }
```

## Testing

The implementation was tested with:
- ✓ 3×6 grid correctly calculates 32 squares
- ✓ 4×4 grid correctly calculates 30 squares
- ✓ 1365 target finds 9×33, 33×9, 13×19, and 19×13 grids
- ✓ Detailed breakdowns sum to correct totals
- ✓ Interactive UI properly displays results

## Technical Notes

- The search algorithm has O(maxDimension²) time complexity
- Default search range is 1 to 100 for both dimensions
- Symmetric solutions (m×n and n×m) are both returned
- Square grids (m=m) are only returned once to avoid duplicates
- The calculator handles edge cases (0 or negative dimensions return 0 squares)
