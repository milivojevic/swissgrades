# Swiss Primary School Grading Models

This document describes the four different grading models implemented in the Swiss Grading Visualizer.

## Parameters

- **MP (Maximum Points)**: The total number of points achievable on an assessment
- **PPP (Passing Points for Grade 4)**: The threshold for achieving a passing grade
- **Granularity**: The rounding precision for final grades (full, half, quarter, or tenth grades)

---

## Model 1: Inclusive

**Philosophy**: Fair and encouraging - reaching the threshold is sufficient.

**Calculation**:
- **0 to PPP**: Linear interpolation from grade 1.0 → 4.0
- **PPP to MP**: Linear interpolation from grade 4.0 → 6.0

**Key Characteristics**:
- Reaching exactly PPP gives you grade 4.0
- Reaching exactly MP gives you grade 6.0
- Smooth, continuous progression
- Most commonly used in Swiss schools
- Encourages students by rewarding threshold achievement

**Example** (MP=25, PPP=12.5):
- 0 points = 1.0
- 12.5 points = 4.0 (passing)
- 25 points = 6.0 (perfect)

---

## Model 2: Exclusive (Abrunden)

**Philosophy**: Strict and demotivating - you must reach exact thresholds for integer grades.

**Calculation**:
- **0 to just below PPP**: Linear interpolation from grade 1.0 → 3.9999...
- **Exactly PPP**: Grade 4.0
- **PPP to just below MP**: Linear interpolation from grade 4.0 → 5.9999...
- **Exactly MP**: Grade 6.0

**Key Characteristics**:
- Grade 4 is achieved ONLY at exactly PPP
- Grade 6 is achieved ONLY at exactly MP (100% correctness)
- Below thresholds, you can never quite reach the next integer grade
- Creates "jumps" at PPP and MP
- **Most demotivating** for children - always rounding down unless exact
- German name "Abrunden" = "rounding down"

**Example** (MP=25, PPP=12.5):
- 0 points = 1.0
- 12.0 points = 3.84 (still failing!)
- 12.5 points = 4.0 (passing threshold reached)
- 24.5 points = 5.9 (still not a 6!)
- 25.0 points = 6.0 (perfection achieved)

**Why it's problematic**:
- A student with 24.5/25 points (98% correct) gets 5.9, not 6.0
- Discourages excellence - only absolute perfection earns the top grade
- Creates unfair "cliff edges" where small point differences have huge grade impacts

---

## Model 3: Equal Width

**Philosophy**: Mathematical purity - ignore the passing threshold entirely.

**Calculation**:
- **Formula**: Grade = 1 + 5 × (points / MP)
- Divides the entire range into five equal intervals
- PPP is completely ignored

**Key Characteristics**:
- Perfectly linear across the entire range
- Highest "fairness score" (closest to ideal linearity)
- Each grade interval represents exactly 20% of total points
- Pedagogically problematic - doesn't respect the concept of "passing"

**Example** (MP=25, PPP=12.5):
- 0 points = 1.0
- 5 points = 2.0
- 10 points = 3.0
- 15 points = 4.0 (passing, regardless of PPP)
- 20 points = 5.0
- 25 points = 6.0

**Why it's used**:
- Simplest to understand and calculate
- Most "fair" in terms of point distribution
- Often used when the concept of a passing threshold is less important
- Common in standardized testing

---

## Model 4: Compressed 6

**Philosophy**: Rewards excellence by making grade 6 more accessible.

**Calculation**:
- **0 to PPP**: Linear interpolation from grade 1.0 → 4.0
- **PPP to Grade 5.5 threshold**: Linear interpolation from grade 4.0 → 5.5
- **Grade 5.5 threshold to MP**: Linear interpolation from grade 5.5 → 6.0
- The final interval (5.5 → 6.0) is half the width of other intervals

**Key Characteristics**:
- Divides the range into 5.5 intervals instead of 5
- The path to grade 6 is compressed (shorter)
- Makes achieving a 6 more accessible than the Inclusive model
- Rewards high achievers without requiring absolute perfection

**Example** (MP=25, PPP=12.5):
- 0 points = 1.0
- 12.5 points = 4.0 (passing)
- 22.73 points = 5.5
- 25 points = 6.0

**Why it's beneficial**:
- Acknowledges that grade 6 is special but shouldn't require 100% perfection
- More forgiving than the Exclusive model
- Encourages students to strive for excellence
- Balances fairness with achievability

---

## Fairness Score

The visualizer calculates a "fairness score" for each model by comparing the actual grade progression to a perfectly linear progression (Equal Width model). The score represents how closely the model adheres to proportional grade distribution.

- **100%** = Perfect linearity (Equal Width always achieves this)
- **Lower scores** = Greater deviation from linearity (typically at the PPP threshold)

---

## Visual Elements

### Color Coding
- **Red segments**: Failing range (grades 1-4)
- **Green segments**: Passing range (grades 4-6)
- **Gradient on markers**: Each point is colored according to its grade value

### Lines
- **Thin, semi-transparent lines**: Show the exact mathematical grade progression
- **Thick, colored lines**: Show the rounded grades (what students actually receive)
- **Blue dashed line**: Marks the PPP threshold

---

## Recommendations

1. **Model 1 (Inclusive)**: Recommended for most school assessments - fair and encouraging
2. **Model 2 (Abrunden)**: Generally not recommended - overly strict and demotivating
3. **Model 3 (Equal Width)**: Good for standardized tests where passing thresholds are flexible
4. **Model 4 (Compressed 6)**: Excellent for rewarding excellence while maintaining fairness

---

*Created with the Swiss Primary School Grading System Visualizer*
