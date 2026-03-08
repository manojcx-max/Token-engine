export interface DriftViolation {
    id: string;
    type: 'color' | 'typography' | 'spacing' | 'radius';
    severity: 'high' | 'medium' | 'low';
    description: string;
    expected: string;
    actual: string;
    page: string;
}

export interface Tokens {
    colors: {
        brand: Record<string, string>;
        neutral: Record<string, string>;
        text: { primary: string; secondary: string };
        background: { primary: string; surface: string };
        border?: { default: string };
        accents?: string[];
    };
    typography: {
        fontFamily: { heading: string; body: string; ui: string };
        fontSize: Record<string, string>;
        fontWeight?: Record<string, string>;
    };
    spacing: Record<string, string>;
    radius: {
        sm: string;
        md: string;
        lg: string;
    };
    zIndices?: Record<string, number>;
    shadow?: Record<string, string>;
    gradients?: string[];
    motion?: {
        duration: {
            fast: string;
            normal: string;
            slow: string;
        };
        easing: {
            standard: string;
            emphasized: string;
        };
        usage?: Record<string, number>;
        types?: string[];
    };
    screens?: Record<string, string>;
    stats?: {
        extractionTime: string;
        tokensFound: number;
        nodesSampled?: number;
        healthScore?: number;
    };
    extractionMeta?: {
        confidence: "high" | "medium" | "low";
        coveragePercentage: number;
        nodesSampled: number;
    };
    clusteringMeta?: {
        spacing: any;
        radius: any;
    };
    exports: {
        css: string;
        tailwind: any;
        json?: any;
        prompts: {
            universal: string;
            v0: string;
            claude: string;
            antigravity: string;
        };
    };
    crawlData?: {
        pagesAnalyzed: string[];
        violations: DriftViolation[];
        summary: string;
    };
}

export interface ExtractionHistory {
    url: string;
    domain: string;
    timestamp: number;
}

export interface SavedAnalysis {
    id: string;
    url: string;
    domain: string;
    timestamp: number;
    tokens: Tokens;
    activeRemix?: any;
}
