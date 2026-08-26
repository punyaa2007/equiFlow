# 🤖 MEMBER 2 — AI Analysis & Bottleneck Intelligence

**Project:** EquiFlow – Intelligent Team Workload & Bottleneck Prediction Platform  
**Owner:** Member 2 (AI Analysis & Bottleneck Intelligence)  
**Status:** Completed & Integrated (10/10 Deliverables Tested & Verified)

---

## 📌 Executive Summary

Member 2 takes structured raw work data from **Member 1 (Work & Contribution Tracking)** and transforms it into computational intelligence consumed by **Member 3 (Dashboard, Visualizations & Simulation)**.

```
┌────────────────────────────────────────┐
│     MEMBER 1: WORK DATA LAYER          │
│ Users, Tasks, Work Logs, Dependencies  │
└──────────────────┬─────────────────────┘
                   │  JSON Data Contract
                   ▼
┌────────────────────────────────────────┐
│     MEMBER 2: AI INTELLIGENCE ENGINE   │
│ 1. Work Classification                 │
│ 2. Workload & Hidden Work Calculation  │
│ 3. Dependency & Critical Path Analysis │
│ 4. Multi-Factor Bottleneck Scoring     │
│ 5. Delay & Project Risk Prediction     │
│ 6. AI Recommendation Engine            │
│ 7. What-If Simulation Engine           │
└──────────────────┬─────────────────────┘
                   │  Structured Intelligence
                   ▼
┌────────────────────────────────────────┐
│     MEMBER 3: DASHBOARD & SIMULATION   │
│ Visual KPIs, Graph, Simulation Modal   │
└────────────────────────────────────────┘
```

---

## 📂 Architecture & Module Breakdown

All Member 2 modules are cleanly organized in `src/ai/`:

| Module | File | Responsibility |
|---|---|---|
| **Work Classifier** | [`classifier.js`](file:///c:/Users/kandd/Downloads/equiFlow/src/ai/classifier.js) | Categorizes work logs into `Core Task`, `Support`, `Review`, `Rework`, `Interruption`, `Other` using keyword/pattern NLP heuristics. |
| **Workload Engine** | [`workloadEngine.js`](file:///c:/Users/kandd/Downloads/equiFlow/src/ai/workloadEngine.js) | Computes Assigned vs Actual vs Hidden Workload hours, Workload Percentage, and Capacity Status (`Optimal`, `Overloaded`, `Underloaded`). |
| **Dependency Analyzer** | [`dependencyAnalyzer.js`](file:///c:/Users/kandd/Downloads/equiFlow/src/ai/dependencyAnalyzer.js) | Builds Directed Acyclic Graph (DAG), calculates in/out degrees, identifies blocked tasks, and computes downstream blast radius. |
| **Bottleneck Detector** | [`bottleneckDetector.js`](file:///c:/Users/kandd/Downloads/equiFlow/src/ai/bottleneckDetector.js) | Multi-factor composite bottleneck scoring formula, detects primary bottleneck task & affected member with explainable root cause. |
| **Risk Predictor** | [`riskPredictor.js`](file:///c:/Users/kandd/Downloads/equiFlow/src/ai/riskPredictor.js) | Predicts Project Delay Risk (0–100%), Bottleneck Risk (`LOW`/`MEDIUM`/`HIGH`), Overload Risk, and Project Health Score. |
| **Recommendation Engine** | [`recommendationEngine.js`](file:///c:/Users/kandd/Downloads/equiFlow/src/ai/recommendationEngine.js) | Identifies optimal task rebalancing from overloaded members to candidate members with available capacity. |
| **Simulation Engine** | [`simulationEngine.js`](file:///c:/Users/kandd/Downloads/equiFlow/src/ai/simulationEngine.js) | Computes mathematical `BEFORE` vs `AFTER` what-if impact for dashboard simulation. |
| **Data Store** | [`dataset.js`](file:///c:/Users/kandd/Downloads/equiFlow/src/ai/dataset.js) | Realistic mock dataset adhering to Member 1's database/API schema. |
| **AI Central Service** | [`aiIntelligenceService.js`](file:///c:/Users/kandd/Downloads/equiFlow/src/ai/aiIntelligenceService.js) | Unified orchestration pipeline and facade exporting formatted intelligence. |
| **Test Suite** | [`test_member2_ai.js`](file:///c:/Users/kandd/Downloads/equiFlow/test_member2_ai.js) | Full test suite validating all 10 Member 2 capabilities. |

---

## 🧮 Mathematical Formulations & Methodologies

### 1. Hidden Workload Formulation
$$W_{\text{hidden}} = W_{\text{support}} + W_{\text{rework}} + W_{\text{interruption}} + W_{\text{review}}$$

$$\text{Workload Percentage} = \left( \frac{W_{\text{actual}}}{\text{Capacity Hours}} \right) \times 100\%$$

### 2. Multi-Factor Bottleneck Scoring Formula
$$\text{Score}(T, M) = \Big( 0.40 \cdot \text{Overload}(M) + 0.35 \cdot \text{Downstream}(T) + 0.15 \cdot \text{Complexity}(T) + 0.10 \cdot \text{HiddenRatio}(M) \Big) \times 100$$

Where:
- $\text{Overload}(M)$: normalized ratio of member $M$'s actual hours vs capacity.
- $\text{Downstream}(T)$: transitive downstream tasks count blocked by $T$.
- $\text{Complexity}(T)$: High ($1.3\times$), Medium ($1.0\times$), Low ($0.7\times$).
- $\text{HiddenRatio}(M)$: $\frac{W_{\text{hidden}}}{W_{\text{actual}}}$, measuring context switching friction.

### 3. Delay Risk Model
$$\text{Delay Risk} = 0.50 \cdot (\text{Bottleneck Score}) + 0.30 \cdot (\text{Blocked Tasks \%}) + 0.20 \cdot (\text{Overload Severity}) + 15$$

---

## 🔄 Input Contract (from Member 1)

```json
{
  "members": [
    { "id": "M01", "name": "Member A", "role": "Frontend Developer", "capacity_hours": 10 }
  ],
  "tasks": [
    { "id": "TASK-B", "name": "Database Schema", "priority": "HIGH", "complexity": "High", "estimatedHours": 10, "assignedMember": "Member B", "status": "In Progress", "dependencies": ["TASK-A"] }
  ],
  "workLogs": [
    { "id": "LOG-01", "memberId": "M02", "hours": 3, "category": "Support", "description": "Unblocking DB setup" }
  ],
  "dependencies": [
    { "from": "TASK-A", "to": "TASK-B" }
  ]
}
```

---

## 📊 Output Contract (to Member 3)

```json
{
  "dashboardSummary": {
    "projectName": "EquiFlow Core",
    "projectHealth": "Needs Attention",
    "projectHealthScore": 78,
    "bottleneckRisk": "HIGH",
    "delayRisk": 72,
    "hiddenWorkHours": 5,
    "aiRecommendation": "Move TASK-B from Member B to Member C..."
  },
  "teamWorkload": [
    {
      "name": "Member B",
      "assignedHours": 10,
      "actualHours": 15,
      "hiddenWorkHours": 5,
      "workloadPercentage": 118,
      "status": "Overloaded"
    }
  ],
  "bottleneckInfo": {
    "affectedMember": "Member B",
    "riskLevel": "HIGH",
    "reason": "High workload (15 actual hrs logged vs 10 assigned hrs, including 5 hidden hrs)...",
    "affectedTasks": [
      { "id": "TASK-C", "status": "Blocked", "delayEstimate": "+2 days" }
    ]
  },
  "simulationData": {
    "before": { "memberBWorkload": 118, "delayRisk": 72, "bottleneckRisk": "HIGH" },
    "recommendation": { "suggestion": "Move TASK-B from Member B to Member C" },
    "after": { "memberBWorkload": 91, "delayRisk": 31, "bottleneckRisk": "LOW" }
  }
}
```

---

## 🧪 Verification & Running Tests

To run Member 2's automated test suite:
```bash
node test_member2_ai.js
```
