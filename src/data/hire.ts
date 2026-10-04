// Content for the recruiter page. Experience comes from career.ts so the two never drift apart.
export const location = { city: "Des Moines, IA", remote: "Open to remote" };

export const highlights = [
  { text: "Leading a SLSA Build Level 3 pipeline for the company's builds", when: "Tech lead · 2026 – now" },
  { text: "Main designer of the company's reusable security workflows for GitHub Actions", when: "2024 – now" },
  { text: "Built distroless base images used as the standard base by every developer", when: "2022 – 2024" },
  { text: "Built a pipeline that attaches a signed SBOM and cosign attestations to every container", when: "2022 – 2024" },
];

export const skills = [
  { label: "CI/CD", tools: ["GitHub Actions", "CircleCI", "Concourse", "Jenkins"] },
  { label: "Platform", tools: ["Kubernetes", "GKE", "Argo CD", "Docker"] },
  { label: "Security", tools: ["SLSA", "Sigstore", "cosign", "SBOM", "Trivy", "Semgrep"] },
  { label: "Cloud", tools: ["GCP", "AWS", "GitHub EMU", "JFrog Artifactory"] },
  { label: "Languages", tools: ["Python", "Java", "TypeScript"] },
];
