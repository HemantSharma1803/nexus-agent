import {
  ExecutionStep,
  ActivityLogItem,
  SandboxState,
  Product,
  TaskRecord,
  BrowserSessionRecord,
  CandidateEvaluation,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

export interface ExecuteParams {
  goal: string;
  adaptiveRecoveryEnabled: boolean;
  onStepsChange: (steps: ExecutionStep[]) => void;
  onActivity: (activity: ActivityLogItem) => void;
  onSandboxChange: (updater: (prev: SandboxState) => SandboxState) => void;
  onStatusChange: (status: 'PLANNING' | 'OPERATING' | 'RECOVERING' | 'VERIFYING' | 'COMPLETED' | 'READY') => void;
  onCandidatesEvaluated: (candidates: CandidateEvaluation[]) => void;
  onFinish: (taskRecord: TaskRecord, sessionRecord: BrowserSessionRecord) => void;
  cancelSignal: { cancelled: boolean };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const DEFAULT_PLAN_STEPS: ExecutionStep[] = [
  { id: 'step-1', number: 1, label: 'Understand request', status: 'QUEUED' },
  { id: 'step-2', number: 2, label: 'Open marketplace', status: 'QUEUED' },
  { id: 'step-3', number: 3, label: 'Search products', status: 'QUEUED' },
  { id: 'step-4', number: 4, label: 'Apply budget constraint', status: 'QUEUED' },
  { id: 'step-5', number: 5, label: 'Compare candidates', status: 'QUEUED' },
  { id: 'step-6', number: 6, label: 'Select best match', status: 'QUEUED' },
  { id: 'step-7', number: 7, label: 'Add to cart', status: 'QUEUED' },
  { id: 'step-8', number: 8, label: 'Verify result', status: 'QUEUED' },
];

export async function executeNexusTask({
  goal,
  adaptiveRecoveryEnabled,
  onStepsChange,
  onActivity,
  onSandboxChange,
  onStatusChange,
  onCandidatesEvaluated,
  onFinish,
  cancelSignal,
}: ExecuteParams) {
  const startTime = Date.now();
  const currentSteps: ExecutionStep[] = DEFAULT_PLAN_STEPS.map((s) => ({
    ...s,
    status: 'QUEUED',
  }));

  const allActivities: ActivityLogItem[] = [];
  let recoveryOccurred = false;

  const logActivity = (
    message: string,
    type: ActivityLogItem['type'] = 'info'
  ) => {
    const item: ActivityLogItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      message,
      type,
    };
    allActivities.push(item);
    onActivity(item);
  };

  const setStepState = (
    index: number,
    status: ExecutionStep['status'],
    detail?: string
  ) => {
    if (currentSteps[index]) {
      currentSteps[index] = {
        ...currentSteps[index],
        status,
        detail,
      };
      onStepsChange([...currentSteps]);
    }
  };

  // Determine Scenario from goal input
  const isCompareScenario = /compare|recommend|value/i.test(goal);
  const isFindVerifyScenario = /2,?500|verify|rating above|rating of at least/i.test(goal);
  const isDataExtract = /extract|compile|catalog/i.test(goal);

  const scenarioTitle = isCompareScenario
    ? 'Compare Products'
    : isFindVerifyScenario
    ? 'Find & Verify'
    : isDataExtract
    ? 'Data Extraction'
    : 'Shopping Research';

  const budgetMatch = goal.match(/(?:under|below|within)\s*₹?\s*([\d,]+)/i) || goal.match(/₹\s*([\d,]+)/);
  const parsedBudget = budgetMatch ? Number(budgetMatch[1].replace(/,/g, '')) : NaN;
  const priceBudget = Number.isFinite(parsedBudget) && parsedBudget > 0
    ? parsedBudget
    : isFindVerifyScenario ? 2500 : 3000;
  const cartRequested = /add.{0,20}cart|cart/i.test(goal) && !isCompareScenario && !isFindVerifyScenario && !isDataExtract;
  const minimumRatingMatch = goal.match(/rating\s+(?:above|at least|of)\s*([\d.]+)/i);
  const minimumRating = minimumRatingMatch ? Number(minimumRatingMatch[1]) : (isFindVerifyScenario || isCompareScenario ? 4.6 : 0);

  // Select from actual sandbox catalog records, respecting the task constraints.
  const ratingIsStrict = /rating\s+above/i.test(goal);
  const eligibleProducts = INITIAL_PRODUCTS.filter((p) => p.price <= priceBudget && p.inStock && (ratingIsStrict ? p.rating > minimumRating : p.rating >= minimumRating));
  const rankedProducts = [...eligibleProducts].sort((a, b) => {
    if (isCompareScenario) return a.price - b.price || b.rating - a.rating;
    return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
  });
  const targetProduct: Product = isDataExtract
    ? INITIAL_PRODUCTS[0]
    : rankedProducts[0] || INITIAL_PRODUCTS.find((p) => p.id === 'k75') || INITIAL_PRODUCTS[0];
  currentSteps[6].label = cartRequested ? 'Add to cart' : isCompareScenario ? 'Prepare recommendation' : isFindVerifyScenario ? 'Confirm stock & rating' : 'Compile findings';

  // 1. PLANNING PHASE
  onStatusChange('PLANNING');
  setStepState(0, 'RUNNING');
  logActivity(`✓ Task interpreted: ${goal}`, 'info');
  await sleep(400);
  setStepState(0, 'DONE');

  // 2. OPERATING PHASE
  onStatusChange('OPERATING');
  if (cancelSignal.cancelled) return;
  setStepState(1, 'RUNNING');
  onSandboxChange((prev) => ({
    ...prev,
    activeSelector: null,
    currentActionLabel: 'Opening market.nexus.local...',
  }));
  logActivity('✓ Marketplace opened: https://market.nexus.local', 'action');
  await sleep(450);
  setStepState(1, 'DONE');

  // Step 3: Search products
  if (cancelSignal.cancelled) return;
  setStepState(2, 'RUNNING');
  onSandboxChange((prev) => ({
    ...prev,
    activeSelector: '#sandbox-search-box',
    currentActionLabel: 'Typing "mechanical keyboard"...',
  }));
  await sleep(350);
  onSandboxChange((prev) => ({
    ...prev,
    searchQuery: 'mechanical keyboard',
    currentActionLabel: 'Search query submitted',
  }));
  logActivity('✓ Search submitted: "mechanical keyboard"', 'action');
  await sleep(400);
  setStepState(2, 'DONE');

  // Step 4: Apply budget constraint
  if (cancelSignal.cancelled) return;
  setStepState(3, 'RUNNING');
  onSandboxChange((prev) => ({
    ...prev,
    activeSelector: '#sandbox-budget-slider',
    currentActionLabel: `Applying budget filter: ≤ ₹${priceBudget.toLocaleString('en-IN')}`,
  }));
  await sleep(400);
  onSandboxChange((prev) => ({
    ...prev,
    priceCap: priceBudget,
    currentActionLabel: `Budget set: ≤ ₹${priceBudget.toLocaleString('en-IN')}`,
  }));
  logActivity(`✓ Budget constraint applied (≤ ₹${priceBudget.toLocaleString('en-IN')})`, 'action');
  await sleep(400);
  setStepState(3, 'DONE');

  // Step 5: Compare candidates + ADAPTIVE RECOVERY (if enabled)
  if (cancelSignal.cancelled) return;
  setStepState(4, 'RUNNING');

  if (adaptiveRecoveryEnabled) {
    // Demonstration of Adaptive Recovery
    recoveryOccurred = true;
    onStatusChange('RECOVERING');
    onSandboxChange((prev) => ({
      ...prev,
      ratingLabelAdaptive: 'reviews',
      activeSelector: '#sandbox-sort-control',
      currentActionLabel: 'Target element changed. Detecting interface shift...',
    }));
    logActivity('Target element changed: Expected Customer Rating control unavailable.', 'warning');
    await sleep(500);

    logActivity('RECOVERY: NEXUS detected changed page state. Re-evaluating current page.', 'recovery');
    await sleep(400);

    logActivity('✓ Recovery successful: Located equivalent Reviews control. Workflow resumed.', 'recovery');
    onSandboxChange((prev) => ({
      ...prev,
      sortBy: 'rating',
      currentActionLabel: 'Adapted: Sorted via equivalent Reviews control',
    }));
    onStatusChange('OPERATING');
    await sleep(400);
  } else {
    onSandboxChange((prev) => ({
      ...prev,
      activeSelector: '#sandbox-sort-control',
      sortBy: 'rating',
      currentActionLabel: 'Sorting candidates by rating',
    }));
    await sleep(400);
  }

  // Populate comparison evaluation
  const candidateList: CandidateEvaluation[] = isCompareScenario
    ? [
        {
          id: 'k75',
          name: 'HyperKey K75 Compact',
          rating: 4.6,
          reviewsCount: 934,
          price: 2499,
          inStock: true,
          statusText: 'IN STOCK',
          isBestMatch: true,
          reason: 'Best Value: ₹2,499 with tactile Gateron Brown switches.',
        },
        {
          id: 'mk87',
          name: 'NEXUS MK-87 RGB',
          rating: 4.8,
          reviewsCount: 1842,
          price: 2799,
          inStock: true,
          statusText: 'IN STOCK',
          isBestMatch: false,
          reason: 'Premium choice: ₹2,799 with aluminum frame.',
        },
        {
          id: 'cyber-lite',
          name: 'CyberBoard Lite Studio',
          rating: 4.9,
          reviewsCount: 2100,
          price: 3499,
          inStock: true,
          statusText: 'OVER BUDGET',
          isBestMatch: false,
          reason: 'Exceeds ₹3,000 budget.',
        },
      ]
    : isFindVerifyScenario
    ? [
        {
          id: 'k75',
          name: 'HyperKey K75 Compact',
          rating: 4.6,
          reviewsCount: 934,
          price: 2499,
          inStock: true,
          statusText: 'IN STOCK',
          isBestMatch: true,
          reason: 'Meets criteria: Under ₹2,500 and 4.6★ rating verified.',
        },
        {
          id: 'type68',
          name: 'TypeCore 68 Mini',
          rating: 4.5,
          reviewsCount: 811,
          price: 2299,
          inStock: true,
          statusText: 'IN STOCK',
          isBestMatch: false,
          reason: 'Rating below 4.6 threshold (4.5★).',
        },
      ]
    : [
        {
          id: 'mk87',
          name: 'NEXUS MK-87 RGB',
          rating: 4.8,
          reviewsCount: 1842,
          price: 2799,
          inStock: true,
          statusText: 'IN STOCK',
          isBestMatch: true,
          reason: 'Highest-rated eligible product within budget.',
        },
        {
          id: 'cyber-lite',
          name: 'CyberBoard Lite Studio',
          rating: 4.9,
          reviewsCount: 2100,
          price: 3499,
          inStock: true,
          statusText: 'OVER BUDGET',
          isBestMatch: false,
          reason: 'Exceeds budget (₹3,499 > ₹3,000).',
        },
        {
          id: 'tkl-forge',
          name: 'KeyForge TKL Blue',
          rating: 4.7,
          reviewsCount: 1201,
          price: 2999,
          inStock: true,
          statusText: 'IN STOCK',
          isBestMatch: false,
          reason: 'Eligible, but lower rating (4.7★ vs 4.8★).',
        },
      ];

  onCandidatesEvaluated(candidateList);
  logActivity(`✓ ${candidateList.length} candidates evaluated and ranked`, 'info');
  await sleep(450);
  setStepState(4, 'DONE');

  // Step 6: Select best match
  if (cancelSignal.cancelled) return;
  setStepState(5, 'RUNNING');
  onSandboxChange((prev) => ({
    ...prev,
    activeSelector: `#product-${targetProduct.id}`,
    selectedProductId: targetProduct.id,
    currentActionLabel: `Selected: ${targetProduct.name}`,
  }));

  logActivity(
    `✓ Best match selected: ${targetProduct.name} (${targetProduct.rating}★ · ₹${targetProduct.price.toLocaleString('en-IN')})`,
    'action'
  );
  await sleep(550);
  setStepState(5, 'DONE');

  // Step 7: Perform only the action requested by the user.
  if (cancelSignal.cancelled) return;
  setStepState(6, 'RUNNING');
  if (cartRequested) {
    onSandboxChange((prev) => ({ ...prev, activeSelector: `#btn-add-${targetProduct.id}`, currentActionLabel: `Adding ${targetProduct.name} to cart...` }));
    await sleep(400);
    onSandboxChange((prev) => ({ ...prev, cart: [{ product: targetProduct, quantity: 1 }], cartOpen: true, currentActionLabel: 'Item added to cart' }));
    logActivity(`✓ Cart updated: 1 item (${targetProduct.name}) added`, 'action');
  } else {
    onSandboxChange((prev) => ({ ...prev, activeSelector: null, currentActionLabel: isCompareScenario ? 'Preparing product recommendation' : isFindVerifyScenario ? 'Confirming stock and rating' : 'Compiling catalog findings' }));
    logActivity(isCompareScenario ? '✓ Comparison prepared; no cart action requested.' : isFindVerifyScenario ? '✓ Stock and rating criteria checked; no cart action requested.' : '✓ Catalog findings compiled; no cart action requested.', 'action');
  }
  await sleep(350);
  setStepState(6, 'DONE');

  // 3. VERIFYING PHASE
  onStatusChange('VERIFYING');
  if (cancelSignal.cancelled) return;
  setStepState(7, 'RUNNING');
  onSandboxChange((prev) => ({
    ...prev,
    activeSelector: cartRequested ? '#sandbox-cart-button' : null,
    currentActionLabel: cartRequested ? 'Verifying cart state, stock, and constraints...' : 'Verifying product constraints and final result...',
  }));
  await sleep(500);

  logActivity('✓ Result verified: All goal constraints satisfied', 'success');
  setStepState(7, 'DONE');

  // Clear action overlay
  onSandboxChange((prev) => ({
    ...prev,
    activeSelector: null,
    currentActionLabel: null,
  }));

  // 4. COMPLETED PHASE
  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
  onStatusChange('COMPLETED');

  const taskRecord: TaskRecord = {
    id: `tsk-${Date.now().toString(36)}`,
    goal,
    scenarioTitle,
    status: recoveryOccurred ? 'Recovered' : 'Completed',
    duration: totalDuration,
    actionsCount: cartRequested ? 12 : 10,
    productsEvaluated: candidateList.length,
    selectedProduct: targetProduct,
    resultSummary: isCompareScenario
      ? `${targetProduct.name} recommended from the sandbox comparison at ₹${targetProduct.price.toLocaleString('en-IN')}.`
      : isFindVerifyScenario
      ? `${targetProduct.name} meets the requested rating and price criteria; stock verified.`
      : isDataExtract
      ? `Catalog findings compiled; leading match: ${targetProduct.name}.`
      : `${targetProduct.name} added to cart at ₹${targetProduct.price.toLocaleString('en-IN')}.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    confidence: 96,
    steps: [...currentSteps],
    activities: [...allActivities],
    recoveryCount: recoveryOccurred ? 1 : 0,
    verificationPoints: [
      `Within budget (₹${targetProduct.price.toLocaleString('en-IN')} ≤ ₹${priceBudget.toLocaleString('en-IN')})`,
      `Rating requirement checked (${targetProduct.rating.toFixed(1)}★${minimumRating ? ` / minimum ${minimumRating}★` : ''})`,
      targetProduct.inStock ? 'In stock in sandbox catalog' : 'Out of stock in sandbox catalog',
      ...(cartRequested ? ['Added to sandbox cart'] : [isCompareScenario ? 'Recommendation prepared' : isFindVerifyScenario ? 'Stock criteria verified' : 'Catalog findings compiled']),
      'Result verified against sandbox state',
    ],
  };

  const sessionRecord: BrowserSessionRecord = {
    id: `NEXUS-SESSION-${Math.floor(100 + Math.random() * 900)}`,
    website: 'Marketplace Sandbox',
    url: 'https://market.nexus.local/keyboards',
    status: 'Completed',
    startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: totalDuration,
    actionsCount: taskRecord.actionsCount,
    result: 'Verified',
    taskId: taskRecord.id,
  };

  onFinish(taskRecord, sessionRecord);
}
